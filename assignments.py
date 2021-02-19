import asyncio
import datetime
import json
import re
import traceback
from collections import namedtuple
from typing import List
import sys

import aiohttp
import bs4
import requests

from utils import get_cookies, get_headers

headers = get_headers()
cookies = get_cookies()

Course = namedtuple("Course", ('name', 'desc', 'year', 'link'))
Assignment = namedtuple("Assignment", ('course', 'name', 'deadline', 'late_deadline', 'submitted', 'grade'))



def get_courses_list():
    courses = []
    try:
        j = json.load(open('courses.json', ))
        for obj in j:
            courses.append(Course(obj['name'], obj['desc'], obj['year'], obj['link']))
        return courses
    except:
        print('Courses list not found in cache. Retrieving...',file = sys.stderr)
        json_objs = []
        visited_links=set()
        req = requests.get('https://gradescope.com/', headers = headers, cookies = cookies)
        req.raise_for_status()
        soup = bs4.BeautifulSoup(req.text, 'html.parser')
        # <a class="courseBox" href="$link">
        #     <h3 class="courseBox--shortname">$name</h3>
        #     <h4 class="courseBox--name">$desc</h4>
        #     <div class="courseBox--assignments">7 assignments</div>
        #     <!-- the courseBox--assignments can be safely ignored because we are crawling all pages
        #     for grades anyway -->
        # </a>
        term = soup.find_all('h2', attrs = {'class': 'courseList--term'})
        for t in term[::-1]:
            year = int(re.search(r'\d{4}', t.text).group(0))
            for tag in t.find_all_next('a', attrs = {'class': 'courseBox'}):
                name = tag.find(attrs = {'class': 'courseBox--shortname'}).text
                desc = tag.find(attrs = {'class': 'courseBox--name'}).text
                link = tag.attrs['href']
                if link in visited_links:
                    break
                visited_links.add(link)
                d = {'name': name, 'desc': desc, 'year': year, 'link': link}
                courses.append(Course(name, desc, year, link))
                json_objs.append(d)
        json.dump(json_objs, open('courses.json', 'w'),indent = 4)
    return courses


def parse_date(date: str,year):
    # sadly strptime can't handle this
    months = {'jan': 1,
              'feb': 2,
              'mar': 3,
              'apr': 4,
              'may': 5,
              'jun': 6,
              'jul': 7,
              'aug': 8,
              'sep': 9,
              'oct': 10,
              'nov': 11,
              'dec': 12
              }
    match = re.search(
        r'(?P<month>jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w* +(?P<day>\d{1,2}) +at +(?P<hour>\d{1,2}):(?P<minute>\d{1,2})(?P<ampm>am|pm)',
        date, re.I)
    if match is None:
        raise ValueError("Cannot parse date " + date)
    month = months[match.group('month').lower()]
    day = int(match.group('day'))
    hour = int(match.group('hour'))
    minute = int(match.group('minute'))
    if match.group('ampm').lower() == 'pm' and hour != 12:
        hour += 12
    return datetime.datetime(year = year, month = month, day = day, hour = hour,
                             minute = minute)


def parse_course(course, html):
    soup = bs4.BeautifulSoup(html, 'html.parser')
    table = soup.find('table', attrs = {'id': 'assignments-student-table'}).find('tbody')
    rows = table.find_all('tr')
    assignments = []
    for row in rows:
        try:
            release_date = row.find(attrs = {'class': 'submissionTimeChart--releaseDate'}).text
            dues = row.find_all(attrs = {'class': 'submissionTimeChart--dueDate'})
            due_date = parse_date(dues[0].text,course.year)
            if len(dues) == 2:
                late_due_date = dues[1].text
                assert late_due_date.startswith('Late Due Date: ')
                late_due_date = parse_date(late_due_date,course.year)
            else:
                late_due_date = None
            try:
                name = row.find('th')
                a = name.find('a')
                if a is not None:
                    name = a.text
                else:
                    name = name.text  # overdue unsubmitted assignment
            except AttributeError:
                name = row.find('button').text  # pending assignment

            grade = row.find('td', attrs = {'class': 'submissionStatus'})
            submitted = grade.find('div', attrs = {'class': 'submissionStatus--text'})
            grade = grade.find('div', attrs = {'class': 'submissionStatus--score'})
            if grade:
                submitted = True
                grade = grade.text
            else:
                submitted = submitted.text == 'Submitted'
            assignments.append(Assignment(course, name, due_date, late_due_date, submitted, grade))
        except Exception as e:
            print("Cannot parse an assignemnt from", course.name,file = sys.stderr)
            print("Error:", traceback.format_exc(),file = sys.stderr)
            print("Raw html is", row.prettify(),file = sys.stderr)
    return assignments


async def retrieve_assignments(courses_list):
    session = aiohttp.ClientSession()
    assignments = []

    async def make_request(course):
        print(f'retrieving {course.name}',file = sys.stderr)
        rep = await session.get('https://gradescope.com' + course.link, headers = headers, cookies = cookies)
        assert rep.status == 200
        html = await rep.text()
        assignments.extend(parse_course(course, html))

    fut = []
    for c in courses_list:
        fut.append(make_request(c))
    await asyncio.gather(*fut)
    await session.close()
    return assignments


assignments: List[Assignment] = asyncio.run(retrieve_assignments(get_courses_list()))

from assignments import assignments,Assignment
import datetime
from collections import defaultdict
import pprint

pending_assignments=[]
now=datetime.datetime.now()
for a in assignments:
    if (a.deadline > now or (a.late_deadline and a.late_deadline > now)) and not a.submitted:
        pending_assignments.append(a)

d=defaultdict(list)

for a in pending_assignments:
    d[a.deadline.date()].append(a)

for v in d.values():
    v.sort(key = lambda a:a.deadline.time())

for key in sorted(d.keys()):
    print('-'*78)
    print(f'{"Assignments due on "+key.strftime("%A, %b %-d"): ^78}')
    for a in d[key]:
        print(f'{a.name} ({a.course.name}): {a.deadline.strftime("%-I:%M %p")}')
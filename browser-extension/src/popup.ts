import "./popup.scss"
import $ from "jquery";
import "foundation-sites";
import {getCourses} from "./courses"
import {Assignment, getAssignments} from "./assignments";
import {strftime} from "./strftime"

const root = $("#main");
const now = new Date();

(async () => {
    let courses = (await getCourses()).filter(c => c.active);
    let i = 0;
    let assignments: Assignment[] = [];
    let promise = new Promise((resolve) => {
        for (let course of courses)
            getAssignments(course).then(a => {
                assignments.push(...a)
                i += 1;
                if (i == courses.length) resolve(void "⊂(´・ω・｀⊂)") // embrace the void
            })
    })
    await promise;
    localStorage.setItem("assignments", JSON.stringify(assignments));
    console.log(assignments)
    root.empty();
    let pending_assignments = assignments
        .filter(a => (a.deadline > now || a.lateDeadline > now) && !a.submitted)
        .sort((a,b)=>a.deadline<b.deadline?-1:a.deadline==b.deadline?0:1);
    let table = $("<table><tr><td>Name</td><td>Course</td><td>Deadline</td></tr></table>").appendTo(root);
    console.log(pending_assignments);
    for (let a of pending_assignments){
        let link=$(`<td><a href="https://gradescope.com${a.action?a.action:a.course.link+"#grade-click="+a.name}" target="_blank">${a.name}</a></td>`)
        let course=$(`<td>${a.course.name}</td>`)
        let deadline=$("<td>"+strftime(a.deadline,"%A, %b %d %I:%M %p")+"</td>");
        $("<tr>").append(link).append(course).append(deadline).appendTo(table);

    }
})()


// @ts-ignore
$(document).foundation();
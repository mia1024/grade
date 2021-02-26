import $ from "jquery";
import {getCookies} from "./cookies";

export async function makeRequest(endpoint:string){
    let cookies = await getCookies();
    let cookieHeader = ''
    for (let c of cookies) {
        cookieHeader += `${c.name}=${c.value};`
    }
    let response = await $.ajax(
        "https://www.gradescope.com"+endpoint,
        {
            headers: {
                cookies: cookieHeader
            }
        }
    );
    let parser = new DOMParser;
    return $(parser.parseFromString(response, "text/html"));
}

export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;
export type DOM=Awaited<ReturnType<typeof makeRequest>>

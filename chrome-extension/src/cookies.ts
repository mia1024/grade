/// <reference types="../node_modules/@types/chrome" />


export function getCookies(): Promise<chrome.cookies.Cookie[]>{
    return new Promise((resolve)=> {
        chrome.cookies.getAll({"url": "https://www.gradescope.com"}, cookies => {
            resolve(cookies);
        });
    })
}


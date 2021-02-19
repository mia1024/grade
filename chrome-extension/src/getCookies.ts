/// <reference types="../node_modules/@types/chrome" />

let c;

chrome.cookies.getAll({"url":"https://www.gradescope.com"},cookies => {
    console.log(cookies);
});

module .exports={
    cookies:c
}
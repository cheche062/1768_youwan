"use strict";
function* show() {
    yield 12;
    yield 55;
    yield 100;
}



console.log(show().next());
console.log(show().next());
console.log(show().next());

// es5
function makeIterator(array) {
    var nextIndex = 0;

    return {
        next: function() {
            return nextIndex < array.length ? { value: array[nextIndex++], done: false } : { done: true };
        }
    };
}

var it = makeIterator(['a', 'b']);
console.log(it.next().value); // 'a'
console.log(it.next().value); // 'b'
console.log(it.next().done); // true



// ex6
function* idMaker() {
    var index = 0;
    while (true)
        yield index++;
}

var gen = idMaker();

console.log(gen.next().value); // 0
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2

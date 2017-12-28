var sayHello = (name:string) => {
    console.log("Hello ", name);
}


function timeout(ms:any) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms, 'done');
    });
}

timeout(1000).then((value) => {
    console.log(value);
});



sayHello("cheche");
console.log("typescript")

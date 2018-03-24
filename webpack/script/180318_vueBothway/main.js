import Vue from './vue';

let demo = new Vue({
    data: {
        name: 'cheche',
        age: 18
    }
})

let watch1 = demo.$watch("name", (value) => {
    console.log("【update name 】: ", value);
})
demo.$watch("age", (value) => {
    console.log("【update age 】: ", value);
})

demo.name = "meihao";
demo.name = "uknow";

console.log('main.js')

import Vue from './vue';

let demo = new Vue({
    data: {
        name: 'cheche',
        like: ['food', 'ball']
    }
})

demo.$watch("name", (value) => {
    console.log("【update view111】: ", value);
})


demo.name = "meihao";
demo.name = "meihao";

console.log('main.js')

import Person from "./Person";


export default class Child extends Person{
    private age:number;
    constructor(name:string, age:number){
        super(name);
        this.age = age;

    }

    /**
     * showMe
     */
    public show() {
        super.show();
        console.log("我的年龄：", this.age);
    }
}
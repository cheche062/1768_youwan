export default class Person{
    protected name:string;
    constructor(name:string){
        this.name = name;

    }

    /**
     * showName
     */
    public show() {
        console.log('我的名字叫999999： ', this.name);
    }
}


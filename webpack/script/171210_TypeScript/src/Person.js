"use strict";
exports.__esModule = true;
var Person = /** @class */ (function () {
    function Person(name) {
        this.name = name;
    }
    /**
     * showName
     */
    Person.prototype.show = function () {
        console.log('我的名字叫999999： ', this.name);
    };
    return Person;
}());
exports["default"] = Person;

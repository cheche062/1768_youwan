"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Person_1 = require("./Person");
var Child = /** @class */ (function (_super) {
    __extends(Child, _super);
    function Child(name, age) {
        var _this = _super.call(this, name) || this;
        _this.age = age;
        return _this;
    }
    /**
     * showMe
     */
    Child.prototype.show = function () {
        _super.prototype.show.call(this);
        console.log("我的年龄：", this.age);
    };
    return Child;
}(Person_1["default"]));
exports["default"] = Child;

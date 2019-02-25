'use strict';

class Person {
    constructor(id, name, age = 0, mobile) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.mobile = mobile;
    }
}

module.exports = Person;
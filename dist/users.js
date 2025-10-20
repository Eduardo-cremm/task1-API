"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = addUser;
exports.getUsers = getUsers;
const users = [];
function addUser(user) {
    users.push(user);
}
function getUsers() {
    return users;
}

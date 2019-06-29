"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _user = _interopRequireDefault(require("../entity/user.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var user1 = new _user["default"].Builder().setId(1).setFirstName('Kong').setLastName('Badass').setEmail('kong@mail.net').setAddress('No.5 Makspeson Avenue').setPhoneNumber('0803737646').setPassword('@#%^@$*').setIsAdmin(true).build();
var user2 = new _user["default"].Builder().setId(2).setFirstName('Hong').setLastName('Kelan').setEmail('hong@mail.net').setAddress('No.5 green Avenue').setPhoneNumber('0869737646').setPassword('/%^3#(*$').setIsAdmin(true).build();
var user3 = new _user["default"].Builder().setId(3).setFirstName('Bong').setLastName('Sallim').setEmail('bong@mail.net').setAddress('No.2 RedVille circle').setPhoneNumber('0803737435').setPassword('!@&*#@').setIsAdmin(true).build();
var users = [user1, user2, user3];
var _default = users;
exports["default"] = _default;
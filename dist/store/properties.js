"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _property = _interopRequireDefault(require("../entity/property.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var prop1 = new _property["default"].Builder().setId(1).setOwner(2).setStatus('Available').setPrice('50000$').setState('GA').setCity('Austel').setAddress('4568 Maidison circle').setType('Duplex').setCreatedOn().setImageUrl('').build();
var prop2 = new _property["default"].Builder().setId(2).setOwner(1).setStatus('Sold').setPrice('501200$').setState('NY').setCity('Washinton').setAddress('No.403 Grails Ave').setType('Bungalow').setCreatedOn().setImageUrl('').build();
var prop3 = new _property["default"].Builder().setId(3).setOwner(3).setStatus('Available').setPrice('45000$').setState('TEX').setCity('Texas').setAddress('NO.45 Yellow Mond field').setType('3 bedrooms').setCreatedOn().setImageUrl('').build();
var props = [prop1, prop2, prop3];
var _default = props;
exports["default"] = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _flag = _interopRequireDefault(require("../entity/flag.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var flag1 = new _flag["default"].Builder().setId(1).setPropertyId('003').setReason('Outrageous Pricing!').setDescription('House Report').setCreatedOn().build();
var flag2 = new _flag["default"].Builder().setId(2).setPropertyId(2).setReason('Location does not exist').setDescription('Fake advert').setCreatedOn().build();
var flag3 = new _flag["default"].Builder().setId(3).setPropertyId(3).setReason('Poor facilities').setDescription('Uncondusive house').setCreatedOn().build();
var flags = [flag1, flag2, flag3];
var _default = flags;
exports["default"] = _default;
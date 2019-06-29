"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _apiV = _interopRequireDefault(require("./route/api.v1.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
app.set('port', 3999);
app.set('space', 4);
app.use(_bodyParser["default"].urlencoded({
  extended: true
}));
app.use(_bodyParser["default"].json());
app.use("/api/v1", _apiV["default"]);
app.use("/", _apiV["default"]);

if (process.env.NODE_ENV !== 'test') {
  app.listen(app.get('port'), function () {
    return console.log("Listening on port - ".concat(app.get('port')));
  });
}

var _default = app;
exports["default"] = _default;
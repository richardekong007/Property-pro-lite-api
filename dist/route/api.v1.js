"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _storeManager = _interopRequireDefault(require("../store/storeManager.js"));

var _user = _interopRequireDefault(require("../entity/user.js"));

var _users = _interopRequireDefault(require("../store/users.js"));

var _properties = _interopRequireDefault(require("../store/properties.js"));

var _property = _interopRequireDefault(require("../entity/property.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var appV1 = (0, _express["default"])();

var userStore = _storeManager["default"].mount(_users["default"]);

var propertyStore = _storeManager["default"].mount(_properties["default"]);

var createProperty = function createProperty(requestBody) {
  var property = new _property["default"].Builder().build(); //requestBody.id = "";

  Object.keys(property).forEach(function (key) {
    if (Object.keys(requestBody).includes(key)) {
      property[key] = requestBody[key];
    }
  });
  return property;
};

var createUser = function createUser(requestBody) {
  var user = new _user["default"].Builder().build(); //requestBody.id = "";

  Object.keys(user).forEach(function (key) {
    if (Object.keys(requestBody).includes(key)) {
      user[key] = requestBody[key];
    }
  });
  return user;
};

appV1.post("/auth/signup", function (req, res) {
  //const user = createUser(req.body);
  userStore.insert(req.body).then(function (result) {
    res.status(201).json({
      status: "success",
      data: {
        token: "",
        id: result.id,
        first_name: result.first_name,
        last_name: result.last_name,
        email: result.email
      }
    });
  })["catch"](function (err) {
    return res.status(412).json({
      status: "error",
      error: err.message
    });
  });
});
appV1.post("/auth/signin", function (req, res) {});
appV1.post("/property", function (req, res) {
  //const property = createProperty(req.body);
  propertyStore.insert(req.body).then(function (result) {
    delete result.owner;
    res.status(201).json({
      status: "success",
      data: result
    });
  })["catch"](function (err) {
    return res.status(412).json({
      status: "error",
      error: err.message
    });
  });
});
appV1.patch("/propert/:id", function (req, res) {
  res.json(req.body);
  propertyStore.update(req.params.id, req.body).then(function (result) {
    res.status(201).json({
      status: "success",
      data: result
    });
  })["catch"](function (err) {
    return res.status(412).json({
      status: "error",
      error: err.message
    });
  });
});
appV1.patch("/property/:id/:".concat("sold"), function (req, res) {
  propertyStore.update(req.params.id, {
    status: req.params.sold
  }).then(function (result) {
    delete result.owner;
    res.status(201).json({
      status: "success",
      data: result
    });
  })["catch"](function (err) {
    return res.status(412).json({
      status: "error",
      error: err.message
    });
  });
});
appV1["delete"]("/property/:id", function (req, res) {
  propertyStore["delete"](req.params.id).then(function (result) {
    res.status(200).json({
      status: "success",
      data: {
        message: result
      }
    });
  })["catch"](function (err) {
    return res.status(412).json({
      status: "error",
      error: err.message
    });
  });
});
appV1.get("/property", function (req, res) {
  propertyStore.findAll().then(function (results) {
    results.forEach(function (result) {
      return delete result.owner;
    });
    res.status(200).json({
      status: "success",
      data: results
    });
  })["catch"](function (err) {
    return res.status(412).json({
      status: "error",
      error: err.message
    });
  });
});
appV1.get("/property/type", function (req, res) {
  propertyStore.findAll('type', req.query.type).then(function (results) {
    results.forEach(function (result) {
      return delete result.owner;
    });
    res.status(200).json({
      status: "success",
      data: results
    });
  })["catch"](function (err) {
    return res.status(412).json({
      status: "error",
      error: err.message
    });
  });
});
appV1.get("/property/:id", function (req, res) {
  propertyStore.findById(req.params.id).then(function (result) {
    delete result.owner;
    res.status(200).json({
      status: "success",
      data: result
    });
  })["catch"](function (err) {
    return res.status(412).json({
      status: "error",
      error: err.message
    });
  });
});
var _default = appV1;
exports["default"] = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var User =
/*#__PURE__*/
function () {
  function User(build) {
    _classCallCheck(this, User);

    this.id = build.id;
    this.email = build.email;
    this.first_name = build.first_name;
    this.last_name = build.last_name;
    this.password = build.password;
    this.phoneNumber = build.phoneNumber;
    this.is_admin = build.is_admin;
  }

  _createClass(User, null, [{
    key: "Builder",
    get: function get() {
      var Builder =
      /*#__PURE__*/
      function () {
        function Builder() {
          _classCallCheck(this, Builder);
        }

        _createClass(Builder, [{
          key: "setId",
          value: function setId(id) {
            this.id = id;
            return this;
          }
        }, {
          key: "setEmail",
          value: function setEmail(email) {
            this.email = email;
            return this;
          }
        }, {
          key: "setFirstName",
          value: function setFirstName(name) {
            this.first_name = name;
            return this;
          }
        }, {
          key: "setLastName",
          value: function setLastName(name) {
            this.last_name = name;
            return this;
          }
        }, {
          key: "setPassword",
          value: function setPassword(password) {
            this.password = password;
            return this;
          }
        }, {
          key: "setPhoneNumber",
          value: function setPhoneNumber(phone) {
            this.phoneNumber = phone;
            return this;
          }
        }, {
          key: "setAddress",
          value: function setAddress(address) {
            this.address = address;
            return this;
          }
        }, {
          key: "setIsAdmin",
          value: function setIsAdmin(predicate) {
            this.is_admin = predicate;
            return this;
          }
        }, {
          key: "build",
          value: function build() {
            return new User(this);
          }
        }]);

        return Builder;
      }();

      return Builder;
    }
  }]);

  return User;
}();

var _default = User;
exports["default"] = _default;
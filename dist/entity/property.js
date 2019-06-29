"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Property =
/*#__PURE__*/
function () {
  function Property(builder) {
    _classCallCheck(this, Property);

    this.id = builder.id;
    this.owner = builder.owner;
    this.status = builder.status;
    this.price = builder.price;
    this.state = builder.state;
    this.city = builder.city;
    this.address = builder.address;
    this.type = builder.type;
    this.created_on = builder.created_on;
    this.image_url = builder.image_url;
  }

  _createClass(Property, null, [{
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
          key: "setOwner",
          value: function setOwner(owner) {
            this.owner = owner;
            return this;
          }
        }, {
          key: "setStatus",
          value: function setStatus(status) {
            this.status = status;
            return this;
          }
        }, {
          key: "setPrice",
          value: function setPrice(price) {
            this.price = price;
            return this;
          }
        }, {
          key: "setState",
          value: function setState(state) {
            this.state = state;
            return this;
          }
        }, {
          key: "setCity",
          value: function setCity(city) {
            this.city = city;
            return this;
          }
        }, {
          key: "setAddress",
          value: function setAddress(address) {
            this.address = address;
            return this;
          }
        }, {
          key: "setType",
          value: function setType(type) {
            this.type = type;
            return this;
          }
        }, {
          key: "setCreatedOn",
          value: function setCreatedOn() {
            this.created_on = new Date();
            return this;
          }
        }, {
          key: "setImageUrl",
          value: function setImageUrl(url) {
            this.image_url = url;
            return this;
          }
        }, {
          key: "build",
          value: function build() {
            return new Property(this);
          }
        }]);

        return Builder;
      }();

      return Builder;
    }
  }]);

  return Property;
}();

var _default = Property;
exports["default"] = _default;
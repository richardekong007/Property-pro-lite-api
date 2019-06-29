"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Flag =
/*#__PURE__*/
function () {
  function Flag(builder) {
    _classCallCheck(this, Flag);

    this.id = builder.id;
    this.property_id = builder.property_id;
    this.created_on = builder.created_on;
    this.reason = builder.reason;
    this.description = builder.description;
  }

  _createClass(Flag, null, [{
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
          key: "setPropertyId",
          value: function setPropertyId(id) {
            this.property_id = id;
            return this;
          }
        }, {
          key: "setCreatedOn",
          value: function setCreatedOn() {
            this.created_on = new Date();
            return this;
          }
        }, {
          key: "setReason",
          value: function setReason(reason) {
            this.reason = reason;
            return this;
          }
        }, {
          key: "setDescription",
          value: function setDescription(desc) {
            this.description = desc;
            return this;
          }
        }, {
          key: "build",
          value: function build() {
            return new Flag(this);
          }
        }]);

        return Builder;
      }();

      return Builder;
    }
  }]);

  return Flag;
}();

var _default = Flag;
exports["default"] = _default;
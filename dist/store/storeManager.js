"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var StoreManager =
/*#__PURE__*/
function () {
  function StoreManager(store) {
    _classCallCheck(this, StoreManager);

    this.store = store; //this._configureIdIncrement();
  }

  _createClass(StoreManager, [{
    key: "insert",
    value: function insert(entity) {
      var _this = this;

      // if (this._isIdDuplicated(entity)) {
      //     return Promise.reject(new Error('Duplicate id'));
      // }
      // if (this._isEmailDuplicated(entity)) {
      //     return Promise.reject(new Error('Email already exists'));
      // }
      return new Promise(function (res, rej) {
        var newId = _this.store.push(entity);

        if (newId) {
          res(_this.store[_this.store.length - 1]);
        } else {
          rej(new Error('Failed to create record'));
        }
      });
    }
  }, {
    key: "findById",
    value: function findById(id) {
      var _this2 = this;

      return new Promise(function (res, rej) {
        var record = _this2.store.find(function (_ref) {
          var theId = _ref.id;
          return theId === id;
        });

        if (record) {
          res(record);
        } else {
          rej(new Error('No record'));
        }
      });
    }
  }, {
    key: "findAll",
    value: function findAll() {
      var _this3 = this;

      return new Promise(function (res, rej) {
        var records = _this3.store;

        if (records) {
          res(records);
        } else {
          rej(new Error('No records'));
        }
      });
    } // eslint-disable-next-line no-dupe-class-members

  }, {
    key: "findAll",
    value: function findAll(key, val) {
      var records = this.store.filter(function (record) {
        return record[key] === val;
      });
      var found = records.length > 0;
      return new Promise(function (res, rej) {
        if (found) {
          res(records);
        } else {
          rej(new Error('No records'));
        }
      });
    }
  }, {
    key: "update",
    value: function update(id, data) {
      var updated = false;
      var recordToUpdate = this.store.find(function (record) {
        return record.id === id;
      });

      if (recordToUpdate) {
        Object.keys(data).forEach(function (key) {
          var recordKeys = Object.keys(recordToUpdate);

          if (recordKeys.includes(key) && data[key]) {
            recordToUpdate[key] = data[key];
            updated = true;
          }
        });
      }

      return new Promise(function (res, rej) {
        if (updated) {
          res(recordToUpdate);
        } else {
          rej(new Error('Operation unsuccessful'));
        }
      });
    }
  }, {
    key: "delete",
    value: function _delete(id) {
      var deleted;
      var size = this.store.length;
      this.store.filter(function (record, index, store) {
        if (record.id === id) {
          store.splice(index, 1);
        }

        deleted = size > store.length;
      });
      return new Promise(function (res, rej) {
        if (deleted) {
          res('operation successful');
        } else {
          rej(new Error('Operation unsuccessful'));
        }
      });
    }
  }, {
    key: "erase",
    value: function erase() {
      this.store.splice(0, this.store.length);
      var erased = this.store.length === 0;
      return new Promise(function (res, rej) {
        if (erased) {
          res('Operation successful');
        } else {
          rej('Operation unsuccessful');
        }
      });
    }
  }, {
    key: "unmount",
    value: function unmount() {
      this.store = [];
      var unmounted = this.store.length === 0;
      return new Promise(function (res) {
        if (unmounted) res('Operation successful');
      });
    }
  }, {
    key: "_isIdDuplicated",
    value: function _isIdDuplicated(entity) {
      var duplicated;

      if (entity) {
        var recordsWithDupId = this.store.filter(function (record) {
          return record.id === entity.id;
        });
        duplicated = recordsWithDupId.length > 0;
      }

      return duplicated;
    }
  }, {
    key: "_isEmailDuplicated",
    value: function _isEmailDuplicated(entity) {
      var duplicated;

      if (entity) {
        var keys = Object.keys(entity);

        if (keys.includes('email')) {
          var recordWithDupEmail = this.store.filter(function (record) {
            return record.email === entity.email;
          });
          duplicated = recordWithDupEmail.length > 0;
        }

        return duplicated;
      }
    }
  }, {
    key: "_configureIdIncrement",
    value: function _configureIdIncrement() {
      if (this.store.length > 0) {
        this.store.forEach(function (record, index) {
          return record.id = index + 1;
        });
      }
    }
  }], [{
    key: "mount",
    value: function mount(store) {
      return new StoreManager(store);
    }
  }]);

  return StoreManager;
}();

var _default = StoreManager;
exports["default"] = _default;
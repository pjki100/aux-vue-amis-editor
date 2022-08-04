/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var service = require('./service.js');
var mobxStateTree = require('mobx-state-tree');
require('../utils/helper.js');
var object = require('../utils/object.js');

var ModalStore = service.ServiceStore.named('ModalStore')
    .props({
    form: mobxStateTree.types.frozen(),
    entered: false,
    resizeCoord: 0,
    schema: mobxStateTree.types.frozen()
})
    .views(function (self) {
    return {
        get formData() {
            return object.createObject(self.data, self.form);
        }
    };
})
    .actions(function (self) {
    return {
        setEntered: function (value) {
            self.entered = value;
        },
        setFormData: function (obj) {
            self.form = obj;
        },
        reset: function () {
            self.form = {};
            self.reInitData({}, true);
        },
        setResizeCoord: function (value) {
            self.resizeCoord = value;
        },
        setSchema: function (schema) {
            if (schema && schema.then) {
                schema.then(function (value) { return mobxStateTree.isAlive(self) && self.setSchema(value); });
                return;
            }
            self.schema = schema;
        }
    };
});

exports.ModalStore = ModalStore;

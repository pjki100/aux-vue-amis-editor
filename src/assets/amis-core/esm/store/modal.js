/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { ServiceStore } from './service.js';
import { types, isAlive } from 'mobx-state-tree';
import '../utils/helper.js';
import { createObject } from '../utils/object.js';

var ModalStore = ServiceStore.named('ModalStore')
    .props({
    form: types.frozen(),
    entered: false,
    resizeCoord: 0,
    schema: types.frozen()
})
    .views(function (self) {
    return {
        get formData() {
            return createObject(self.data, self.form);
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
                schema.then(function (value) { return isAlive(self) && self.setSchema(value); });
                return;
            }
            self.schema = schema;
        }
    };
});

export { ModalStore };

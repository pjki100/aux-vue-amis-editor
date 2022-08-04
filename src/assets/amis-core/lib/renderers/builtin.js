/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

'use strict';

var Placeholder = require('./Placeholder.js');
require('./Form.js');
var factory = require('../factory.js');

factory.registerRenderer({
    type: 'spinner',
    component: Placeholder.Placeholder
});
factory.registerRenderer({
    type: 'alert',
    component: Placeholder.Placeholder
});
factory.registerRenderer({
    type: 'dialog',
    component: Placeholder.Placeholder
});
factory.registerRenderer({
    type: 'drawer',
    component: Placeholder.Placeholder
});

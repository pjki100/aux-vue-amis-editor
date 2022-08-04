/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { Placeholder } from './Placeholder.js';
import './Form.js';
import { registerRenderer } from '../factory.js';

registerRenderer({
    type: 'spinner',
    component: Placeholder
});
registerRenderer({
    type: 'alert',
    component: Placeholder
});
registerRenderer({
    type: 'dialog',
    component: Placeholder
});
registerRenderer({
    type: 'drawer',
    component: Placeholder
});

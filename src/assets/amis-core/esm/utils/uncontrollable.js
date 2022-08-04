/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { uncontrollable as uncontrollable$1 } from 'uncontrollable';
import hoistNonReactStatic from 'hoist-non-react-statics';

function uncontrollable(arg, config, mapping) {
    var result = uncontrollable$1(arg, config, mapping);
    return hoistNonReactStatic(result, arg);
}

export { uncontrollable };

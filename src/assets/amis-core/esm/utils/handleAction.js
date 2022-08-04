/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { str2function, normalizeApi } from './api.js';

/**
 * 后续好多地方可能都要支持 action，所以提取公共功能
 */
function handleAction(e, action, props, data) {
    // https://reactjs.org/docs/legacy-event-pooling.html
    e.persist(); // 等 react 17之后去掉 event pooling 了，这个应该就没用了
    var onAction = props.onAction;
    var onClick = action.onClick;
    if (typeof onClick === 'string') {
        onClick = str2function(onClick, 'event', 'props', 'data');
    }
    var result = onClick && onClick(e, props, data || props.data);
    if (e.isDefaultPrevented() || result === false || !onAction) {
        return;
    }
    e.preventDefault();
    // download 是一种 ajax 的简写
    if (action.actionType === 'download') {
        action.actionType = 'ajax';
        var api = normalizeApi(action.api);
        api.responseType = 'blob';
        action.api = api;
    }
    onAction(e, action, data || props.data);
}

export { handleAction as default, handleAction };

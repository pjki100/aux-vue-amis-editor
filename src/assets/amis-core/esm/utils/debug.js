/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import { __decorate, __metadata, __extends } from 'tslib';
import React, { useRef, useState, useEffect, Component } from 'react';
import cx from 'classnames';
import { findDOMNode, render } from 'react-dom';
import JsonView from 'react-json-view';
import { observable, autorun } from 'mobx';
import { observer } from 'mobx-react';
import { uuidv4 } from './helper.js';
import { position } from './position.js';

/**
 * amis 运行时调试功能，为了避免循环引用，这个组件不要依赖 amis 里的组件
 */
/** @class */ ((function () {
    function Log() {
        this.cat = '';
        this.level = '';
        this.msg = '';
        this.ext = '';
    }
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], Log.prototype, "cat", void 0);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], Log.prototype, "level", void 0);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], Log.prototype, "msg", void 0);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], Log.prototype, "ext", void 0);
    return Log;
})());
var AMISDebugStore = /** @class */ (function () {
    function AMISDebugStore() {
        /**
         * 当前 tab
         */
        this.tab = 'log';
        /**
         * 显示位置，默认在右边
         */
        this.position = 'right';
        /**
         * 组件日志
         */
        this.logs = [];
        /**
         * Debug 面板是否展开
         */
        this.isExpanded = false;
        /**
         * 是否是 inspect 模式，在这个模式下可以查看数据域
         */
        this.inspectMode = false;
    }
    __decorate([
        observable,
        __metadata("design:type", String)
    ], AMISDebugStore.prototype, "tab", void 0);
    __decorate([
        observable,
        __metadata("design:type", String)
    ], AMISDebugStore.prototype, "position", void 0);
    __decorate([
        observable,
        __metadata("design:type", Array)
    ], AMISDebugStore.prototype, "logs", void 0);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], AMISDebugStore.prototype, "isExpanded", void 0);
    __decorate([
        observable,
        __metadata("design:type", Object)
    ], AMISDebugStore.prototype, "inspectMode", void 0);
    __decorate([
        observable,
        __metadata("design:type", String)
    ], AMISDebugStore.prototype, "hoverId", void 0);
    __decorate([
        observable,
        __metadata("design:type", String)
    ], AMISDebugStore.prototype, "activeId", void 0);
    __decorate([
        observable,
        __metadata("design:type", Number)
    ], AMISDebugStore.prototype, "ellipsisThreshold", void 0);
    return AMISDebugStore;
}());
var store = new AMISDebugStore();
// 存储组件信息用于 debug
var ComponentInfo = {};
var LogView = observer(function (_a) {
    var _b;
    var store = _a.store;
    var logs = store.logs;
    var ellipsisThreshold = (_b = store.ellipsisThreshold) !== null && _b !== void 0 ? _b : 50;
    return (React.createElement(React.Fragment, null, logs.map(function (log, index) {
        return (React.createElement("div", { className: "AMISDebug-logLine", key: "log-".concat(index) },
            React.createElement("div", { className: "AMISDebug-logLineMsg" },
                "[",
                log.cat,
                "] ",
                log.msg),
            log.ext ? (React.createElement(JsonView, { name: null, theme: "monokai", src: JSON.parse(log.ext), collapsed: true, enableClipboard: false, displayDataTypes: false, collapseStringsAfterLength: ellipsisThreshold, iconStyle: "square" })) : null));
    })));
});
var AMISDebug = observer(function (_a) {
    var _b, _c;
    var store = _a.store;
    var activeId = store.activeId;
    var activeComponentInspect = ComponentInfo[activeId];
    // 收集数据域里的数据
    var start = ((_c = (_b = activeComponentInspect === null || activeComponentInspect === void 0 ? void 0 : activeComponentInspect.component) === null || _b === void 0 ? void 0 : _b.props) === null || _c === void 0 ? void 0 : _c.data) || {};
    var stacks = [start];
    while (Object.getPrototypeOf(start) !== Object.prototype) {
        var superData = Object.getPrototypeOf(start);
        if (Object.prototype.toString.call(superData) !== '[object Object]') {
            break;
        }
        stacks.push(superData);
        start = superData;
    }
    var stackDataView = [];
    if (Object.keys(stacks[0]).length || stacks.length > 1) {
        var level = 0;
        for (var _i = 0, stacks_1 = stacks; _i < stacks_1.length; _i++) {
            var stack = stacks_1[_i];
            stackDataView.push(React.createElement("div", { key: "data-".concat(level) },
                React.createElement("h3", null,
                    "Data Level-",
                    level),
                React.createElement(JsonView, { key: "dataview-".concat(stack), name: null, theme: "monokai", src: stack, collapsed: level === 0 ? false : true, enableClipboard: false, displayDataTypes: false, iconStyle: "square" })));
            level += 1;
        }
    }
    var panelRef = useRef(null);
    var _d = useState(false), isResizing = _d[0], setResizing = _d[1];
    var _e = useState(0), startX = _e[0], setStartX = _e[1];
    var _f = useState(0), panelWidth = _f[0], setPanelWidth = _f[1];
    useEffect(function () {
        var handleMouseUp = function () {
            setResizing(false);
        };
        var handleMouseMove = function (e) {
            if (!isResizing) {
                return;
            }
            var xOffset = store.position === 'right' ? e.clientX - startX : startX - e.clientX;
            var panel = panelRef.current;
            var targetWidth = Math.max(200, panelWidth - xOffset);
            panel.style.width = targetWidth + 'px';
            if (e.stopPropagation)
                e.stopPropagation();
            if (e.preventDefault)
                e.preventDefault();
            e.cancelBubble = true;
            return false;
        };
        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return function () {
            if (isResizing) {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            }
        };
    }, [isResizing]);
    return (React.createElement("div", { className: cx('AMISDebug', {
            'is-expanded': store.isExpanded,
            'is-left': store.position === 'left'
        }), ref: panelRef },
        React.createElement("div", { className: "AMISDebug-toggle", title: "open debug", onClick: function () {
                store.isExpanded = true;
            } }, store.isExpanded ? (React.createElement("i", { className: "fas fa-times" })) : (React.createElement("i", { className: "fas fa-bug" }))),
        React.createElement("div", { className: cx('AMISDebug-content') },
            React.createElement("div", { className: "AMISDebug-close", title: "Close", onClick: function () {
                    store.isExpanded = false;
                } },
                React.createElement("i", { className: "fas fa-times" })),
            React.createElement("div", { className: "AMISDebug-resize", onMouseDown: function (event) {
                    setStartX(event.clientX);
                    setPanelWidth(parseInt(getComputedStyle(panelRef.current).getPropertyValue('width'), 10));
                    setResizing(true);
                } }),
            React.createElement("div", { className: "AMISDebug-tab" },
                React.createElement("button", { className: cx({ active: store.tab === 'log' }), onClick: function () {
                        store.tab = 'log';
                    } }, "Log"),
                React.createElement("button", { className: cx({ active: store.tab === 'inspect' }), onClick: function () {
                        store.tab = 'inspect';
                    } }, "Inspect")),
            React.createElement("div", { className: "AMISDebug-changePosition" }, store.position === 'right' ? (React.createElement("i", { className: "fas fa-chevron-left", title: "move to left", onClick: function () {
                    store.position = 'left';
                } })) : (React.createElement("i", { className: "fas fa-chevron-right", title: "move to right", onClick: function () {
                    store.position = 'right';
                } }))),
            store.tab === 'log' ? (React.createElement("div", { className: "AMISDebug-log" },
                React.createElement("button", { onClick: function () {
                        store.logs = [];
                    } }, "Clear Log"),
                React.createElement(LogView, { store: store }))) : null,
            store.tab === 'inspect' ? (React.createElement("div", { className: "AMISDebug-inspect" }, activeId ? (React.createElement(React.Fragment, null,
                React.createElement("h3", null,
                    "Component:",
                    ' ',
                    React.createElement("span", { className: "primary" }, activeComponentInspect.name)),
                stackDataView)) : ('Click component to display inspect'))) : null)));
});
/**
 * 鼠标移动到某个组件的效果
 */
function handleMouseMove(e) {
    if (!store.isExpanded) {
        return;
    }
    var dom = e.target;
    var target = dom.closest("[data-debug-id]");
    if (target) {
        store.hoverId = target.getAttribute('data-debug-id');
    }
}
/**
 *  点选某个组件
 */
function handleMouseclick(e) {
    if (!store.isExpanded) {
        return;
    }
    var dom = e.target;
    var target = dom.closest("[data-debug-id]");
    if (target) {
        store.activeId = target.getAttribute('data-debug-id');
        store.tab = 'inspect';
    }
}
// hover 及点击后的高亮
var amisHoverBox = document.createElement('div');
amisHoverBox.className = 'AMISDebug-hoverBox';
var amisActiveBox = document.createElement('div');
amisActiveBox.className = 'AMISDebug-activeBox';
autorun(function () {
    var hoverId = store.hoverId;
    var hoverElement = document.querySelector("[data-debug-id=\"".concat(hoverId, "\"]"));
    if (hoverElement) {
        var offset = position(hoverElement, document.body);
        amisHoverBox.style.top = "".concat(offset.top, "px");
        amisHoverBox.style.left = "".concat(offset.left, "px");
        amisHoverBox.style.width = "".concat(offset.width, "px");
        amisHoverBox.style.height = "".concat(offset.height, "px");
    }
});
autorun(function () {
    var activeId = store.activeId;
    var activeElement = document.querySelector("[data-debug-id=\"".concat(activeId, "\"]"));
    if (activeElement) {
        var offset = position(activeElement, document.body);
        amisActiveBox.style.top = "".concat(offset.top, "px");
        amisActiveBox.style.left = "".concat(offset.left, "px");
        amisActiveBox.style.width = "".concat(offset.width, "px");
        amisActiveBox.style.height = "".concat(offset.height, "px");
    }
});
// 页面中只能有一个实例
var isEnabled = false;
function enableDebug() {
    if (isEnabled) {
        return;
    }
    isEnabled = true;
    var amisDebugElement = document.createElement('div');
    document.body.appendChild(amisDebugElement);
    var element = React.createElement(AMISDebug, { store: store });
    render(element, amisDebugElement);
    document.body.appendChild(amisHoverBox);
    document.body.appendChild(amisActiveBox);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleMouseclick);
}
var DebugWrapper = /** @class */ (function (_super) {
    __extends(DebugWrapper, _super);
    function DebugWrapper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DebugWrapper.prototype.componentDidMount = function () {
        var root = findDOMNode(this);
        if (!root) {
            return;
        }
        var renderer = this.props.renderer;
        var debugId = uuidv4();
        root.setAttribute('data-debug-id', debugId);
        ComponentInfo[debugId] = {
            name: renderer.name,
            component: this.props.children
        };
    };
    DebugWrapper.prototype.render = function () {
        return this.props.children;
    };
    return DebugWrapper;
}(Component));
/**
 * 一般调试日志
 * @param msg 简单消息
 * @param ext 扩展信息
 */
function debug(cat, msg, ext) {
    if (!isEnabled) {
        return;
    }
    var log = {
        cat: cat,
        level: 'debug',
        msg: msg,
        ext: JSON.stringify(ext)
    };
    console.groupCollapsed('amis debug', msg);
    console.trace(log);
    console.groupEnd();
    store.logs.push(log);
}
/**
 * 警告日志
 * @param msg 简单消息
 * @param ext 扩展信息
 */
function warning(cat, msg, ext) {
    if (!isEnabled) {
        return;
    }
    var log = {
        cat: cat,
        level: 'warn',
        msg: msg,
        ext: JSON.stringify(ext)
    };
    console.groupCollapsed('amis debug', msg);
    console.trace(log);
    console.groupEnd();
    store.logs.push(log);
}

export { DebugWrapper, debug, enableDebug, warning };

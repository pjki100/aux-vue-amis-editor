/**
 * amis-core v2.1.0
 * Copyright 2018-2022 fex
 */

import moment from 'moment';
import { createObject } from './object.js';
import { tokenize } from './tokenize.js';

var timeUnitMap = {
    year: 'Y',
    month: 'M',
    week: 'w',
    weekday: 'W',
    day: 'd',
    hour: 'h',
    minute: 'm',
    min: 'm',
    second: 's',
    millisecond: 'ms'
};
var relativeValueRe = /^(.+)?(\+|-)(\d+)(minute|min|hour|day|week|month|year|weekday|second|millisecond)s?$/i;
var filterDate = function (value, data, format, utc) {
    if (data === void 0) { data = {}; }
    if (format === void 0) { format = 'X'; }
    if (utc === void 0) { utc = false; }
    var m, mm = utc ? moment.utc : moment;
    if (typeof value === 'string') {
        value = value.trim();
    }
    // todo
    var date = new Date();
    value = tokenize(value, createObject(data, {
        now: mm().toDate(),
        today: mm([date.getFullYear(), date.getMonth(), date.getDate()])
    }), '| raw');
    if (value && typeof value === 'string' && (m = relativeValueRe.exec(value))) {
        var date_1 = new Date();
        var step = parseInt(m[3], 10);
        var from = m[1]
            ? filterDate(m[1], data, format, utc)
            : mm(/(minute|min|hour|second)s?/.test(m[4])
                ? [
                    date_1.getFullYear(),
                    date_1.getMonth(),
                    date_1.getDate(),
                    date_1.getHours(),
                    date_1.getMinutes(),
                    date_1.getSeconds()
                ]
                : [date_1.getFullYear(), date_1.getMonth(), date_1.getDate()]);
        return m[2] === '-'
            ? from.subtract(step, timeUnitMap[m[4]])
            : from.add(step, timeUnitMap[m[4]]);
        //   return from[m[2] === '-' ? 'subtract' : 'add'](step, mapping[m[4]] || m[4]);
    }
    else if (value === 'now') {
        return mm();
    }
    else if (value === 'today') {
        var date_2 = new Date();
        return mm([date_2.getFullYear(), date_2.getMonth(), date_2.getDate()]);
    }
    else {
        var result = mm(value);
        return result.isValid() ? result : mm(value, format);
    }
};
function parseDuration(str) {
    var matches = /^((?:\-|\+)?(?:\d*\.)?\d+)(minute|min|hour|day|week|month|quarter|year|weekday|second|millisecond)s?$/.exec(str);
    if (matches) {
        var duration = moment.duration(parseFloat(matches[1]), matches[2]);
        if (moment.isDuration(duration)) {
            return duration;
        }
    }
    return;
}

export { filterDate, parseDuration, relativeValueRe };

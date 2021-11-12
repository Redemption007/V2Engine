/* eslint-disable no-param-reassign */
/* eslint-disable require-unicode-regexp */
/* eslint-disable prefer-named-capture-group */
/* eslint-disable require-jsdoc */
/* eslint-disable func-style */


/**
 * Aides.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var j = h * 24;
var w = j * 7;
var y = j * 365.25;


/**
  * Parse la chaîne de caractères et retourne la valeur en millisecondes
  *
  * @param {String} str
  * @return {Number}
  * @api private
  */

function parse (str) {
    str = String(str);
    if (str.length > 100) {
        return false;
    }
    var match = (/^(-?(?:\d+)?\.?\d*) *((m((illi)?sec(onde?)?)?s?)|(s(ec(onde?)?s?)?)|(m(in(ute)?s?)?)|(h((eure)|((ou)?r))?s?)|d(ay)?s?|j(our(née)?s?)?|semaines?|w(eeks?)?|a((n(née)?)s?)?|y((ea)?rs?)?)?$/i).exec(str);

    if (!match) {
        return false;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || 'ms').toLowerCase();

    switch (type) {
    case 'années':
    case 'annees':
    case 'année':
    case 'annee':
    case 'ans':
    case 'an':
    case 'a':
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
        return n * y;
    case 'semaines':
    case 'semaine':
    case 'weeks':
    case 'week':
    case 'w':
        return n * w;
    case 'days':
    case 'day':
    case 'd':
    case 'jours':
    case 'jour':
    case 'j':
        return n * j;
    case 'heures':
    case 'heure':
    case 'hrs':
    case 'hr':
    case 'h':
        return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
        return n * m;
    case 'secondes':
    case 'seconde':
    case 'secs':
    case 'sec':
    case 's':
        return n * s;
    case 'millisecondes':
    case 'milliseconde':
    case 'msecs':
    case 'msec':
    case 'ms':
        return n;
    default:
        return undefined;
    }
}

/**
  * Format court de `ms`.
  *
  * @param {Number} ms
  * @return {String}
  * @api private
  */

function fmtShort (ms) {
    var msAbs = Math.abs(ms);
    var to_return = ''

    if (msAbs >= j) {
        to_return += Math.floor(msAbs / j) + 'j';
        msAbs %= j
    }
    if (msAbs >= h) {
        to_return += Math.floor(msAbs / h) + 'h';
        msAbs %= h
    }
    if (msAbs >= m) {
        to_return += Math.floor(msAbs / m) + 'm';
        msAbs %= m
    }
    if (msAbs >= s) {
        to_return += Math.floor(msAbs / s) + 's';
        msAbs %= s
    }
    //to_return += msAbs + 'ms';

    return to_return
}

/**
  * Pluralisateur.
  */

function plural (ms, n, name) {
    var isPlural = ms >= n * 1.5;

    return `${Math.round(ms / n)} ${name}${isPlural ? 's ' : ''}`;
}

/**
  * Format long de `ms`.
  *
  * @param {Number} ms
  * @return {String}
  * @api private
  */

function fmtLong (ms) {
    var msAbs = Math.abs(ms);
    var to_return = ''

    if (msAbs >= j) {
        to_return += plural(msAbs, j, 'jour');
        msAbs %= j
    }
    if (msAbs >= h) {
        to_return += plural(msAbs, h, 'heure');
        msAbs %= h
    }
    if (msAbs >= m) {
        to_return += plural(msAbs, m, 'minute');
        msAbs %= m
    }
    if (msAbs >= s) {
        to_return += plural(msAbs, s, 'seconde');
        msAbs %= s
    }
    //to_return += ms + ' ms';

    return to_return
}

/**
  * Parse ou formate la valeur `val`.
  *
  * Options:
  *
  *  - `options` indique le formatage en français [false]
  *
  * @param {String|Number} val
  * @param {Object} [options]
  * @throws {Error} Rejette une erreur si val n'est pas une chaîne non vide ou un nombre
  * @return {String|Number}
  * @api public
  */

module.exports = function (val, options) {
    options = options || false;
    var type = typeof val;

    if (type === 'string' && val.length > 0) {
        return parse(val);
    } else if (type === 'number' && isFinite(val)) {
        return options ? fmtLong(val) : fmtShort(val);
    }
    return false
};

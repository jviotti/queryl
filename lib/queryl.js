/*
 * The MIT License
 *
 * Copyright (c) 2016 Juan Cruz Viotti. https://github.com/jviotti
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * @module queryl
 */

var operations = require('./operations');
var q = require('libq');

/**
 * @summary Evaluate an operation
 * @private
 * @function
 *
 * @param {String} operation - operation
 * @param {Object} content - body of the operation
 * @param {Object} object - object to match to
 *
 * @returns {Boolean} matches
 *
 * @example
 * evaluate('$not', {
 *   $equal: {
 *     foo: 'bar'
 *   }
 * }, {
 *   foo: 'baz'
 * });
 * > true
 */
var evaluate = function(operation, content, object) {
  'use strict';

  var fn = operations[operation];
  if (!fn) {
    throw new Error('Unknown Queryl operation: ' + operation);
  }

  var values = q.utils.object.arrayMap(content, function(key, value) {

    // Pass this same function as an argument to
    // allow operations to be defined recursively.
    return fn(key, value, object, evaluate);
  });

  // TODO: It would be nice to decouple the evaluate function from
  // any operation, moving this logic to the $or operation instead.
  if (operation === '$or') {
    return q.utils.array.someBoolean(values);
  }

  return q.utils.array.everyBoolean(values);
};

/**
 * @summary Query an object
 * @function
 * @public
 *
 * @param {Object} query - query
 * @param {Object} object - object
 * @returns {Boolean} whether it matches or not
 *
 * @example
 * queryl.match({
 *   $or: {
 *     $equal: {
 *       foo: 'bar'
 *     },
 *     $and: {
 *       $not: {
 *         $match: {
 *           foo: /^baz/
 *         }
 *       },
 *       $gt: {
 *         bar: 3
 *       }
 *     }
 *   }
 * }, {
 *   foo: 'hello world',
 *   bar: 5
 * });
 * > true
 *
 * @example
 * queryl.match({
 *   $contain: {
 *     'foo.bar': 2
 *   }
 * }, {
 *   foo: {
 *     bar: [ 1, 2, 3 ]
 *   }
 * });
 * > true
 *
 * @example
 * queryl.match({
 *   $contain: {
 *     'foo.bar': {
 *       baz: 6
 *     }
 *   }
 * }, {
 *   foo: {
 *     bar: [ 1, 2, { baz: 6 } ]
 *   }
 * });
 * > true
 */
exports.match = function(query, object) {
  'use strict';

  // The root of a query is considered to be a conjunction
  return evaluate('$and', query, object);
};

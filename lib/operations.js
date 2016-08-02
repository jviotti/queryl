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

var _ = require('lodash');

/**
 * @summary Built-in operations
 * @namespace operations
 */
module.exports = {

  /**
   * @property {Function} $and - logical conjunction
   * @memberof operations
   *
   * @example
   * queryl.match({
   *   $and: {
   *     $equal: {
   *       foo: 'bar'
   *     },
   *     $match: {
   *       bar: /^hello/
   *     }
   *   }
   * }, {
   *   foo: 'bar',
   *   bar: 'hello world'
   * });
   * > true
   */
  $and: function(key, value, object, evaluate) {
    'use strict';

    return evaluate(key, value, object);
  },

  /**
   * @property {Function} $or - logical disjunction
   * @memberof operations
   *
   * @example
   * queryl.match({
   *   $or: {
   *     $equal: {
   *       foo: 'bar'
   *     },
   *     $match: {
   *       bar: /^hello/
   *     }
   *   }
   * }, {
   *   foo: 'bar',
   *   bar: 'hey there'
   * });
   * > true
   */
  $or: function(key, value, object, evaluate) {
    'use strict';

    return evaluate(key, value, object);
  },

  /**
   * @property {Function} $not - logical negation
   * @memberof operations
   *
   * @example
   * queryl.match({
   *   $not: {
   *     $equal: {
   *       foo: 'bar'
   *     }
   *   }
   * }, {
   *   foo: 'baz'
   * });
   * > true
   */
  $not: function(key, value, object, evaluate) {
    'use strict';

    return !evaluate(key, value, object);
  },

  /**
   * @property {Function} $equal - equality
   * @memberof operations
   *
   * @description
   * This operation supports deep equality.
   *
   * @example
   * queryl.match({
   *   $equal: {
   *     foo: 'bar'
   *   }
   * }, {
   *   foo: 'bar'
   * });
   * > true
   */
  $equal: function(key, value, object) {
    'use strict';

    return _.isEqual(object[key], value);
  },

  /**
   * @property {Function} $contain - collection include
   * @memberof operations
   *
   * @description
   * This operation supports deep equality.
   *
   * @example
   * queryl.match({
   *   $contain: {
   *     foo: 1
   *   }
   * }, {
   *   foo: [ 1, 2, 3 ]
   * });
   * > true
   */
  $contain: function(key, value, object) {
    'use strict';

    var propertyValue = _.get(object, key);

    if (!_.isString(propertyValue) && !_.isArray(propertyValue)) {
      throw new Error('$contain: object: not a string or array: ' + propertyValue);
    }

    return _.some(_.map(propertyValue, _.partial(_.isEqual, value)));
  },

  /**
   * @property {Function} $match - RegExp match
   * @memberof operations
   *
   * @example
   * queryl.match({
   *   $match: {
   *     foo: /^hello/
   *   }
   * }, {
   *   foo: 'hello world'
   * });
   * > true
   */
  $match: function(key, value, object) {
    'use strict';

    if (!_.isString(object[key])) {
      throw new Error('$match: object: not a string: ' + object[key]);
    }

    if (!_.isRegExp(value)) {
      throw new Error('$match: definition: not a regex: ' + value);
    }

    return value.test(object[key]);
  },

  /**
   * @property {Function} $gt - greater than
   * @memberof operations
   *
   * @example
   * queryl.match({
   *   $gt: {
   *     foo: 5
   *   }
   * }, {
   *   foo: 6
   * });
   * > true
   */
  $gt: function(key, value, object) {
    'use strict';

    if (!_.isNumber(object[key])) {
      throw new Error('$gt: object: not a number: ' + object[key]);
    }

    if (!_.isNumber(value)) {
      throw new Error('$gt: definition: not a number: ' + value);
    }

    return object[key] > value;
  },

  /**
   * @property {Function} $lt - less than
   * @memberof operations
   *
   * @example
   * queryl.match({
   *   $lt: {
   *     foo: 5
   *   }
   * }, {
   *   foo: 4
   * });
   * > true
   */
  $lt: function(key, value, object) {
    'use strict';

    if (!_.isNumber(object[key])) {
      throw new Error('$lt: object: not a number: ' + object[key]);
    }

    if (!_.isNumber(value)) {
      throw new Error('$lt: definition: not a number: ' + value);
    }

    return value > object[key];
  }

};

/*
 * The MIT License
 *
 * Copyright (c) 2015 IssueTrack. https://issuetrack.io
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

var m = require('mochainon');
var queryl = require('../lib/queryl');

describe('Queryl:', function() {
  'use strict';

  it('should return true given an empty query (wildcard)', function() {
    m.chai.expect(queryl.match({}, {
      foo: 'bar'
    })).to.be.true;
  });

  it('should return true given an empty query (wildcard) and an empty object', function() {
    m.chai.expect(queryl.match({}, {})).to.be.true;
  });

  it('should throw an error given an unknown operation', function() {
    m.chai.expect(function() {
      queryl.match({
        $foo: {
          foo: 'bar'
        }
      }, {
        foo: 'bar'
      });
    }).to.throw('Unknown Queryl operation: $foo');
  });

  it('should throw an error given no queryl operation', function() {
    m.chai.expect(function() {
      queryl.match({
        foo: 'bar'
      }, {
        foo: 'bar'
      });
    }).to.throw('Unknown Queryl operation: foo');
  });

  describe('$equal', function() {

    it('should return true for a string property that equals', function() {
      m.chai.expect(queryl.match({
        $equal: {
          foo: 'bar'
        }
      }, {
        foo: 'bar'
      })).to.be.true;
    });

    it('should return false for a string property that does not equal', function() {
      m.chai.expect(queryl.match({
        $equal: {
          foo: 'bar'
        }
      }, {
        foo: 'baz'
      })).to.be.false;
    });

    it('should return true for two string properties that equals', function() {
      m.chai.expect(queryl.match({
        $equal: {
          foo: 'bar',
          bar: 'baz'
        }
      }, {
        foo: 'bar',
        bar: 'baz'
      })).to.be.true;
    });

    it('should return false for two string properties that does not equal', function() {
      m.chai.expect(queryl.match({
        $equal: {
          foo: 'bar',
          bar: 'baz'
        }
      }, {
        foo: 'bar',
        bar: 'bar'
      })).to.be.false;
    });

    it('should return true for an object property that equals', function() {
      m.chai.expect(queryl.match({
        $equal: {
          foo: {
            bar: 'baz'
          }
        }
      }, {
        foo: {
          bar: 'baz'
        }
      })).to.be.true;
    });

    it('should return false for an object property that does not equal', function() {
      m.chai.expect(queryl.match({
        $equal: {
          foo: {
            bar: 'baz'
          }
        }
      }, {
        foo: {
          bar: 'qux'
        }
      })).to.be.false;
    });

    it('should return true for an array property that equals', function() {
      m.chai.expect(queryl.match({
        $equal: {
          foo: [ 1, 2, 3 ]
        }
      }, {
        foo: [ 1, 2, 3 ]
      })).to.be.true;
    });

    it('should return false for an array property that does not equal', function() {
      m.chai.expect(queryl.match({
        $equal: {
          foo: [ 1, 2, 3 ]
        }
      }, {
        foo: [ 1, 2 ]
      })).to.be.false;
    });

    it('should return true for undefined and a property that does not exist', function() {
      m.chai.expect(queryl.match({
        $equal: {
          foo: undefined
        }
      }, {})).to.be.true;
    });

    it('should return true for a property named $equal that matches', function() {
      m.chai.expect(queryl.match({
        $equal: {
          $equal: 'foo'
        }
      }, {
        $equal: 'foo'
      })).to.be.true;
    });

    it('should return false for a property named $equal that does not match', function() {
      m.chai.expect(queryl.match({
        $equal: {
          $equal: 'foo'
        }
      }, {
        $equal: 'bar'
      })).to.be.false;
    });

  });

  describe('$contain', function() {

    it('should throw an error if content is not an array or string', function() {
      m.chai.expect(function() {
        queryl.match({
          $contain: {
            foo: 1
          }
        }, {
          foo: 5
        });
      }).to.throw('$contain: object: not a string or array: 5');
    });

    it('should return true for an array that contains the item', function() {
      m.chai.expect(queryl.match({
        $contain: {
          foo: 1
        }
      }, {
        foo: [ 1, 2 ]
      })).to.be.true;
    });

    it('should return false for an array that does not contain the item', function() {
      m.chai.expect(queryl.match({
        $contain: {
          foo: 5
        }
      }, {
        foo: [ 1, 2 ]
      })).to.be.false;
    });

    it('should return true for an array that contains an object item', function() {
      m.chai.expect(queryl.match({
        $contain: {
          foo: {
            id: 1
          }
        }
      }, {
        foo: [
          {
            id: 1
          },
          {
            id: 2
          }
        ]
      })).to.be.true;
    });

    it('should return false for an array that does not contain an object item', function() {
      m.chai.expect(queryl.match({
        $contain: {
          foo: {
            id: 3
          }
        }
      }, {
        foo: [
          {
            id: 1
          },
          {
            id: 2
          }
        ]
      })).to.be.false;
    });

    it('should return true for a string that contains a character', function() {
      m.chai.expect(queryl.match({
        $contain: {
          foo: 'b'
        }
      }, {
        foo: 'bar'
      })).to.be.true;
    });

    it('should return false for a string that does not contain a character', function() {
      m.chai.expect(queryl.match({
        $contain: {
          foo: 'z'
        }
      }, {
        foo: 'bar'
      })).to.be.false;
    });

    it('should return true for a property named $contain that contains the item', function() {
      m.chai.expect(queryl.match({
        $contain: {
          $contain: 1
        }
      }, {
        $contain: [ 1, 2, 3 ]
      })).to.be.true;
    });

    it('should return false for a property named $contain that does not contain the item', function() {
      m.chai.expect(queryl.match({
        $contain: {
          $contain: 7
        }
      }, {
        $contain: [ 1, 2, 3 ]
      })).to.be.false;
    });

  });

  describe('$match', function() {

    it('should throw an error if operand body is not a regex', function() {
      m.chai.expect(function() {
        queryl.match({
          $match: {
            foo: 'hello world'
          }
        }, {
          foo: 'hello'
        });
      }).to.throw('$match: definition: not a regex: hello world');
    });

    it('should throw an error if content is not a regex', function() {
      m.chai.expect(function() {
        queryl.match({
          $match: {
            foo: /hello/
          }
        }, {
          foo: 5
        });
      }).to.throw('$match: object: not a string: 5');
    });

    it('should return true for a regex that matches', function() {
      m.chai.expect(queryl.match({
        $match: {
          foo: /^bar/
        }
      }, {
        foo: 'bar baz'
      })).to.be.true;
    });

    it('should return false for a regex that does not match', function() {
      m.chai.expect(queryl.match({
        $match: {
          foo: /^bar/
        }
      }, {
        foo: 'baz bar'
      })).to.be.false;
    });

    it('should return true for a property named $match that matches', function() {
      m.chai.expect(queryl.match({
        $match: {
          $match: /^bar/
        }
      }, {
        $match: 'bar baz'
      })).to.be.true;
    });

    it('should return false for a property named $match that does not match', function() {
      m.chai.expect(queryl.match({
        $match: {
          $match: /^bar/
        }
      }, {
        $match: 'foo bar baz'
      })).to.be.false;
    });

  });

  describe('$gt', function() {

    it('should throw an error if content is not a number', function() {
      m.chai.expect(function() {
        queryl.match({
          $gt: {
            foo: 5
          }
        }, {
          foo: 'hello'
        });
      }).to.throw('$gt: object: not a number: hello');
    });

    it('should throw an error if operand body is not a number', function() {
      m.chai.expect(function() {
        queryl.match({
          $gt: {
            foo: 'hello'
          }
        }, {
          foo: 5
        });
      }).to.throw('$gt: definition: not a number: hello');
    });

    it('should return true if a number is greater than', function() {
      m.chai.expect(queryl.match({
        $gt: {
          foo: 5
        }
      }, {
        foo: 6
      })).to.be.true;
    });

    it('should return false if a number is less than', function() {
      m.chai.expect(queryl.match({
        $gt: {
          foo: 5
        }
      }, {
        foo: 4
      })).to.be.false;
    });

    it('should return false if a number is equal to', function() {
      m.chai.expect(queryl.match({
        $gt: {
          foo: 5
        }
      }, {
        foo: 5
      })).to.be.false;
    });

    it('should return true if a float number is greater than another float number', function() {
      m.chai.expect(queryl.match({
        $gt: {
          foo: 5.1
        }
      }, {
        foo: 5.15
      })).to.be.true;
    });

    it('should return false if a float number is not greater than another float number', function() {
      m.chai.expect(queryl.match({
        $gt: {
          foo: 5.1
        }
      }, {
        foo: 5.099999999
      })).to.be.false;
    });

    it('should return true if a property named $gt is greater than', function() {
      m.chai.expect(queryl.match({
        $gt: {
          $gt: 5
        }
      }, {
        $gt: 6
      })).to.be.true;
    });

    it('should return false if a property named $gt is less than', function() {
      m.chai.expect(queryl.match({
        $gt: {
          $gt: 5
        }
      }, {
        $gt: 4
      })).to.be.false;
    });

    it('should return false if a property named $gt is equal to', function() {
      m.chai.expect(queryl.match({
        $gt: {
          $gt: 5
        }
      }, {
        $gt: 5
      })).to.be.false;
    });

  });

  describe('$lt', function() {

    it('should throw an error if content is not a number', function() {
      m.chai.expect(function() {
        queryl.match({
          $lt: {
            foo: 5
          }
        }, {
          foo: 'hello'
        });
      }).to.throw('$lt: object: not a number: hello');
    });

    it('should throw an error if operand body is not a number', function() {
      m.chai.expect(function() {
        queryl.match({
          $lt: {
            foo: 'hello'
          }
        }, {
          foo: 5
        });
      }).to.throw('$lt: definition: not a number: hello');
    });

    it('should return true if a number is less than', function() {
      m.chai.expect(queryl.match({
        $lt: {
          foo: 5
        }
      }, {
        foo: 4
      })).to.be.true;
    });

    it('should return false if a number is greater than', function() {
      m.chai.expect(queryl.match({
        $lt: {
          foo: 5
        }
      }, {
        foo: 6
      })).to.be.false;
    });

    it('should return false if a number is equal to', function() {
      m.chai.expect(queryl.match({
        $lt: {
          foo: 5
        }
      }, {
        foo: 5
      })).to.be.false;
    });

    it('should return true if a float number is less than another float number', function() {
      m.chai.expect(queryl.match({
        $lt: {
          foo: 5.15
        }
      }, {
        foo: 5.1
      })).to.be.true;
    });

    it('should return false if a float number is not less than another float number', function() {
      m.chai.expect(queryl.match({
        $lt: {
          foo: 5.09999999
        }
      }, {
        foo: 5.1
      })).to.be.false;
    });

    it('should return true if a property named $lt is less than', function() {
      m.chai.expect(queryl.match({
        $lt: {
          $lt: 5
        }
      }, {
        $lt: 4
      })).to.be.true;
    });

    it('should return false if a property named $lt is greater than', function() {
      m.chai.expect(queryl.match({
        $lt: {
          $lt: 5
        }
      }, {
        $lt: 6
      })).to.be.false;
    });

    it('should return false if a property named $lt is equal to', function() {
      m.chai.expect(queryl.match({
        $lt: {
          $lt: 5
        }
      }, {
        $lt: 5
      })).to.be.false;
    });

  });

  describe('$or', function() {

    it('should throw an error if there is no queryl operand inside a $or', function() {
      m.chai.expect(function() {
        queryl.match({
          $or: {
            foo: 'bar'
          }
        }, {
          foo: 'baz'
        });
      }).to.throw('Unknown Queryl operation: foo');
    });

    it('should return true for two truthy operands', function() {
      m.chai.expect(queryl.match({
        $or: {
          $equal: {
            foo: 'bar'
          },
          $contain: {
            bar: 'baz'
          }
        }
      }, {
        foo: 'bar',
        bar: [ 'foo', 'bar', 'baz' ]
      })).to.be.true;
    });

    it('should return true for one truthy and one falsy operand', function() {
      m.chai.expect(queryl.match({
        $or: {
          $equal: {
            foo: 'bar'
          },
          $contain: {
            bar: 'baz'
          }
        }
      }, {
        foo: 'bar',
        bar: [ 'foo', 'bar' ]
      })).to.be.true;
    });

    it('should return false for two falsy operands', function() {
      m.chai.expect(queryl.match({
        $or: {
          $equal: {
            foo: 'bar'
          },
          $contain: {
            bar: 'baz'
          }
        }
      }, {
        foo: 'baz',
        bar: [ 'foo', 'bar' ]
      })).to.be.false;
    });

    it('should return true for one truthy operand', function() {
      m.chai.expect(queryl.match({
        $or: {
          $equal: {
            foo: 'bar'
          }
        }
      }, {
        foo: 'bar'
      })).to.be.true;
    });

    it('should return false for one falsy operand', function() {
      m.chai.expect(queryl.match({
        $or: {
          $equal: {
            foo: 'bar'
          }
        }
      }, {
        foo: 'baz'
      })).to.be.false;
    });

    it('should return false for a falsy nested $or operand', function() {
      m.chai.expect(queryl.match({
        $or: {
          $or: {
            $equal: {
              foo: 'bar'
            },
            $match: {
              foo: /^hello/
            }
          }
        }
      }, {
        foo: 'foo'
      })).to.be.false;
    });

    it('should return true for a truthy nested $or operand', function() {
      m.chai.expect(queryl.match({
        $or: {
          $or: {
            $equal: {
              foo: 'bar'
            },
            $match: {
              foo: /^hello/
            }
          }
        }
      }, {
        foo: 'hello world'
      })).to.be.true;
    });

  });

  describe('$and', function() {

    it('should throw an error if there is no queryl operand inside a $and', function() {
      m.chai.expect(function() {
        queryl.match({
          $and: {
            foo: 'bar'
          }
        }, {
          foo: 'baz'
        });
      }).to.throw('Unknown Queryl operation: foo');
    });

    it('should return true for two truthy operands', function() {
      m.chai.expect(queryl.match({
        $and: {
          $equal: {
            foo: 'bar'
          },
          $contain: {
            bar: 'baz'
          }
        }
      }, {
        foo: 'bar',
        bar: [ 'foo', 'bar', 'baz' ]
      })).to.be.true;
    });

    it('should return false for one truthy and one falsy operands', function() {
      m.chai.expect(queryl.match({
        $and: {
          $equal: {
            foo: 'bar'
          },
          $contain: {
            bar: 'baz'
          }
        }
      }, {
        foo: 'baz',
        bar: [ 'foo', 'bar', 'baz' ]
      })).to.be.false;
    });

    it('should return false for two falsy operands', function() {
      m.chai.expect(queryl.match({
        $and: {
          $equal: {
            foo: 'bar'
          },
          $contain: {
            bar: 'baz'
          }
        }
      }, {
        foo: 'baz',
        bar: [ 'foo', 'bar' ]
      })).to.be.false;
    });

    it('should return true for one truthy operand', function() {
      m.chai.expect(queryl.match({
        $and: {
          $equal: {
            foo: 'bar'
          }
        }
      }, {
        foo: 'bar'
      })).to.be.true;
    });

    it('should return false for one falsy operand', function() {
      m.chai.expect(queryl.match({
        $and: {
          $equal: {
            foo: 'bar'
          }
        }
      }, {
        foo: 'baz'
      })).to.be.false;
    });

    it('should return false for a falsy nested $and operand', function() {
      m.chai.expect(queryl.match({
        $and: {
          $and: {
            $equal: {
              foo: 'bar'
            },
            $match: {
              foo: /^hello/
            }
          }
        }
      }, {
        foo: 'bar'
      })).to.be.false;
    });

    it('should return true for a truthy nested $and operand', function() {
      m.chai.expect(queryl.match({
        $and: {
          $and: {
            $equal: {
              foo: 'bar'
            }
          }
        }
      }, {
        foo: 'bar'
      })).to.be.true;
    });

  });

  describe('$not', function() {

    it('should return true if the operand is empty', function() {
      m.chai.expect(queryl.match({
        $not: {}
      }, {
        foo: 'baz'
      })).to.be.true;
    });

    it('should throw an error if there is no queryl operand inside a $not', function() {
      m.chai.expect(function() {
        queryl.match({
          $not: {
            foo: 'bar'
          }
        }, {
          foo: 'baz'
        });
      }).to.throw('Unknown Queryl operation: foo');
    });

    it('should return true for a falsy operand', function() {
      m.chai.expect(queryl.match({
        $not: {
          $equal: {
            foo: 'bar'
          }
        }
      }, {
        foo: 'baz'
      })).to.be.true;
    });

    it('should return false for a truthy operand', function() {
      m.chai.expect(queryl.match({
        $not: {
          $equal: {
            foo: 'bar'
          }
        }
      }, {
        foo: 'bar'
      })).to.be.false;
    });

    it('should return false for multiple truthy operands', function() {
      m.chai.expect(queryl.match({
        $not: {
          $equal: {
            foo: 'bar'
          },
          $gt: {
            bar: 3
          }
        }
      }, {
        foo: 'baz',
        bar: 4
      })).to.be.false;
    });

    it('should return true for one truthy and one false operand', function() {
      m.chai.expect(queryl.match({
        $not: {
          $equal: {
            foo: 'bar'
          },
          $gt: {
            bar: 3
          }
        }
      }, {
        foo: 'baz',
        bar: 1
      })).to.be.true;
    });

    it('should return true for multiple falsy operands', function() {
      m.chai.expect(queryl.match({
        $not: {
          $equal: {
            foo: 'bar'
          },
          $gt: {
            bar: 3
          }
        }
      }, {
        foo: 'baz',
        bar: 1
      })).to.be.true;
    });

  });

});

queryl
------

[![npm version](https://badge.fury.io/js/queryl.svg)](http://badge.fury.io/js/queryl)
[![dependencies](https://david-dm.org/issuetrackapp/queryl.png)](https://david-dm.org/issuetrackapp/queryl.png)
[![Build Status](https://travis-ci.org/issuetrackapp/queryl.svg?branch=master)](https://travis-ci.org/issuetrackapp/queryl)
[![Build status](https://ci.appveyor.com/api/projects/status/3d3rxla0oartoh5p?svg=true)](https://ci.appveyor.com/project/jviotti/queryl)

Query language to perform complex object searches.

Description
-----------

Queryl allows one to build complex queries to match JavaScript objects. This can be useful to:

- Search collections of objects (even heterogeneus).
- Validate objects.
- Assert properties of an object for testing purposes.

Check the [FAQ](https://github.com/issuetrackapp/queryl#faq) for answers to common questions!

Installation
------------

Install `queryl` by running:

```sh
$ npm install --save queryl
```

Documentation
-------------

<a name="module_queryl.match"></a>
### queryl.match(query, object) ⇒ <code>Boolean</code>
**Kind**: static method of <code>[queryl](#module_queryl)</code>  
**Summary**: Query an object  
**Returns**: <code>Boolean</code> - whether it matches or not  
**Access:** public  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>Object</code> | query |
| object | <code>Object</code> | object |

**Example**  
```js
queryl.match({
  $or: {
    $equal: {
      foo: 'bar'
    },
    $and: {
      $not: {
        $match: {
          foo: /^baz/
        }
      },
      $gt: {
        bar: 3
      }
    }
  }
}, {
  foo: 'hello world',
  bar: 5
});
> true
```

Operations
----------


* [operations](#operations) : <code>object</code>
  * [.$and()](#operations.$and)
  * [.$or()](#operations.$or)
  * [.$not()](#operations.$not)
  * [.$equal()](#operations.$equal)
  * [.$contain()](#operations.$contain)
  * [.$match()](#operations.$match)
  * [.$gt()](#operations.$gt)
  * [.$lt()](#operations.$lt)

<a name="operations.$and"></a>
### operations.$and()
**Kind**: static method of <code>[operations](#operations)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| $and | <code>function</code> | logical conjunction |

**Example**  
```js
queryl.match({
  $and: {
    $equal: {
      foo: 'bar'
    },
    $match: {
      bar: /^hello/
    }
  }
}, {
  foo: 'bar',
  bar: 'hello world'
});
> true
```
<a name="operations.$or"></a>
### operations.$or()
**Kind**: static method of <code>[operations](#operations)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| $or | <code>function</code> | logical disjunction |

**Example**  
```js
queryl.match({
  $or: {
    $equal: {
      foo: 'bar'
    },
    $match: {
      bar: /^hello/
    }
  }
}, {
  foo: 'bar',
  bar: 'hey there'
});
> true
```
<a name="operations.$not"></a>
### operations.$not()
**Kind**: static method of <code>[operations](#operations)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| $not | <code>function</code> | logical negation |

**Example**  
```js
queryl.match({
  $not: {
    $equal: {
      foo: 'bar'
    }
  }
}, {
  foo: 'baz'
});
> true
```
<a name="operations.$equal"></a>
### operations.$equal()
This operation supports deep equality.

**Kind**: static method of <code>[operations](#operations)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| $equal | <code>function</code> | equality |

**Example**  
```js
queryl.match({
  $equal: {
    foo: 'bar'
  }
}, {
  foo: 'bar'
});
> true
```
<a name="operations.$contain"></a>
### operations.$contain()
This operation supports deep equality.

**Kind**: static method of <code>[operations](#operations)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| $contain | <code>function</code> | collection include |

**Example**  
```js
queryl.match({
  $contain: {
    foo: 1
  }
}, {
  foo: [ 1, 2, 3 ]
});
> true
```
<a name="operations.$match"></a>
### operations.$match()
**Kind**: static method of <code>[operations](#operations)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| $match | <code>function</code> | RegExp match |

**Example**  
```js
queryl.match({
  $match: {
    foo: /^hello/
  }
}, {
  foo: 'hello world'
});
> true
```
<a name="operations.$gt"></a>
### operations.$gt()
**Kind**: static method of <code>[operations](#operations)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| $gt | <code>function</code> | greater than |

**Example**  
```js
queryl.match({
  $gt: {
    foo: 5
  }
}, {
  foo: 6
});
> true
```
<a name="operations.$lt"></a>
### operations.$lt()
**Kind**: static method of <code>[operations](#operations)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| $lt | <code>function</code> | less than |

**Example**  
```js
queryl.match({
  $lt: {
    foo: 5
  }
}, {
  foo: 4
});
> true
```

Support
-------

If you're having any problem, please [raise an issue](https://github.com/issuetrackapp/queryl/issues/new) on GitHub and the IssueTrack team will be happy to help.

Tests
-----

Run the test suite by doing:

```sh
$ gulp test
```

Contribute
----------

- Issue Tracker: [github.com/issuetrackapp/queryl/issues](https://github.com/issuetrackapp/queryl/issues)
- Source Code: [github.com/issuetrackapp/queryl](https://github.com/issuetrackapp/queryl)

Before submitting a PR, please make sure that you include tests, and that [jshint](http://jshint.com) runs without any warning:

```sh
$ gulp lint
```

FAQ
---

### Why describing the matcher as an object instead of writing a function?

An object is much easier to encode/decode than a function, which is our use case for building Queryl.

### Why writing queries as objects with horrifying syntax instead of using a sensible DSL?

Queryl is a very low level engine to perform complex matches, and it's more machine than user friendly *by design*. By decoupling the engine from it's frontend, anyone can build their own DSLs that compile to Queryl, relying in a strong tested foundation.

Did you build a frontend for Queryl? Let us know so we can showcase it here!

License
-------

The project is licensed under the MIT license.

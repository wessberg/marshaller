# Marshaller [![NPM version][npm-image]][npm-url]
[![Dev Dependencies][dev-dependencies-image]][dev-dependencies-url]

[dev-dependencies-url]: https://david-dm.org/wessberg/typedetector?type=dev

[dev-dependencies-image]: https://david-dm.org/hub.com/wessberg/marshaller/dev-status.svg
[![deps][deps-image]][deps-url]

[deps-url]: https://david-dm.org/wessberg/typedetector

[deps-image]: https://david-dm.org/hub.com/wessberg/marshaller/status.svg
[![License-mit][license-mit-image]][license-mit-url]

[license-mit-url]: https://opensource.org/licenses/MIT

[license-mit-image]: https://img.shields.io/badge/License-MIT-yellow.svg
> A class that can map various data types back and forth between a string representation that can be transferred over the wire or evaluated using eval() or new Function() expressions and back to the native environment. This is equivalent to `JSON.parse()` and `JSON.stringify()` except with a much broader scope.

## Installation
Simply do: `npm install @wessberg/marshaller`.

## DISCLAIMER

This is an early version. There may still be bugs. If you run into some, please submit an issue on GitHub.

## Usage
```typescript
const marshaller = new Marshaller();

// Convert even complex data into a string representation, for example so it can be sent over the network.
marshaller.marshal({
    a: 1,
    b: new Date(),
    c: /foo/,
    d: [1, "1", new Set([1, 2, 3])],
    e: new (class Foo {})
}); // returns: {"a": 1, "b": new Date("2017-06-27T16:55:07.357Z"), "c": /foo/, "d": [1,"1",new Set([1,2,3])], "e": new (class Foo {static get __INSTANCE__VALUES_MAP () {return {}}})()}

// Convert the data back into complex types for the host environment.
const unmarshalled = marshaller.unmarshal(`{"a": 1, "b": new Date("2017-06-27T16:55:07.357Z"), "c": /foo/, "d": [1,"1",new Set([1,2,3])], "e": new (class Foo {static get __INSTANCE__VALUES_MAP () {return {}}})()}`);

// The data will have proper types
typeof unmarshalled.a === "number"; // true
unmarshalled.b instanceof Date; // true
unmarshalled.c instanceof RegExp; // true
Array.isArray(unmarshalled.d); // true
const [first, second, third] = unmarshalled.d;

// The Set will have the correct entries
third instanceof Set // true
third.has(2) // true

// Even the class instance can be reconstructed, including its members.
unmarshalled.e instanceof Foo // true
```

As you can see, there is really no limit to the kind of data you can marshall/unmarshall.
The library was written with the primary purpose of being able to cast anything to/from a string representation
so it could be networked, even instances of classes with mutated properties. This makes it possible to send class instances back and
forth between a client and server.

For example:

### Client

```typescript
class Foo {
	public isMutated: boolean = false;
}

const marshaller = new Marshaller();
const instance = new Foo();
instance.isMutated = true;

// Marshal the class instance so it can be sent over the wire
const marshalled = marshaller.marshal(instance);

// Send it over HTTP...
```

### Server

```typescript
const marshaller = new Marshaller();

// Upon receiving a request from the client...
const unmarshalled = marshaller.unmarshal(marshalledPayload);
unmarshalled instanceof Foo; // true
unmarshalled.isMutated; // true
```

## Use cases

This API is relatively low-level and allows for designing high-level APIs that abstracts away any need
to go to a string representation and back. Some include transferring data over the network while others include
storing data in a serialized database (such as `localStorage`).

An example could be a controller for a REST API endpoint, e.g.:

```typescript
class TodoController extends Controller {
	
	@PUTEndpoint("/api/todos/:id")
	async putTodoItem (todo: TodoItem) {
    	await put("todos", todo.id, todo);
    }
}
```

Where the base controller unmarshals the input data before passing it on to user-facing controllers.
There are many use cases for marshalling data though, and yours may be different.

## API

### `marshal()`

`marshal<T> (data: T): string`

#### Params
##### `data: T`
The input data.

#### Returns
##### `string`
The marshalled string representation of the data.

### `unmarshal()`

`unmarshal<T> (data: string): T|{}|null|undefined`

#### Params
##### `data: string`
The marshalled input data

#### Returns
##### `T|{}|null|undefined`
The unmarshalled data. Can be anything.

## Roadmap
* [X] Casting from/to `Set`.
* [X] Casting from/to `object`.
* [X] Casting from/to `string`.
* [X] Casting from/to `number`.
* [X] Casting from/to `boolean`.
* [X] Casting from/to `Array`.
* [X] Casting from/to `symbol`.
* [X] Casting from/to `class`.
* [X] Casting from/to `constructor`.
* [X] Casting from/to `null`.
* [X] Casting from/to `undefined`.
* [X] Casting from/to `Date`.
* [X] Casting from/to `Function`
* [X] Casting from/to `Map`
* [X] Casting from/to `WeakSet` (*)
* [X] Casting from/to `WeakMap` (*)
* [X] Casting from/to `RegExp`

The (*) means that the types cannot be restored to their initial state since the keys are weak and not iterable. There are no way of restoring the state. Instead, new instances will be created.

## Changelog

<a name="2.0.3"></a>
## 2.0.3 (2017-07-28)

* Fixed an issue where regular expressions would be matched falsely at times ([11be80e](https://github.com/wessberg/marshaller/commit/11be80e))



<a name="2.0.2"></a>
## 2.0.2 (2017-06-28)

* 2.0.2 ([4b2f784](https://github.com/wessberg/marshaller/commit/4b2f784))
* Fixed an issue where strings containing dates would be falsely unmarshalled as dates instead of regu ([358a542](https://github.com/wessberg/marshaller/commit/358a542))



<a name="2.0.1"></a>
## 2.0.1 (2017-06-28)

* 2.0.1 ([28ed02a](https://github.com/wessberg/marshaller/commit/28ed02a))
* Bumped TypeDetector dependency. Allowed construction without explicitly calling the constructor with ([71eea6c](https://github.com/wessberg/marshaller/commit/71eea6c))
* Updated version number in README ([209ecaa](https://github.com/wessberg/marshaller/commit/209ecaa))



<a name="2.0.0"></a>
# 2.0.0 (2017-06-27)

* 2.0.0 ([4f60567](https://github.com/wessberg/marshaller/commit/4f60567))
* Major overhaul ([c4ba740](https://github.com/wessberg/marshaller/commit/c4ba740))



<a name="1.0.24"></a>
## 1.0.24 (2017-06-26)

* 1.0.24 ([839e30b](https://github.com/wessberg/marshaller/commit/839e30b))
* Added mapping to/from Date ([0b57890](https://github.com/wessberg/marshaller/commit/0b57890))



<a name="1.0.23"></a>
## 1.0.23 (2017-06-12)

* 1.0.23 ([8abc77d](https://github.com/wessberg/marshaller/commit/8abc77d))
* Added a disclaimer to the README. ([b235897](https://github.com/wessberg/marshaller/commit/b235897))



<a name="1.0.22"></a>
## 1.0.22 (2017-05-18)

* 1.0.22 ([3a23ae3](https://github.com/wessberg/marshaller/commit/3a23ae3))
* Added mapping to/from Map. ([702a144](https://github.com/wessberg/marshaller/commit/702a144))



<a name="1.0.21"></a>
## 1.0.21 (2017-05-17)

* 1.0.21 ([6b851f3](https://github.com/wessberg/marshaller/commit/6b851f3))
* Made sure that quoted strings will not be re-quoted. ([68cf172](https://github.com/wessberg/marshaller/commit/68cf172))



<a name="1.0.20"></a>
## 1.0.20 (2017-05-17)

* 1.0.20 ([ea9016e](https://github.com/wessberg/marshaller/commit/ea9016e))
* Added marshalling to/from class instances and class constructors. ([7e61330](https://github.com/wessberg/marshaller/commit/7e61330))



<a name="1.0.19"></a>
## 1.0.19 (2017-05-16)

* 1.0.19 ([d0d6ae7](https://github.com/wessberg/marshaller/commit/d0d6ae7))
* Corrected issues with marshalling global/window/self/root. ([e4c6e22](https://github.com/wessberg/marshaller/commit/e4c6e22))



<a name="1.0.18"></a>
## 1.0.18 (2017-05-14)

* 1.0.18 ([854eded](https://github.com/wessberg/marshaller/commit/854eded))
* Improved stringifying functions inside object literals. ([f6c6503](https://github.com/wessberg/marshaller/commit/f6c6503))



<a name="1.0.17"></a>
## 1.0.17 (2017-05-14)

* 1.0.17 ([d4b3014](https://github.com/wessberg/marshaller/commit/d4b3014))
* Corrected some issues with marshalling to/from undefined ([7bbec70](https://github.com/wessberg/marshaller/commit/7bbec70))



<a name="1.0.16"></a>
## 1.0.16 (2017-05-06)

* 1.0.16 ([327ff74](https://github.com/wessberg/marshaller/commit/327ff74))
* Bumped  dependency. ([385d5e5](https://github.com/wessberg/marshaller/commit/385d5e5))



<a name="1.0.15"></a>
## 1.0.15 (2017-05-06)

* 1.0.15 ([a468eae](https://github.com/wessberg/marshaller/commit/a468eae))
* Added the 'getTypeOf' method to the interface ([c793276](https://github.com/wessberg/marshaller/commit/c793276))



<a name="1.0.14"></a>
## 1.0.14 (2017-05-06)

* 1.0.14 ([bb29057](https://github.com/wessberg/marshaller/commit/bb29057))
* Added a proxy for the  method of the dependent  library. ([1f6c8da](https://github.com/wessberg/marshaller/commit/1f6c8da))



<a name="1.0.13"></a>
## 1.0.13 (2017-05-05)

* 1.0.13 ([d09b5e5](https://github.com/wessberg/marshaller/commit/d09b5e5))
* Small fixes to the function regexes. ([e5f4574](https://github.com/wessberg/marshaller/commit/e5f4574))



<a name="1.0.12"></a>
## 1.0.12 (2017-05-05)

* 1.0.12 ([f19ca32](https://github.com/wessberg/marshaller/commit/f19ca32))
* Switched to  for marshalling strings to objects. ([12e4f09](https://github.com/wessberg/marshaller/commit/12e4f09))



<a name="1.0.11"></a>
## 1.0.11 (2017-05-05)

* 1.0.11 ([0e69bbf](https://github.com/wessberg/marshaller/commit/0e69bbf))
* Fixed a bug with marshalling strings that contains the word function. ([19c762c](https://github.com/wessberg/marshaller/commit/19c762c))



<a name="1.0.10"></a>
## 1.0.10 (2017-05-04)

* 1.0.10 ([2dfc96f](https://github.com/wessberg/marshaller/commit/2dfc96f))
* The Marshaller can no marshal to objects if that is the most probable type, even if a hint is not gi ([0f46f24](https://github.com/wessberg/marshaller/commit/0f46f24))



<a name="1.0.9"></a>
## 1.0.9 (2017-05-04)

* 1.0.9 ([4a2ca53](https://github.com/wessberg/marshaller/commit/4a2ca53))
* Moved null checks up to fix errors ([b855e5e](https://github.com/wessberg/marshaller/commit/b855e5e))
* Moved null checks up to fix errors ([db239f2](https://github.com/wessberg/marshaller/commit/db239f2))



<a name="1.0.8"></a>
## 1.0.8 (2017-05-04)

* 1.0.8 ([c3b8244](https://github.com/wessberg/marshaller/commit/c3b8244))
* Added marshalling to/from . ([7af148f](https://github.com/wessberg/marshaller/commit/7af148f))



<a name="1.0.7"></a>
## 1.0.7 (2017-05-04)

* 1.0.7 ([4db2917](https://github.com/wessberg/marshaller/commit/4db2917))
* Marshalling objects to string no longer uses JSON.stringify. Rather, it tries to correctly format th ([f4e9312](https://github.com/wessberg/marshaller/commit/f4e9312))



<a name="1.0.6"></a>
## 1.0.6 (2017-05-03)

* 1.0.6 ([1c8057a](https://github.com/wessberg/marshaller/commit/1c8057a))
* Added marshalling to/from ([e38c8c0](https://github.com/wessberg/marshaller/commit/e38c8c0))



<a name="1.0.5"></a>
## 1.0.5 (2017-04-30)

* 1.0.5 ([2d4e55f](https://github.com/wessberg/marshaller/commit/2d4e55f))
* Fixed a bug where errors could be thrown while attempting to marshal a string using heuristics. ([7fc9f64](https://github.com/wessberg/marshaller/commit/7fc9f64))



<a name="1.0.4"></a>
## 1.0.4 (2017-04-26)

* 1.0.4 ([c792663](https://github.com/wessberg/marshaller/commit/c792663))
* Made a correction for marshalling strings to buest guess ([554f86d](https://github.com/wessberg/marshaller/commit/554f86d))



<a name="1.0.3"></a>
## 1.0.3 (2017-04-26)

* 1.0.3 ([03dc3a1](https://github.com/wessberg/marshaller/commit/03dc3a1))
* Added marshalling to/from symbol ([43ed7c1](https://github.com/wessberg/marshaller/commit/43ed7c1))



<a name="1.0.2"></a>
## 1.0.2 (2017-04-24)

* 1.0.2 ([0cf7298](https://github.com/wessberg/marshaller/commit/0cf7298))
* Updated README and a few typings. ([38738d3](https://github.com/wessberg/marshaller/commit/38738d3))



<a name="1.0.1"></a>
## 1.0.1 (2017-04-23)

* 1.0.1 ([5bbffc4](https://github.com/wessberg/marshaller/commit/5bbffc4))
* Added .idea to npmignore ([c9f198c](https://github.com/wessberg/marshaller/commit/c9f198c))
* First commit ([d8ec92b](https://github.com/wessberg/marshaller/commit/d8ec92b))
* Made the package scoped for private access ([807a605](https://github.com/wessberg/marshaller/commit/807a605))





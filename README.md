# Marshaller [![NPM version][npm-image]][npm-url]
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

## Changelog:

**v2.0.2**:

- Fixed an issue where strings containing dates would be falsely unmarshalled as dates instead of regular strings.

**v2.0.1**:

- Bumped TypeDetector dependency. Allowed construction without explicitly calling the constructor with TypeDetector so it can be used by clients who does not directly depend on it.

**v2.0.0**:

- Major overhaul. Where the Marshaller could previously map between any types, the Marshaller now has a sharp focus on being able to marshal any data to a string representation and be able to unmarshal the data back into the native representation in a non-destructive operation (e.g. all data should be re-retrievable).

- `RegExp`, `WeakMap` and `WeakSet` is now supported.

- Smaller size.

**v1.0.25**:

- Class instances can now be marshalled to strings and marshalled back into a native representation while stile preserving the instance values that has been set over time. This allows for, among other things, sending an instance of a class over the wire and then "reassembling" the class and instance values. For the user, this feels like sending a complex class instance via HTTP.

**v1.0.24**:

- Added mapping to/from `Date`.

**v1.0.23**:

- Added a disclaimer to the README.

**v1.0.22**:

- Added mapping to/from `Map`.

**v1.0.21**:

- Made sure that quoted strings will not be re-quoted. 

**v1.0.20**:

- Added marshalling to/from class instances and class constructors.

**v1.0.19**:

- Corrected issues with marshalling global/window/self/root.

**v1.0.18**:

- Improved stringifying functions inside object literals.

**v1.0.17**:

- Corrected some issues with marshalling to/from `undefined`.

**v1.0.16**:

- Bumped `typedecetor` dependency.

**v1.0.14**:

- Added a proxy for the `getTypeOf` method of the dependent `typeDetector` library.

**v1.0.13**:

- Small fixes to the function regexes.

**v1.0.12**:

- Switched to `new Function()` for marshalling strings to objects.

**v1.0.11**:

- Fixed a bug with marshalling strings that contains the word "function".

**v1.0.10**:

- The Marshaller can no marshal to objects if that is the most probable type, even if a hint is not given.

**v1.0.9**:

- Moved null checks around to fix bugs.

**v1.0.8**:

- Added marshalling to/from `null`.

**v1.0.7**:

- Marshalling objects to string no longer uses JSON.stringify. Rather, it tries to correctly format the object as close to native as possible.

**v1.0.6**:

- Added marshalling to/from `function`.

**v1.0.5**:

- Fixed a bug where errors could be thrown while attempting to marshal a string using heuristics.

**v1.0.3**:

- Added marshalling to/from `symbol`.

**v1.0.2**:

- Updated README and a few typings.

**v1.0.0**:

- First release.

[npm-url]: https://npmjs.org/package/@wessberg/marshaller
[npm-image]: https://badge.fury.io/js/@wessberg/marshaller.svg
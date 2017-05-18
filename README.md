# Marshaller [![NPM version][npm-image]][npm-url]
> A class that maps between a variety of data types.

## Installation
Simply do: `npm install @wessberg/marshaller`.

## Usage
```javascript
const marshaller = new Marshaller();

marshaller.marshal("true", Boolean); // true
marshaller.marshal("0", Boolean); // false
marshaller.marshal([1, 2, false, true], String); // [ 1, 2, false, true]
marshaller.marshal("Infinity"); // Auto-mapped to number - Infinity.
marshaller.marshal<number, string>(123, "a hint") // "123", generic typecasting.
```

As you can see, you simply pass some arbitrary data and *optionally* the type
you want to map to. If you don't provide any, `Marshaller` will attempt to find
the most appropriate type to map to using heuristics. The second argument, the hint,
accepts either a constructor for a type or a concrete instance of one.

## API
`marshal<T, U> (data: T, hint?: U|Newable<U>): U | null|undefined`

#### Params
##### `data: T`
The input data.

##### `hint?: U|Newable<U>`
An optional hint to define which data type to marshal to. If omitted, the data will be parsed
into the type `Marshaller` finds most appropriate.

#### Returns
##### `U`
The marshalled version of the input data.

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
* [ ] Casting from/to `Date`.
* [X] Casting from/to `Function`
* [X] Casting from/to `Map`
* [ ] Casting from/to `WeakSet`
* [ ] Casting from/to `WeakMap`
* [ ] Casting from/to `RegExp`

## Changelog:

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
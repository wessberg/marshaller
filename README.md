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
* [X] Casting from/to `Object`.
* [X] Casting from/to `String`.
* [X] Casting from/to `Number`.
* [X] Casting from/to `Boolean`.
* [X] Casting from/to `Array`.
* [ ] Casting from/to `Date`.
* [ ] Casting from/to `Function`
* [ ] Casting from/to `Map`
* [ ] Casting from/to `WeakSet`
* [ ] Casting from/to `WeakMap`
* [ ] Casting from/to `RegExp`

## Changelog:

**v1.0.2**:

- Updated README and a few typings.

**v1.0.0**:

- First release.

[npm-url]: https://npmjs.org/package/@wessberg/marshaller
[npm-image]: https://badge.fury.io/js/@wessberg/marshaller.svg
# Marshaller [![NPM version][npm-image]][npm-url]
> A class that maps between a variety of data types.

## Installation
Simply do: `npm install marshaller`.

## Usage
```typescript
const marshaller = new Marshaller();

marshaller.marshal("true", Boolean); // true
marshaller.marshal("0", Boolean); // false
marshaller.marshal([1, 2, false, true], String); // [ 1, 2, false, true]
marshaller.marshal("Infinity"); // Auto-mapped to number - Infinity.
```

As you can see, you simply pass some arbitrary data and *optionally* the type
you want to map to. If you don't provide any, `Marshaller` will attempt to find
the most appropriate type to map to using heuristics. The second argument, the hint,
accepts either a constructor for a type or a concrete instance of one.

## Changelog:

**v1.0**:

- First release.

[npm-url]: https://npmjs.org/package/marshaller
[npm-image]: https://badge.fury.io/js/marshaller.svg
# @wessberg/marshaller
[![NPM version][npm-version-image]][npm-version-url]
[![License-mit][license-mit-image]][license-mit-url]

<a href="https://www.patreon.com/bePatron?u=11315442"><img height="30" src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" /></a>

[license-mit-url]: https://opensource.org/licenses/MIT

[license-mit-image]: https://img.shields.io/badge/License-MIT-yellow.svg

[npm-version-url]: https://www.npmjs.com/package/@wessberg/marshaller

[npm-version-image]: https://badge.fury.io/js/%40wessberg%2Fmarshaller.svg

## Installation
Simply do: `npm install @wessberg/marshaller`.

## Description

This package is a lightweight way to serialize and deserialize complex data types non-destructively.
Essentially, it is `JSON.parse()` and `JSON.stringify` with support for far more data types, circular references, and with the guarantee that
whatever is serialized can be deserialized into the exact same representation without losing *any* information.

You can consider this to be direct replacements for the `JSON.[stringify|parse]` methods, provided through `marshall` for serialization and `demarshall` for deserialization.

## Supported data types and features

- Anything that is JSON serializable today: `number`, `boolean`, `string`, `array`, `object literal`
- Circular references
- `RegExp`
- `Date`
- `Map`
- `Set`
- `Symbol`
- `BigInt`
- `undefined`
- `null`
- `Int8Array`
- `Int16Array`
- `Int32Array`
- `UInt8Array`
- `UInt8ClampedArray`
- `UInt16Array`
- `UInt32Array`
- `Float32Array`
- `Float64Array`

## Usage
```typescript
import {marshall, demarshall} from "@wessberg/marshaller";

// Marshall some complex data that wouldn't normally be JSON serializable
const marshallResult = marshall({a: new Set([1, 2, /foo/, {a: new Date(), b: new Float32Array([1, 2, 3])}])})

// Demarshall it to get a structurally identical representation back of the data
const demarshallResult = demarshall(marshallResult);
```

## Security

Due to security considerations, you *cannot* marshall/demarshall functions and/or methods.

## Backers

[Become a backer](https://www.patreon.com/bePatron?c=1770586) and get your name, logo, and link to your site listed here. Your help is greatly appreciated!
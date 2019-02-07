<!-- SHADOW_SECTION_LOGO_START -->

<div><img alt="Logo" src="https://raw.githubusercontent.com/wessberg/marshaller/master/documentation/asset/logo.png" height="180"   /></div>

<!-- SHADOW_SECTION_LOGO_END -->

<!-- SHADOW_SECTION_DESCRIPTION_SHORT_START -->

> A lightweight way to serialize and deserialize complex data types non-destructively

<!-- SHADOW_SECTION_DESCRIPTION_SHORT_END -->

<!-- SHADOW_SECTION_BADGES_START -->

<a href="https://npmcharts.com/compare/%40wessberg%2Fmarshaller?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/%40wessberg%2Fmarshaller.svg"    /></a>
<a href="https://david-dm.org/wessberg/marshaller"><img alt="Dependencies" src="https://img.shields.io/david/wessberg%2Fmarshaller.svg"    /></a>
<a href="https://github.com/wessberg/marshaller/graphs/contributors"><img alt="Contributors" src="https://img.shields.io/github/contributors/wessberg%2Fmarshaller.svg"    /></a>
<a href="https://github.com/prettier/prettier"><img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"    /></a>
<a href="https://opensource.org/licenses/MIT"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg"    /></a>
<a href="https://www.patreon.com/bePatron?u=11315442"><img alt="Support on Patreon" src="https://img.shields.io/badge/patreon-donate-green.svg"    /></a>

<!-- SHADOW_SECTION_BADGES_END -->

<!-- SHADOW_SECTION_DESCRIPTION_LONG_START -->

## Description

<!-- SHADOW_SECTION_DESCRIPTION_LONG_END -->

Marshaller provides a lightweight way to serialize and deserialize complex data types non-destructively.
Essentially, it is `JSON.parse()` and `JSON.stringify` with support for far more data types, circular references, and with the guarantee that
whatever is serialized can be deserialized into the exact same representation without losing _any_ information.

You can consider this to be direct replacements for the `JSON.[stringify|parse]` methods, provided through `marshall` for serialization and `demarshall` for deserialization.

<!-- SHADOW_SECTION_FEATURES_START -->

### Features

<!-- SHADOW_SECTION_FEATURES_END -->

- _"`JSON.parse`/`JSON.stringify` on steroids"_
- Non-destructive serialization/deserialization of data
- Supports Circular references
- A wide variety of supported data types - from simple things as strings to complex things such as Maps, Sets and Typed Arrays

<!-- SHADOW_SECTION_FEATURE_IMAGE_START -->

<!-- SHADOW_SECTION_FEATURE_IMAGE_END -->

<!-- SHADOW_SECTION_TOC_START -->

## Table of Contents

- [Description](#description)
  - [Features](#features)
- [Table of Contents](#table-of-contents)
- [Install](#install)
  - [NPM](#npm)
  - [Yarn](#yarn)
- [Supported data types and features](#supported-data-types-and-features)
- [Usage](#usage)
- [Contributing](#contributing)
- [Maintainers](#maintainers)
- [Backers](#backers)
  - [Patreon](#patreon)
  - [FAQ](#faq)
    - [Why are functions not supported](#why-are-functions-not-supported)
- [License](#license)

<!-- SHADOW_SECTION_TOC_END -->

<!-- SHADOW_SECTION_INSTALL_START -->

## Install

### NPM

```
$ npm install @wessberg/marshaller
```

### Yarn

```
$ yarn add @wessberg/marshaller
```

<!-- SHADOW_SECTION_INSTALL_END -->

## Supported data types and features

- Anything that is JSON serializable today: `number`, `boolean`, `string`, `array`, `object literal`
- References, including circular references
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
- `String`
- `Number`
- `Boolean`

<!-- SHADOW_SECTION_USAGE_START -->

## Usage

<!-- SHADOW_SECTION_USAGE_END -->

```typescript
import {marshall, demarshall} from "@wessberg/marshaller";

// Marshall some complex data that wouldn't normally be JSON serializable
const marshallResult = marshall({
  a: new Set([1, 2, /foo/, {a: new Date(), b: new Float32Array([1, 2, 3])}])
});

// Demarshall it to get a structurally identical representation back of the data
const demarshallResult = demarshall(marshallResult);
```

<!-- SHADOW_SECTION_CONTRIBUTING_START -->

## Contributing

Do you want to contribute? Awesome! Please follow [these recommendations](./CONTRIBUTING.md).

<!-- SHADOW_SECTION_CONTRIBUTING_END -->

<!-- SHADOW_SECTION_MAINTAINERS_START -->

## Maintainers

| <img alt="Frederik Wessberg" src="https://avatars2.githubusercontent.com/u/20454213?s=460&v=4" height="70"   />                   |
| --------------------------------------------------------------------------------------------------------------------------------- |
| [Frederik Wessberg](mailto:frederikwessberg@hotmail.com)<br>[@FredWessberg](https://twitter.com/FredWessberg)<br>_Lead Developer_ |

<!-- SHADOW_SECTION_MAINTAINERS_END -->

<!-- SHADOW_SECTION_BACKERS_START -->

## Backers

### Patreon

[Become a backer](https://www.patreon.com/bePatron?u=11315442) and get your name, avatar, and Twitter handle listed here.

<a href="https://www.patreon.com/bePatron?u=11315442"><img alt="Backers on Patreon" src="https://patreon-badge.herokuapp.com/11315442.png"  width="500"  /></a>

<!-- SHADOW_SECTION_BACKERS_END -->

<!-- SHADOW_SECTION_FAQ_START -->

### FAQ

<!-- SHADOW_SECTION_FAQ_END -->

#### Why are functions not supported

First, there are security considerations. But more importantly, functions can reference identifiers that lives in a lexical
environment that is declared outside of the local scope of that function. Marshalling this data would require passing in
a sandboxed environment which breaks the promise of the library - simple replacement for JSON, with non-destructive serialization/deserialization.

<!-- SHADOW_SECTION_LICENSE_START -->

## License

MIT © [Frederik Wessberg](mailto:frederikwessberg@hotmail.com) ([@FredWessberg](https://twitter.com/FredWessberg)) ([Website](https://github.com/wessberg))

<!-- SHADOW_SECTION_LICENSE_END -->

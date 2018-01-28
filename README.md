# Hashflags

[![npm](https://img.shields.io/npm/v/hashflags.svg)](https://www.npmjs.com/package/hashflags)
[![Build Status](https://travis-ci.org/JamieMagee/hashflags-node.svg?branch=master)](https://travis-ci.org/JamieMagee/hashflags-node)
[![Coverage Status](https://coveralls.io/repos/github/JamieMagee/hashflags-node/badge.svg?branch=master)](https://coveralls.io/github/JamieMagee/hashflags-node?branch=master)
[![MIT license](http://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)

A library for using Twitter hashflags in the browser and Node.js

# Installation

Using npm:

```sh
$ npm install hashflags
```

Using CDN:

```HTML
<script src="https://unpkg.com/jamiemagee/dist/hashflags.min.js"></script>
```

# Examples

Importing and initialising `Hashflags` in TypeScript

```ts
import { Hashflags } from 'hashflags';
import { URL } from 'url';

let hf: Hashflags;
Hashflags.FETCH().then((val: Map<string, URL>) => {
    hf = new Hashflags(val);
    console.log(hf.activeHashflags);
});
```

Importing and initialising `Hashflags` in JavaScript

```js
const Hashflags = require('hashflags').Hashflags;

let hf;
Hashflags.FETCH().then((val) => {
    hf = new Hashflags(val);
    console.log(hf.activeHashflags);
});
```

# License

MIT
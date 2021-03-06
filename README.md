# Hashflags

[![npm](https://img.shields.io/npm/v/hashflags.svg)](https://www.npmjs.com/package/hashflags)
[![Build Status](https://travis-ci.org/JamieMagee/hashflags-node.svg?branch=master)](https://travis-ci.org/JamieMagee/hashflags-node)
[![dependencies Status](https://david-dm.org/JamieMagee/hashflags-node/status.svg)](https://david-dm.org/JamieMagee/hashflags-node)
[![devDependencies Status](https://david-dm.org/JamieMagee/hashflags-node/dev-status.svg)](https://david-dm.org/JamieMagee/hashflags-node?type=dev)
[![Coverage Status](https://coveralls.io/repos/github/JamieMagee/hashflags-node/badge.svg?branch=master)](https://coveralls.io/github/JamieMagee/hashflags-node?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/0612b5ce530451c5e520/maintainability)](https://codeclimate.com/github/JamieMagee/hashflags-node/maintainability)
[![MIT license](http://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FJamieMagee%2Fhashflags-node.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FJamieMagee%2Fhashflags-node?ref=badge_shield)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Dependabot badge](https://img.shields.io/badge/Dependabot-enabled-blue.svg)](https://dependabot.com/)
[![Known Vulnerabilities](https://snyk.io/test/github/jamiemagee/hashflags-node/badge.svg?targetFile=package.json)](https://snyk.io/test/github/jamiemagee/hashflags-node?targetFile=package.json)

A library for using Twitter hashflags in the browser and Node.js

# Installation

Using npm:

```sh
npm install hashflags
```

# Examples

Importing and initialising `Hashflags` in TypeScript

```ts
import { Hashflags } from 'hashflags';

let hf: Hashflags;
Hashflags.FETCH().then((val: Map<string, string>) => {
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

# Credits

If you like this follow [@Jamie_Magee](https://twitter.com/Jamie_Magee) on Twitter.

# License

MIT
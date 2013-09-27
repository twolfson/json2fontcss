# json2fontcss [![Build status](https://travis-ci.org/twolfson/doubleshot.png?branch=master)](https://travis-ci.org/twolfson/doubleshot)

Converter from JSON to font variables for CSS

## Getting Started
Install the module with: `npm install json2fontcss`

```javascript
// Compilation
var json2fontcss = require('json2fontcss'),
    params = {
      chars: [
        {'name': 'github', 'value': 'e0000'},
        {'name': 'twitter', 'value': 'e0001'},
        {'name': 'rss', 'value': 'e0002'}
      ],
      fonts: {
        svg: 'public/fonts/font.svg',
        ttf: 'public/fonts/font.ttf',
        eot: 'public/fonts/font.eot',
        woff: 'public/fonts/font.woff'
      },
      fontFamily: 'my-icon-set',
      format: 'stylus'
    },
    stylus = json2fontcss(params);

// Result (Stylus)
$github_font_family = "my-icon-set";
$github_value = "\e0000";
$github = "my-icon-set" "\e0000";
...
icon($char) {
  iconFontFamily($char)
  iconFont()

  &:before {
    iconContent($char)
  }
}

// Inside of your Stylus
.github-icon {
  icon($github)
}
```

## Documentation
`json2fontcss` exposes a single function.

```js
json2fontcss(params);
/**
 * Convert font character info into CSS variables
 * @param {Object} params Container for parameters
 * @param {Object[]} params.chars Information about each character mapping
 * @param {String} params.chars.name Variable name for character
 * @param {String} params.chars.value Hexadecimal UTF8 value for character
 * @param {Object} params.fonts Font type keys to font url paths (e.g. {less: '../font.svg'})
 * @param {String} [params.fontFamily="icon-font"] Optional name for font-family
 * @param {String} [params.template="json"] Optional template to generate with
 * @param {Mixed} [params.options={}] Optional options for template
 * @returns {String} Pre-processor ready CSS generated from specified template
 */
```

Templates are managed via

```js
json2fontcss.templates; // Object containing key-value pairs of template engines
json2fontcss.addTemplate(name, fn); // Utility to add new templates
json2fontcss.addMustacheTemplate(name, tmpl); // Utility to add new mustache templates
```

## Donating
Support this project and [others by twolfson][gittip] via [gittip][].

[![Support via Gittip][gittip-badge]][gittip]

[gittip-badge]: https://rawgithub.com/twolfson/gittip-badge/master/dist/gittip.png
[gittip]: https://www.gittip.com/twolfson/

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint your code using [grunt](https://github.com/gruntjs/grunt) and test via `npm test`.

## License
Copyright (c) 2013 Todd Wolfson

Licensed under the MIT license.

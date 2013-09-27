var assert = require('assert'),
    fs = require('fs'),
    exec = require('child_process').exec,
    Tempfile = require('temporary/lib/file'),
    json2fontcss = require('../lib/json2fontcss.js'),
    expectedDir = __dirname + '/expected_files';

module.exports = {
  // Common setup/assertion
  'An array of characters and names': function () {
    this.params = {
      chars: [
        {'name': 'icon1', 'value': 'e0000'},
        {'name': 'icon2', 'value': 'e0001'},
        {'name': 'icon3', 'value': 'e0002'}
      ],
      fonts: {
        svg: 'abc/123/font.svg',
        ttf: 'abc/123/font.ttf',
        eot: 'abc/123/font.eot',
        woff: 'abc/123/font.woff'
      },
      fontFamily: 'my-icon-set'
    };
  },
  'processed via json2fontcss': function () {
    // Convert info into result via json2fontcss
    var params = this.params,
        result = json2fontcss(params);
    this.result = result;

    // If we are debugging, output results to a file
    if (true) {
    // if (false) {
      try { fs.mkdirSync(__dirname + '/actual_files/'); } catch (e) {}
      fs.writeFileSync(__dirname + '/actual_files/' + this.filename, result, 'utf8');
    }
  },
  'matches as expected': function () {
    // Load in the files and assert
    var actual = this.result,
        expected = fs.readFileSync(expectedDir  + '/' + this.filename, 'utf8');
    assert.strictEqual(actual, expected);
  },

  // JSON
  'processed into JSON': [function () {
    this.params.template = null;
    this.filename = 'json.json';
  }, 'processed via json2fontcss'],
  'is valid JSON': function () {
    var result = this.result;
    assert.doesNotThrow(function () {
      JSON.parse(result);
    });
  },

  // Stylus
  'processed into Stylus': [function () {
    this.params.template = 'stylus';
    this.filename = 'stylus.styl';
  }, 'processed via json2fontcss'],
  'is valid Stylus': function (done) {
    // Add some stylus which hooks into our result
    var styl = this.result;
    styl += [
      '.feature:before',
      '  font-family: $icon1_font_family',
      '  iconContent($icon2)',
      '',
      '.feature2',
      '  icon($icon3)'
    ].join('\n');

    // Render the stylus
    var stylus = require('stylus');

    stylus.render(styl, function handleStylus (err, css) {
      // Assert no errors and validity of CSS
      assert.strictEqual(err, null);
      assert.notEqual(css, '');

      // TODO: Validate CSS
      // console.log('Stylus', css);

      // Callback
      done(err);
    });
  },

  // LESS
  'processed into LESS': [function () {
    this.params.template = 'less';
    this.filename = 'less.less';
  }, 'processed via json2fontcss'],
  'is valid LESS': function (done) {
    // Add some LESS to our result
    var lessStr = this.result;
    lessStr += [
      '.feature:before {',
      '  font-family: @icon1-font-family;',
      '  .icon-content(@icon2-value)',
      '}',
      '',
      '.feature2 {',
      '  .icon(@icon3);',
      '}'
    ].join('\n');

    // Render the LESS, assert no errors, and valid CSS
    var less = require('less');
    less.render(lessStr, function (err, css) {
      assert.strictEqual(err, null);
      assert.notEqual(css, '');

      // console.log('LESS', css);

      // Verify there are no braces in the CSS (array string coercion)
      assert.strictEqual(css.indexOf(']'), -1);

      // Callback
      done(err);
    });
  },

  // // SASS
  // 'processed into SASS': [function () {
  //   this.options = {'format': 'sass'};
  //   this.filename = 'sass.sass';
  // }, 'processed via json2fontcss'],
  // 'is valid SASS': function (done) {
  //   // Add some SASS to our result
  //   var sassStr = this.result;
  //   sassStr += '\n' + [
  //     '.feature',
  //     '  height: $sprite1-height',
  //     '  @include sprite-width($sprite2)',
  //     '  @include sprite-image($sprite3)',
  //     '',
  //     '.feature2',
  //     '  @include sprite($sprite2)'
  //   ].join('\n');

  //   // Render the SASS, assert no errors, and valid CSS
  //   var tmp = new Tempfile();
  //   tmp.writeFileSync(sassStr);
  //   exec('sass ' + tmp.path, function (err, css, stderr) {
  //     assert.strictEqual(stderr, '');
  //     assert.strictEqual(err, null);
  //     assert.notEqual(css, '');
  //     // console.log('SASS', css);
  //     done(err);
  //   });
  // },

  // SCSS
  'processed into SCSS': [function () {
    this.params.template = 'scss';
    this.filename = 'scss.scss';
  }, 'processed via json2fontcss'],
  'is valid SCSS': function (done) {
    // Add some SCSS to our result
    var scssStr = this.result;
    scssStr += '\n' + [
      '.feature:before {',
      '  font-family: $icon1-font-family;',
      '  @include icon-content($icon2-value)',
      '}',
      '',
      '.feature2 {',
      '  @include icon($icon3);',
      '}'
    ].join('\n');

    // Render the SCSS, assert no errors, and valid CSS
    var tmp = new Tempfile();
    tmp.writeFileSync(scssStr);
    exec('sass --scss ' + tmp.path, function (err, css, stderr) {
      assert.strictEqual(stderr, '');
      assert.strictEqual(err, null);
      assert.notEqual(css, '');
      // console.log('SCSS', css);
      done(err);
    });
  }
};

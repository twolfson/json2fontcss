// Load in our modules
var fs = require('fs'),
    mustache = require('mustache');

// Set up templates and helper functions for adding new ones
var templates = {};
function addTemplate(name, fn) {
  templates[name] = fn;
}
function addMustacheTemplate(name, tmpl) {
  var tmplFn = mustache.render.bind(mustache, tmpl);
  return addTemplate(name, tmplFn);
}

// Add in templates
var stylusTmpl = fs.readFileSync(__dirname + '/stylus.mustache.styl', 'utf8');
addMustacheTemplate('stylus', stylusTmpl);

var lessTmpl = fs.readFileSync(__dirname + '/less.mustache.less', 'utf8');
addMustacheTemplate('stylus', lessTmpl);

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
function json2fontcss(params) {
  return mustache.render(tmpl, params);
}
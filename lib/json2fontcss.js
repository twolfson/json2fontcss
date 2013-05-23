// Load in our modules
var fs = require('fs'),
    assert = require('assert'),
    mustache = require('mustache'),
    _ = require('underscore');

// Set up templates and helper functions for adding new ones
var templates = {},
    templateDir = __dirname + '/templates/';
function addTemplate(name, fn) {
  templates[name] = fn;
}
function addMustacheTemplate(name, tmpl) {
  var tmplFn = mustache.render.bind(mustache, tmpl);
  return addTemplate(name, tmplFn);
}

// Add in templates
var stylusTmpl = fs.readFileSync(templateDir + 'stylus.mustache.styl', 'utf8');
addMustacheTemplate('stylus', stylusTmpl);

var lessTmpl = fs.readFileSync(templateDir + 'less.mustache.less', 'utf8');
addMustacheTemplate('less', lessTmpl);

addTemplate('json', require('./templates/json'));

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
  // Grab the specified template
  var tmplName = params.template || 'json',
      tmpl = templates[tmplName];
  assert(tmpl, 'json2fontcss template "' + tmplName + '" could not be found.');

  // Grab specific properties from params
  params = _.pick(params, 'chars', 'fonts', 'fontFamily', 'options');

  // Fallback font family
  params.fontFamily = params.fontFamily || '"icon-font"';

  // Render and return the CSS
  return tmpl(params);
}

// Expose templates
json2fontcss.templates = templates;
json2fontcss.addTemplate = addTemplate;
json2fontcss.addMustacheTemplate = addMustacheTemplate;

// Expose json2fontcss
module.exports = json2fontcss;
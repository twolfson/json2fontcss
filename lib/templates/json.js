module.exports = function jsonTemplate(params) {
  // Break linkages to external references
  params = JSON.parse(JSON.stringify(params));

  // Save font-family to each character as with other engines
  var chars = params.chars,
      fontFamily = params.fontFamily;
  chars.forEach(function (character) {
    character.fontFamily = fontFamily;
  });


  // Stringify and return our params
  return JSON.stringify(params, null, 4);
};
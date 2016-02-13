// Postcss helper functions using JS

// global project font size set to 16px for now
var font_size = 16

// Functions object to export
module.exports = {
  // function to convert to ems
  // usage, 'width: ems(700px);'
  ems: function (v) {
    // strip unit value, eg "px"
    v = v.replace(/\D/g, '')
    // return value
    return v / font_size + 'em'
  },
  feach: function (o) {
    for (var name in o) {
      var value = o[name]
      return value + ': ' + name
    }
  }
}

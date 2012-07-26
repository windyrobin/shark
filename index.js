/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */

"use strict";

var shark = {};

require('fs').readdirSync(__dirname + '/lib').forEach(function (item) {
  var m = item.match(/(.+?)\.js$/);
  if (m && m[1]) {
    shark[m[1]] = require(__dirname + '/lib/' + m[0]);
  }
});

module.exports = shark;

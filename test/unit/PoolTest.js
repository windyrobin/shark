/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */
// +--------------------------------------------------------------------+
// | (C) 2011-2012 Alibaba Group Holding Limited.                       |
// | This program is free software; you can redistribute it and/or      |
// | modify it under the terms of the GNU General Public License        |
// | version 2 as published by the Free Software Foundation.            |
// +--------------------------------------------------------------------+
// Author: pengchun <pengchun@taobao.com>

var should  = require('should');
var Pool    = require(__dirname + '/../../lib/pool.js');

describe('connection pool', function() {

  var connector = function() {
    return {
      'query' : function(callback) {
        setTimeout(callback, 2);
      },
  'close'   : function() {
  },
    }
  };

  /* {{{ should_pool_create_and_idle_works_fine() */
  it('should_pool_create_and_idle_works_fine', function(done) {
    var num = 6;
    var _me = Pool.create(connector, {
      'idle' : 100, 'size' : 4,
    });

    var beg = (new Date()).getTime();
    var ids = [];
    for (var i = 0; i < num; i++) {
      _me.get(function(who, id) {
        ids.push(id);
        who.query(function() {
          _me.free(id);
          if ((--num) == 0) {
            ids.should.eql([0,1,2,3,3,2]);
            setTimeout(function() {
              _me.get(function(who, id) {
                // XXX: 空闲超过100ms，断开重连
                id.should.eql(0);
                done();
              });
            }, 110);
          }
        });
      });
    }
  });
  /* }}} */

});

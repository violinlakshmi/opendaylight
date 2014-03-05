/*
 * Copyright (c) 2013 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

//PAGE Devices
requirejs.config({
  paths : {
    fuelux : 'fuelux/',
    devices : '../controller/web/devices/js'
  }
});

require([ 'global', 'datasource', 'devices/nodeslearnt', 'devices/staticroute', 'devices/subnetgateway',
    'devices/spanport', 'devices/connection', 'underscore', 'fuelux/loader.min', 'lib' ], function(one,
    StaticDataSource, nodeslearnt, staticRouteConfig, subnetGatewayConfig, spanPortConfig, connection) {
  one.f = {};
  // specify dashlets and layouts
  one.f.dashlet = {
    nodesLearnt : {
      id : 'nodesLearnt',
      name : 'Nodes Learned'
    },
    staticRouteConfig : {
      id : 'staticRouteConfig',
      name : 'Static Route Configuration'
    },
    subnetGatewayConfig : {
      id : 'subnetGatewayConfig',
      name : 'Subnet Gateway Configuration'
    },
    spanPortConfig : {
      id : 'spanPortConfig',
      name : 'SPAN Port Configuration'
    },
    connection : {
      id : 'connection',
      name : 'Connection Manager'
    }
  };

  one.f.menu = {
    left : {
      top : [ one.f.dashlet.nodesLearnt ],
      bottom : [ one.f.dashlet.staticRouteConfig, one.f.dashlet.connection ]
    },
    right : {
      top : [],
      bottom : [ one.f.dashlet.subnetGatewayConfig, one.f.dashlet.spanPortConfig ]
    }
  };

  /** Devices Modules */
  one.f.switchmanager = {
    rootUrl : "controller/web/devices",
    createTable : function(columnNames, body) {
      var tableAttributes = [ "table-striped", "table-bordered", "table-condensed" ];
      var $table = one.lib.dashlet.table.table(tableAttributes);
      var tableHeaders = columnNames;
      var $thead = one.lib.dashlet.table.header(tableHeaders);
      var $tbody = one.lib.dashlet.table.body(body, tableHeaders);
      $table.append($thead).append($tbody);
      return $table;
    },
    validateName : function(name) {
      return (name.length < 256);
    }
  };

  one.f.switchmanager.nodesLearnt = nodeslearnt;
  one.f.switchmanager.subnetGatewayConfig = subnetGatewayConfig;
  one.f.switchmanager.staticRouteConfig = staticRouteConfig;
  one.f.switchmanager.spanPortConfig = spanPortConfig;
  one.f.connection = connection;

  /** INIT **/
  // populate nav tabs
  $(one.f.menu.left.top).each(function(index, value) {
    var $nav = $(".nav", "#left-top");
    one.main.page.dashlet($nav, value);
  });

  $(one.f.menu.left.bottom).each(function(index, value) {
    var $nav = $(".nav", "#left-bottom");
    one.main.page.dashlet($nav, value);
  });

  $(one.f.menu.right.bottom).each(function(index, value) {
    var $nav = $(".nav", "#right-bottom");
    one.main.page.dashlet($nav, value);
  });

  //      one.f.addPopOut = function() {
  //        $img1 = $(document.createElement("img"));
  //        $img1.attr("src", "/img/Expand16T.png");
  //        $img1.attr("style", "float: right;");
  //        $img1.hover(function() {
  //          $img1.css("cursor", "pointer");
  //        });
  //        $img1.click(function() {
  //          var $modal = one.f.switchmanager.nodesLearnt.modal.initialize.popout();
  //          $modal.css({
  //            'margin-left' : '-45%',
  //            'margin-top' : '-3%',
  //            'width' : $(document).width() * 0.8,
  //            'height' : $(document).height() * 0.9
  //          });
  //          $(".modal-body", $modal).css({
  //            "max-height" : $(document).height() * 0.75,
  //          });
  //          $modal.modal();
  //        });
  //        $dash1 = $($("#left-top .nav")[0]);
  //        $dash1.append($img1);
  //      };
  //      one.f.addPopOut();

  // bind dashlet nav
  $('.dash .nav a', '#main').click(function() {
    // de/activation
    var $li = $(this).parent();
    var $ul = $li.parent();
    one.lib.nav.unfocus($ul);
    $li.addClass('active');
    // clear respective dashlet
    var $dashlet = $ul.parent().find('.dashlet');
    one.lib.dashlet.empty($dashlet);

    // callback based on menu
    var id = $(this).attr('id');
    var menu = one.f.dashlet;
    switch (id) {
    case menu.nodesLearnt.id:
      one.f.switchmanager.nodesLearnt.dashlet($dashlet);
      break;
    case menu.staticRouteConfig.id:
      one.f.switchmanager.staticRouteConfig.dashlet($dashlet);
      break;
    case menu.subnetGatewayConfig.id:
      one.f.switchmanager.subnetGatewayConfig.dashlet($dashlet);
      break;
    case menu.spanPortConfig.id:
      one.f.switchmanager.spanPortConfig.dashlet($dashlet);
      break;
    case menu.connection.id:
      one.f.connection.dashlet($dashlet);
      break;
    }
    ;
  });

  // activate first tab on each dashlet
  $('.dash .nav').each(function(index, value) {
    $($(value).find('li')[0]).find('a').click();
  });
}); // require function ends

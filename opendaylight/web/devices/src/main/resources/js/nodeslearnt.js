define(['datasource'], function(StaticDataSource) {

var module_nodesLearnt = {
  id : {
    dashlet : {
      popout : "one_f_switchmanager_nodesLearnt_id_dashlet_popout",
      datagrid : "one_f_switchmanager_nodesLearnt_id_dashlet_datagrid"
    },
    modal : {
      modal : "one_f_switchmanager_nodesLearnt_id_modal_modal",
      configure : "one_f_switchmanager_nodesLearnt_id_modal_configure",
      ports : "one_f_switchmanager_nodesLearnt_id_modal_ports",
      save : "one_f_switchmanager_nodesLearnt_id_modal_save",
      datagrid : "one_f_switchmanager_nodesLearnt_id_modal_datagrid",
      portsDatagrid : "one_f_switchmanager_nodesLearnt_id_modal_portsDatagrid",
      form : {
        nodeId : "one_f_switchmanager_nodesLearnt_id_modal_form_nodeid",
        nodeName : "one_f_switchmanager_nodesLearnt_id_modal_form_nodename",
        portStatus : "one_f_switchmanager_nodesLearnt_id_modal_form_portstatus",
        tier : "one_f_switchmanager_nodesLearnt_id_modal_form_tier",
        operationMode : "one_f_switchmanager_nodesLearnt_id_modal_form_opmode"
      }
    }
  },
  dashlet : function($dashlet) {
    var url = one.f.switchmanager.rootUrl + "/nodesLearnt";
    one.lib.dashlet.empty($dashlet);
    $dashlet.append(one.lib.dashlet.header(one.f.dashlet.nodesLearnt.name));

    one.f.switchmanager.nodesLearnt.ajax.main(url, function(content) {
      var $gridHTML = one.lib.dashlet.datagrid.init(
          one.f.switchmanager.nodesLearnt.id.dashlet.datagrid, {
            searchable : true,
            filterable : false,
            pagination : true,
            flexibleRowsPerPage : true
          }, "table-striped table-condensed");
      $dashlet.append($gridHTML);
      var dataSource = one.f.switchmanager.nodesLearnt.data.gridDataSource.abridged(content);
      $("#" + one.f.switchmanager.nodesLearnt.id.dashlet.datagrid).datagrid({
        dataSource : dataSource
      }).on("loaded", function() {
        $(this).find("tbody a").click(one.f.switchmanager.nodesLearnt.modal.initialize.updateNode);
      });

      $("#" + one.f.switchmanager.nodesLearnt.id.dashlet.datagrid).datagrid({
        dataSource : dataSource
      }).on("loaded", function() {
        $(this).find("tbody span").click(function() {
          one.f.switchmanager.nodesLearnt.modal.initialize.displayPorts($(this));
        });
      });

    });
  },
  ajax : {
    main : function(url, callback) {
      $.getJSON(url, function(data) {
        callback(data);
      });
    }
  },
  modal : {
    registry : {
      callback : undefined
    },
    initialize : {
      updateNode : function(evt) {
        one.f.switchmanager.nodesLearnt.ajax.main(one.f.switchmanager.rootUrl + "/tiers", function(
            tiers) {

          var nodeId = decodeURIComponent(evt.target.id);
          var h3;
          var footer = [];
          var $body = one.f.switchmanager.nodesLearnt.modal.body.updateNode(nodeId, JSON
              .parse(decodeURIComponent(evt.target.getAttribute("switchDetails"))), tiers);
          if (evt.target.getAttribute("privilege") == 'WRITE') {
            h3 = "Update Node Information";
            footer = one.f.switchmanager.nodesLearnt.modal.footer.updateNode();
          } else { // disable node edit
            $body.find('*').attr('disabled', 'disabled');
            h3 = 'Node Information';
          }

          var $modal = one.lib.modal.spawn(one.f.switchmanager.nodesLearnt.id.modal.configure, h3,
              "", footer);
          // bind save button
          $('#' + one.f.switchmanager.nodesLearnt.id.modal.save, $modal).click(function() {
            one.f.switchmanager.nodesLearnt.modal.save($modal);
          });

          // inject body (nodePorts)
          one.lib.modal.inject.body($modal, $body);

          $modal.modal().on("shown", function() {
            var callback = one.f.switchmanager.nodesLearnt.modal.registry.callback;
            if (callback !== undefined && $.isFunction(callback)) {
              callback();
            }
          });
        });
      },
      popout : function() {
        var h3 = "Nodes Learned";
        var footer = one.f.switchmanager.nodesLearnt.modal.footer.popout();
        var $modal = one.lib.modal.spawn(one.f.switchmanager.nodesLearnt.id.modal.modal, h3, "",
            footer);
        var $body = one.f.switchmanager.nodesLearnt.modal.body.popout($modal);
        return $modal;
      },
      displayPorts : function(ports) {
        var content = JSON.parse(decodeURIComponent(ports.attr("ports")));

        var h3 = ((ports.attr("nodeName") == "None") ? ports.attr("nodeId") : ports
            .attr("nodeName"))
        var footer = [];
        var $modal = one.lib.modal.spawn(one.f.switchmanager.nodesLearnt.id.modal.ports, h3, "",
            footer);

        var $gridHTML = one.lib.dashlet.datagrid.init(
            one.f.switchmanager.nodesLearnt.id.modal.portsDatagrid, {
              searchable : true,
              filterable : false,
              pagination : true,
              flexibleRowsPerPage : true,
              popout : true
            }, "table-striped table-condensed");
        one.lib.modal.inject.body($modal, $gridHTML);
        $modal.on("shown", function() {
          var dataSource = one.f.switchmanager.nodesLearnt.data.gridDataSource
              .displayPorts(content);
          $("#" + one.f.switchmanager.nodesLearnt.id.modal.portsDatagrid).datagrid({
            dataSource : dataSource,
            stretchHeight : false
          });
        });
        $modal.modal();
      }
    },
    body : {
      updateNode : function(nodeId, switchDetails, tiers) {
        var $form = $(document.createElement('form'));
        var $fieldset = $(document.createElement('fieldset'));
        // node ID. not editable.
        var $label = one.lib.form.label("Node ID");
        var $input = one.lib.form.input("node id");
        $input.attr('id', one.f.switchmanager.nodesLearnt.id.modal.form.nodeId);
        $input.attr("disabled", true);
        $input.attr("value", nodeId);
        $fieldset.append($label).append($input);
        // node name
        var $label = one.lib.form.label("Node Name");
        var $input = one.lib.form.input("Node Name");
        $input.attr('id', one.f.switchmanager.nodesLearnt.id.modal.form.nodeName);
        if (switchDetails["nodeName"] != null) {
          $input.attr('value', switchDetails["nodeName"]);
        }
        $fieldset.append($label).append($input);
        // node tier
        var $label = one.lib.form.label("Tier");
        var $select = one.lib.form.select.create(tiers);
        $select.attr('id', one.f.switchmanager.nodesLearnt.id.modal.form.tier);
        $select.val(switchDetails["tier"]);
        $fieldset.append($label).append($select);
        // operation mode
        var $label = one.lib.form.label("Operation Mode");
        var $select = one.lib.form.select.create([ "Allow reactive forwarding",
            "Proactive forwarding only" ]);
        $select.attr('id', one.f.switchmanager.nodesLearnt.id.modal.form.operationMode);
        if ((one.main.registry != undefined) && (one.main.registry.container != 'default')) {
          $select.attr("disabled", true);
        }
        $select.val(switchDetails["mode"]);
        $fieldset.append($label).append($select);
        $form.append($fieldset);
        return $form;
      },
      popout : function($modal) {
        var $gridHTML = one.lib.dashlet.datagrid.init(
            one.f.switchmanager.nodesLearnt.id.modal.datagrid, {
              searchable : true,
              filterable : false,
              pagination : true,
              flexibleRowsPerPage : true,
              popout : true
            }, "table-striped table-condensed");
        one.lib.modal.inject.body($modal, $gridHTML);
        // attach to shown event of modal
        $modal.on("shown", function() {
          var url = one.f.switchmanager.rootUrl + "/nodesLearnt";
          one.f.switchmanager.nodesLearnt.ajax.main(url, function(content) {
            var dataSource = one.f.switchmanager.nodesLearnt.data.gridDataSource.popout(content);
            $("#" + one.f.switchmanager.nodesLearnt.id.modal.datagrid).datagrid({
              dataSource : dataSource,
              stretchHeight : false
            }).on(
                "loaded",
                function() {
                  $("#" + one.f.switchmanager.nodesLearnt.id.modal.datagrid).find("tbody span")
                      .click(function() {
                        one.f.switchmanager.nodesLearnt.modal.initialize.displayPorts($(this));
                      });
                });
          });
        });
      }
    },
    save : function($modal) {
      var result = {};
      result['nodeName'] = $('#' + one.f.switchmanager.nodesLearnt.id.modal.form.nodeName, $modal)
          .val();
      if (!one.f.switchmanager.validateName(result['nodeName'])) {
        alert("Node name can contain upto 255 characters");
        return;
      }
      result['nodeId'] = $('#' + one.f.switchmanager.nodesLearnt.id.modal.form.nodeId, $modal)
          .val();
      result['tier'] = $('#' + one.f.switchmanager.nodesLearnt.id.modal.form.tier, $modal).val();
      result['operationMode'] = $(
          '#' + one.f.switchmanager.nodesLearnt.id.modal.form.operationMode, $modal).val();
      one.f.switchmanager.nodesLearnt.modal.ajax(result, function(response) {
        if (response.status == true) {
          $modal.modal('hide');
          one.topology.update(); // refresh visual topology with new name
          // TODO: Identify dashlet by inserting a nodesLearnt div
          // in the dashlet() instead
          one.f.switchmanager.nodesLearnt.dashlet($("#left-top .dashlet"));
        } else {
          alert(response.message);
        }

      });
    },
    ajax : function(requestData, callback) {
      $.getJSON(one.f.switchmanager.rootUrl + "/nodesLearnt/update", requestData,
          function(response) {
            callback(response);
          });
    },
    footer : {
      updateNode : function() {
        var footer = [];
        var saveButton = one.lib.dashlet.button.single("Save",
            one.f.switchmanager.nodesLearnt.id.modal.save, "btn-primary", "");
        var $saveButton = one.lib.dashlet.button.button(saveButton);
        footer.push($saveButton);

        return footer;
      },
      popout : function() {
        // TODO: Maybe put a close button in the footer?
        return [];
      }
    }
  },
  // data functions
  data : {
    gridDataSource : {
      abridged : function(data) {
        var source = new StaticDataSource({
          columns : [ {
            property : 'nodeName',
            label : 'Node Name',
            sortable : true
          }, {
            property : 'nodeId',
            label : 'Node ID',
            sortable : true
          }, {
            property : 'ports',
            label : 'Ports',
            sortable : true
          } ],
          data : data.nodeData,
          formatter : function(items) {
            $.each(items, function(index, item) {
              var nodeName = item.nodeName;
              var nodeNameEntry = item.nodeName ? item.nodeName : "Click to update";
              item.nodeName = '<a href="#" id="' + item.nodeId + '" switchDetails='
                  + encodeURIComponent(JSON.stringify(item)) + ' privilege=' + data.privilege + '>'
                  + nodeNameEntry + '</a>';

              var ports = item.ports;
              var portsMatch = ports.match(/<\/span>/g);
              var portsLength = 0;
              if (portsMatch != null) {
                portsLength = portsMatch.length;
              }
              item.ports = '<span class="nodePorts" style="cursor:pointer;color: #08c" ports='
                  + encodeURIComponent(JSON.stringify(item.ports)) + ' nodeId="' + item.nodeId
                  + '" nodeName="' + nodeName + '">' + portsLength + '</span>';
            });
          },
          delay : 0
        });
        return source;

      },
      popout : function(data) {
        var source = new StaticDataSource({
          columns : [ {
            property : 'nodeName',
            label : 'Node Name',
            sortable : true
          }, {
            property : 'nodeId',
            label : 'Node ID',
            sortable : true
          }, {
            property : 'tierName',
            label : 'Tier Name',
            sortable : true
          }, {
            property : 'mac',
            label : 'MAC Address',
            sortable : true
          }, {
            property : 'ports',
            label : 'Ports',
            sortable : true
          } ],
          data : data.nodeData,
          formatter : function(items) {
            $.each(items, function(index, item) {
              var ports = item.ports;
              var portsMatch = ports.match(/<\/span>/g);
              var portsLength = 0;
              if (portsMatch != null) {
                portsLength = portsMatch.length;
              }
              item.ports = '<span class="nodePorts" style="cursor: pointer;color: #08c" ports='
                  + encodeURIComponent(JSON.stringify(item.ports)) + ' nodeId="' + item.nodeId
                  + '" nodeName="' + item.nodeName + '">' + portsLength + '</span>';
            });
          },
          delay : 0
        });
        return source;
      },
      displayPorts : function(content) {
        var data = [];
        var start = 0;
        ;
        var finish = content.indexOf("<br>", start);
        while (finish != -1) {
          data.push({
            "ports" : content.substring(start, finish)
          });
          start = finish + 4
          finish = content.indexOf("<br>", start);
        }
        var source = new StaticDataSource({
          columns : [ {
            property : 'ports',
            label : 'Ports',
            sortable : true
          } ],
          data : data,
          delay : 0
        });

        return source;
      }
    },
    abridged : function(data) {
      var result = [];
      $.each(data.nodeData,
          function(key, value) {
            var tr = {};
            var entry = [];
            var nodeNameEntry = value["nodeName"] ? value["nodeName"] : "Click to update";

            // TODO: Move anchor tag creation to one.lib.form.
            var aTag;
            aTag = document.createElement("a");
            aTag.privilege = data.privilege;
            aTag.addEventListener("click",
                one.f.switchmanager.nodesLearnt.modal.initialize.updateNode);
            aTag.addEventListener("mouseover", function(evt) {
              evt.target.style.cursor = "pointer";
            }, false);
            aTag.setAttribute("id", encodeURIComponent(value["nodeId"]));
            aTag.switchDetails = value;
            aTag.innerHTML = nodeNameEntry;
            entry.push(aTag);
            entry.push(value["nodeId"]);
            entry.push(value["ports"]);
            tr.entry = entry;
            result.push(tr);
          });
      return result;
    },
    popout : function(data) {
      var result = [];
      $.each(data.nodeData, function(key, value) {
        var tr = {};
        // fill up all the td's
        var entry = [];
        var nodenameentry = value["nodeName"] ? value["nodeName"] : "No name provided";
        entry.push(nodenameentry);
        entry.push(value["nodeId"]);
        entry.push(value["tierName"]);
        entry.push(value["mac"]);
        entry.push(value["ports"]);
        tr.entry = entry;
        result.push(tr);
      });
      return result;
    }
  }
};  // end one.f.switchManager.nodesLearnt

return module_nodesLearnt;

});  // end anonymouse function

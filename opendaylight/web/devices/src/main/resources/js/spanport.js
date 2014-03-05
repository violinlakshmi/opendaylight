define(['global', 'datasource' ], function(one, StaticDataSource) {
  var spanPort = {
    id : {
      dashlet : {
        add : "one_f_switchmanager_spanPortConfig_id_dashlet_add",
        remove : "one_f_switchmanager_spanPortConfig_id_dashlet_remove",
        datagrid : "one_f_switchmanager_spanPortConfig_id_dashlet_datagrid",
        selectAllFlows : "one_f_switchmanager_spanPortConfig_id_dashlet_selectAllFlows"
      },
      modal : {
        modal : "one_f_switchmanager_spanPortConfig_id_modal_modal",
        save : "one_f_switchmanager_spanPortConfig_id_modal_save",
        cancel : "one_f_switchmanager_spanPortConfig_id_modal_cancel",
        remove : "one_f_switchmanager_spanPortConfig_id_modal_remove",
        form : {
          name : "one_f_switchmanager_spanPortConfig_id_modal_form_name",
          nodes : "one_f_switchmanager_spanPortConfig_id_modal_form_nodes",
          port : "one_f_switchmanager_spanPortConfig_id_modal_form_port",
        }
      }
    },
    dashlet : function($dashlet) {
      one.lib.dashlet.empty($dashlet);

      // populate table in dashlet
      var url = one.f.switchmanager.rootUrl + "/spanPorts";
      one.f.switchmanager.spanPortConfig.ajax.main(url, {}, function(content) {

        if (content.privilege === 'WRITE') {

          // Add span port button
          var button = one.lib.dashlet.button.single("Add SPAN Port",
              one.f.switchmanager.spanPortConfig.id.dashlet.add, "btn-primary", "btn-mini");
          var $button = one.lib.dashlet.button.button(button);

          $button.click(function() {
            var $modal = one.f.switchmanager.spanPortConfig.modal.initialize();
            $modal.modal();
          });
          $dashlet.append(one.lib.dashlet.header(one.f.dashlet.spanPortConfig.name));
          $dashlet.append($button);

          // Delete span port button
          var button = one.lib.dashlet.button.single("Remove SPAN Port",
              one.f.switchmanager.spanPortConfig.id.dashlet.remove, "btn-danger", "btn-mini");
          var $button = one.lib.dashlet.button.button(button);
          $button.click(function() {
            var spanPortsToDelete = [];
            var checkedCheckBoxes = $("#" + one.f.switchmanager.spanPortConfig.id.dashlet.datagrid).find(
                "tbody input:checked");

            if (checkedCheckBoxes.size() === 0) {
              return false;
            }
            checkedCheckBoxes.each(function(index, value) {
              var spanPortObj = {};
              spanPortObj['spanPortJson'] = decodeURIComponent(checkedCheckBoxes[index].getAttribute("spanPort"));
              spanPortObj['spanPortNodeName'] = checkedCheckBoxes[index].getAttribute("spanPortNode");
              spanPortObj['spanPortPortName'] = checkedCheckBoxes[index].getAttribute("spanPortPort");

              spanPortsToDelete.push(spanPortObj);
            });
            one.f.switchmanager.spanPortConfig.modal.removeMultiple.dialog(spanPortsToDelete);
          });
          $dashlet.append($button);
        }
        var $gridHTML = one.lib.dashlet.datagrid.init(one.f.switchmanager.spanPortConfig.id.dashlet.datagrid, {
          searchable : true,
          filterable : false,
          pagination : true,
          flexibleRowsPerPage : true
        }, "table-striped table-condensed");
        $dashlet.append($gridHTML);
        var dataSource = one.f.switchmanager.spanPortConfig.data.spanPortConfigGrid(content);
        $("#" + one.f.switchmanager.spanPortConfig.id.dashlet.datagrid).datagrid({
          dataSource : dataSource
        }).on(
            "loaded",
            function() {
              $("#" + one.f.switchmanager.spanPortConfig.id.dashlet.selectAll).click(
                  function() {
                    $("#" + one.f.switchmanager.spanPortConfig.id.dashlet.datagrid).find(':checkbox').prop('checked',
                        $("#" + one.f.switchmanager.spanPortConfig.id.dashlet.selectAll).is(':checked'));
                  });
              $(".spanPortConfig").click(function(e) {
                if (!$('.spanPortConfig[type=checkbox]:not(:checked)').length) {
                  $("#" + one.f.switchmanager.spanPortConfig.id.dashlet.selectAll).prop("checked", true);
                } else {
                  $("#" + one.f.switchmanager.spanPortConfig.id.dashlet.selectAll).prop("checked", false);
                }
                e.stopPropagation();
              });
            });
      });
    },
    // device ajax calls
    ajax : {
      main : function(url, requestData, callback) {
        $.getJSON(url, requestData, function(data) {
          callback(data);
        });
      }
    },
    registry : {},
    modal : {
      initialize : function() {
        var h3 = "Add SPAN Port";
        var footer = one.f.switchmanager.spanPortConfig.modal.footer();
        var $modal = one.lib.modal.spawn(one.f.switchmanager.spanPortConfig.id.modal.modal, h3, "", footer);
        // bind save button
        $('#' + one.f.switchmanager.spanPortConfig.id.modal.save, $modal).click(function() {
          one.f.switchmanager.spanPortConfig.modal.save($modal);
        });

        one.f.switchmanager.spanPortConfig.modal.ajax.nodes(function(nodes, nodeports) {
          var $body = one.f.switchmanager.spanPortConfig.modal.body(nodes, nodeports);
          one.lib.modal.inject.body($modal, $body);
        });
        return $modal;
      },
      save : function($modal) {
        var result = {};
        result['nodeId'] = $('#' + one.f.switchmanager.spanPortConfig.id.modal.form.nodes, $modal).val();
        result['spanPort'] = $('#' + one.f.switchmanager.spanPortConfig.id.modal.form.port, $modal).val();
        one.f.switchmanager.spanPortConfig.modal.ajax.saveSpanPortConfig(result, function(response) {
          if (response.status == true) {
            $modal.modal('hide');
            one.f.switchmanager.spanPortConfig.dashlet($("#right-bottom .dashlet"));
          } else {
            alert(response.message);
          }

        });
      },
      body : function(nodes, nodeports) {
        var $form = $(document.createElement('form'));
        var $fieldset = $(document.createElement('fieldset'));
        // node
        var $label = one.lib.form.label("Node");
        var $select = one.lib.form.select.create(nodes);
        one.lib.form.select.prepend($select, {
          '' : 'Please Select a Node'
        });
        $select.val($select.find("option:first").val());
        $select.attr('id', one.f.switchmanager.spanPortConfig.id.modal.form.nodes);

        // bind onchange
        $select.change(function() {
          // retrieve port value
          var nodeId = $(this).find('option:selected').attr('value');
          one.f.switchmanager.spanPortConfig.registry['currentNode'] = nodeId;
          var $ports = $('#' + one.f.switchmanager.spanPortConfig.id.modal.form.port);
          var ports = one.f.switchmanager.spanPortConfig.registry['nodePorts'][nodeId]
          var options = {};
          $(ports).each(function(idx, val) {
            options[val.internalPortName] = val.portName + ' (' + val.portId + ')';
          });
          one.lib.form.select.inject($ports, options);
          one.lib.form.select.prepend($ports, {
            '' : 'Please Select a Port'
          });
          $ports.val($ports.find('option:first').val());
        });

        $fieldset.append($label).append($select);
        // input port
        var $label = one.lib.form.label("Port");
        var $select = one.lib.form.select.create();
        one.lib.form.select.prepend($select, {
          '' : 'None'
        });
        $select.attr('id', one.f.switchmanager.spanPortConfig.id.modal.form.port);
        $select.val($select.find('option:first').val());
        $fieldset.append($label).append($select);

        // return
        $form.append($fieldset);
        return $form;
      },
      ajax : {
        nodes : function(callback) {
          $.getJSON(one.f.switchmanager.rootUrl + "/nodeports", function(data) {
            var nodes = {};
            var nodePorts = {};
            $(data).each(function(index, node) {
              nodes[node.nodeId] = node.nodeName;
              nodePorts[node.nodeId] = node.nodePorts;
            });
            one.f.switchmanager.spanPortConfig.registry['nodePorts'] = nodePorts;
            callback(nodes, nodePorts);
          });
        },
        saveSpanPortConfig : function(requestData, callback) {
          var resource = {};
          resource["jsonData"] = JSON.stringify(requestData);
          $.getJSON(one.f.switchmanager.rootUrl + "/spanPorts/add", resource, function(data) {
            callback(data);
          });
        }
      },
      footer : function() {
        var footer = [];
        var saveButton = one.lib.dashlet.button.single("Save", one.f.switchmanager.spanPortConfig.id.modal.save,
            "btn-primary", "");
        var $saveButton = one.lib.dashlet.button.button(saveButton);
        footer.push($saveButton);
        return footer;
      },
      removeMultiple : {
        dialog : function(spanPortsToDelete) {
          var h3 = 'Remove SPAN Port';

          var footer = one.f.switchmanager.spanPortConfig.modal.removeMultiple.footer();
          var $body = one.f.switchmanager.spanPortConfig.modal.removeMultiple.body(spanPortsToDelete);
          var $modal = one.lib.modal.spawn(one.f.switchmanager.spanPortConfig.id.modal.modal, h3, $body, footer);

          // bind close button
          $('#' + one.f.switchmanager.spanPortConfig.id.modal.cancel, $modal).click(function() {
            $modal.modal('hide');
          });

          // bind remove rule button
          $('#' + one.f.switchmanager.spanPortConfig.id.modal.remove, $modal).click(this, function(e) {
            var requestData = {};
            var spanPorts = [];
            $(spanPortsToDelete).each(function(index, spanPort) {
              spanPorts.push(JSON.parse(spanPort.spanPortJson));
            });
            requestData["spanPortsToDelete"] = JSON.stringify(spanPorts);

            var url = one.f.switchmanager.rootUrl + "/spanPorts/delete";
            one.f.switchmanager.spanPortConfig.ajax.main(url, requestData, function(response) {
              $modal.modal('hide');
              if (response.status == true) {
                // refresh dashlet by passing dashlet div as param
                one.lib.alert("Span Port(s) successfully removed");
              } else {
                alert(response.message);
              }
              one.f.switchmanager.spanPortConfig.dashlet($("#right-bottom .dashlet"));
            });
          });
          $modal.modal();
        },
        footer : function() {
          var footer = [];
          var remove = one.lib.dashlet.button.single('Remove SPAN Port',
              one.f.switchmanager.spanPortConfig.id.modal.remove, 'btn-danger', '');
          var $remove = one.lib.dashlet.button.button(remove);
          footer.push($remove);

          var cancel = one.lib.dashlet.button.single('Cancel', one.f.switchmanager.spanPortConfig.id.modal.cancel, '',
              '');
          var $cancel = one.lib.dashlet.button.button(cancel);
          footer.push($cancel);

          return footer;
        },
        body : function(spanPortToDelete) {
          var $p = $(document.createElement('p'));
          var p = 'Remove the following Span Port(s)?';
          // creata a BS label for each rule and append to list

          $(spanPortToDelete).each(function(index, spanPortItem) {
            var $span = $(document.createElement('span'));
            $span.append(this.spanPortNodeName + "-" + this.spanPortPortName);
            p += '<br/>' + $span[0].outerHTML;
          });
          $p.append(p);
          return $p;
        }
      }
    },
    // data functions
    data : {
      spanPortConfigGrid : function(data) {
        var source = new StaticDataSource({
          columns : [ {
            property : 'selector',
            label : "<input type='checkbox'  id='" + one.f.switchmanager.spanPortConfig.id.dashlet.selectAll + "'/>",
            sortable : false
          }, {
            property : 'nodeName',
            label : 'Node',
            sortable : true
          }, {
            property : 'spanPortName',
            label : 'SPAN Port',
            sortable : true
          }, ],
          data : data.nodeData,
          formatter : function(items) {
            $.each(items, function(index, item) {
              item["selector"] = '<input type="checkbox" class="spanPortConfig" spanPort='
                  + encodeURIComponent(item["json"]) + ' spanPortNode="' + item["nodeName"] + '" spanPortPort="'
                  + item["spanPortName"] + '"></input>';
            });
          },
          delay : 0
        });
        return source;
      },
      devices : function(data) {
        var result = [];
        $.each(data.nodeData, function(key, value) {
          var tr = {};
          // fill up all the td's
          var entry = [];
          var checkbox = document.createElement("input");
          checkbox.setAttribute("type", "checkbox");
          checkbox.spanPort = value.json;
          entry.push(checkbox);
          entry.push(value["nodeName"]);
          entry.push(value["spanPort"]);
          tr.entry = entry;
          result.push(tr);
        });
        return result;
      }
    }
  } // end spanPort module
  return spanPort;
}); // end define function

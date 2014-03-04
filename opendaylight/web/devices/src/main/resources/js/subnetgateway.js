define(['datasource'], function(StaticDataSource) {

// Subnetgateway code goes here.
    var module_subnetGatewayConfig = {
        id : {
          dashlet : {
            addIPAddress : "one_f_switchmanager_subnetGatewayConfig_id_dashlet_addIP",
            addPorts : "one_f_switchmanager_subnetGatewayConfig_id_dashlet_addPorts",
            removeIPAddress : "one_f_switchmanager_subnetGatewayConfig_id_dashlet_removeIP",
            datagrid : "one_f_switchmanager_subnetGatewayConfig_id_dashlet_datagrid",
            selectAll : "one_f_switchmanager_subnetGatewayConfig_id_dashlet_selectAll"
          },
          modal : {
            modal : "one_f_switchmanager_subnetGatewayConfig_id_modal_modal",
            ports : "one_f_switchmanager_subnetGatewayConfig_id_modal_ports",
            save : "one_f_switchmanager_subnetGatewayConfig_id_modal_save",
            remove : "one_f_switchmanager_subnetGatewayConfig_id_modal_remove",
            cancel : "one_f_switchmanager_subnetGatewayConfig_id_modal_cancel",
            form : {
              name : "one_f_switchmanager_subnetGatewayConfig_id_modal_form_gatewayname",
              gatewayIPAddress : "one_f_switchmanager_subnetGatewayConfig_id_modal_form_gatewayipaddress",
              nodeId : "one_f_switchmanager_subnetGatewayConfig_id_modal_form_nodeid",
              ports : "one_f_switchmanager_subnetGatewayConfig_id_modal_form_ports"
            }
          }
        },
        // device ajax calls
        dashlet : function($dashlet) {
          one.lib.dashlet.empty($dashlet);
          $dashlet.append(one.lib.dashlet.header(one.f.dashlet.subnetGatewayConfig.name));
          // Add gateway IP Address button
          var url = one.f.switchmanager.rootUrl + "/subnets";
          one.f.switchmanager.subnetGatewayConfig.ajax.main(url, {},
              function(content) {

                if (content.privilege === 'WRITE') {
                  var button = one.lib.dashlet.button.single("Add Gateway IP Address",
                      one.f.switchmanager.subnetGatewayConfig.id.dashlet.addIPAddress, "btn-primary",
                      "btn-mini");
                  var $button = one.lib.dashlet.button.button(button);
                  $button.click(function() {
                    var $modal = one.f.switchmanager.subnetGatewayConfig.modal.initialize.gateway();
                    $modal.modal();
                  });
                  $dashlet.append($button);

                  // Delete gateway ip address button
                  var button = one.lib.dashlet.button.single("Remove Gateway IP Address",
                      one.f.switchmanager.subnetGatewayConfig.id.dashlet.removeIPAddress, "btn-danger",
                      "btn-mini");
                  var $button = one.lib.dashlet.button.button(button);
                  $button.click(function() {
                    var gatewaysToDelete = [];
                    var checkedCheckBoxes = $(
                        "#" + one.f.switchmanager.subnetGatewayConfig.id.dashlet.datagrid).find(
                        "tbody input:checked")
                    checkedCheckBoxes.each(function(index, value) {
                      gatewaysToDelete.push(checkedCheckBoxes[index].id);
                    });
                    if (checkedCheckBoxes.size() === 0) {
                      return false;
                    }
                    one.f.switchmanager.subnetGatewayConfig.modal.removeMultiple.dialog(gatewaysToDelete)
                  });
                  $dashlet.append($button);

                  // Add Ports button
                  var button = one.lib.dashlet.button.single("Add Ports",
                      one.f.switchmanager.subnetGatewayConfig.id.dashlet.addPorts, "btn-primary",
                      "btn-mini");
                  var $button = one.lib.dashlet.button.button(button);
                  $button.click(function() {
                    if (one.f.switchmanager.subnetGatewayConfig.registry.gateways.length === 0) {
                      alert('No Gateways Exist');
                      return false;
                    }
                    var $modal = one.f.switchmanager.subnetGatewayConfig.modal.initialize.ports();
                    $modal.modal();
                  });
                  $dashlet.append($button);
                }
                var $gridHTML = one.lib.dashlet.datagrid.init(
                    one.f.switchmanager.subnetGatewayConfig.id.dashlet.datagrid, {
                      searchable : true,
                      filterable : false,
                      pagination : true,
                      flexibleRowsPerPage : true
                    }, "table-striped table-condensed");
                $dashlet.append($gridHTML);
                var dataSource = one.f.switchmanager.subnetGatewayConfig.data.devicesgrid(content);
                $("#" + one.f.switchmanager.subnetGatewayConfig.id.dashlet.datagrid).datagrid({
                  dataSource : dataSource
                }).on(
                    "loaded",
                    function() {
                      $("#" + one.f.switchmanager.subnetGatewayConfig.id.dashlet.selectAll).click(
                          function() {
                            $("#" + one.f.switchmanager.subnetGatewayConfig.id.dashlet.datagrid).find(
                                ':checkbox').prop(
                                'checked',
                                $("#" + one.f.switchmanager.subnetGatewayConfig.id.dashlet.selectAll).is(
                                    ':checked'));
                          });
                      $(".subnetGatewayConfig").click(
                          function(e) {
                            if (!$('.subnetGatewayConfig[type=checkbox]:not(:checked)').length) {
                              $("#" + one.f.switchmanager.subnetGatewayConfig.id.dashlet.selectAll).prop(
                                  "checked", true);
                            } else {
                              $("#" + one.f.switchmanager.subnetGatewayConfig.id.dashlet.selectAll).prop(
                                  "checked", false);
                            }
                            e.stopPropagation();
                          });
                    });
              });
        },
        ajax : {
          main : function(url, requestData, callback) {
            $.getJSON(url, requestData, function(data) {
              callback(data);
            });
          }
        },
        registry : {},
        modal : {
          initialize : {
            gateway : function() {
              var h3 = "Add Gateway IP Address";
              var footer = one.f.switchmanager.subnetGatewayConfig.modal.footer();
              var $modal = one.lib.modal.spawn(one.f.switchmanager.subnetGatewayConfig.id.modal.modal,
                  h3, "", footer);
              // bind save button
              $('#' + one.f.switchmanager.subnetGatewayConfig.id.modal.save, $modal).click(function() {
                one.f.switchmanager.subnetGatewayConfig.modal.save.gateway($modal);
              });
              var $body = one.f.switchmanager.subnetGatewayConfig.modal.body.gateway();
              one.lib.modal.inject.body($modal, $body);
              return $modal;
            },
            ports : function() {
              var h3 = "Add Ports";
              var footer = one.f.switchmanager.subnetGatewayConfig.modal.footer();
              var $modal = one.lib.modal.spawn(one.f.switchmanager.subnetGatewayConfig.id.modal.ports,
                  h3, "", footer);
              // bind save button
              $('#' + one.f.switchmanager.subnetGatewayConfig.id.modal.save, $modal).click(function() {
                one.f.switchmanager.subnetGatewayConfig.modal.save.ports($modal);
              });

              // TODO: Change to subnetGateway instead.
              one.f.switchmanager.spanPortConfig.modal.ajax.nodes(function(nodes, nodeports) {
                var $body = one.f.switchmanager.subnetGatewayConfig.modal.body.ports(nodes, nodeports);
                one.lib.modal.inject.body($modal, $body);
              });
              return $modal;
            }
          },
          save : {
            gateway : function($modal) {
              var result = {};
              result['gatewayName'] = $('#' + one.f.switchmanager.subnetGatewayConfig.id.modal.form.name,
                  $modal).val();
              if (!one.f.switchmanager.validateName(result['gatewayName'])) {
                alert("Gateway name can contain upto 255 characters");
                return;
              }
              result['gatewayIPAddress'] = $(
                  '#' + one.f.switchmanager.subnetGatewayConfig.id.modal.form.gatewayIPAddress, $modal)
                  .val();
              one.f.switchmanager.subnetGatewayConfig.modal.ajax.gateway(result, function(response) {
                if (response.status == true) {
                  $modal.modal('hide');
                  one.f.switchmanager.subnetGatewayConfig.dashlet($("#right-bottom .dashlet"));
                } else {
                  alert(response.message);
                }
              });
            },
            ports : function($modal) {
              var result = {};
              var gatewayRegistryIndex = $(
                  '#' + one.f.switchmanager.subnetGatewayConfig.id.modal.form.name, $modal).val();
              result['portsName'] = one.f.switchmanager.subnetGatewayConfig.registry.gateways[gatewayRegistryIndex];
              result['nodeId'] = $('#' + one.f.switchmanager.subnetGatewayConfig.id.modal.form.nodeId,
                  $modal).val();
              result['ports'] = $('#' + one.f.switchmanager.subnetGatewayConfig.id.modal.form.ports,
                  $modal).val();
              if (!result['portsName'] || result['portsName'] == "") {
                alert("No gateway chosen. Cannot add port");
                return;
              }
              if (!result['nodeId'] || result['nodeId'] == "") {
                alert("Please select a node.");
                return;
              }
              if (!result['ports'] || result['ports'] == "") {
                alert("Please choose a port.");
                return;
              }
              one.f.switchmanager.subnetGatewayConfig.modal.ajax.ports(result, function(response) {
                if (response.status == true) {
                  $modal.modal('hide');
                  one.f.switchmanager.subnetGatewayConfig.dashlet($("#right-bottom .dashlet"));
                } else {
                  alert(response.message);
                }
              });
            }
          },
          body : {
            gateway : function() {
              var $form = $(document.createElement('form'));
              var $fieldset = $(document.createElement('fieldset'));
              // gateway name
              var $label = one.lib.form.label("Name");
              var $input = one.lib.form.input("Name");
              $input.attr('id', one.f.switchmanager.subnetGatewayConfig.id.modal.form.name);
              $fieldset.append($label).append($input);
              // gateway IP Mask
              var $label = one.lib.form.label("Gateway IP Address/Mask");
              var $input = one.lib.form.input("Gateway IP Address/Mask");
              var $help = one.lib.form.help('Example: 192.168.10.254/16');
              $input.attr('id', one.f.switchmanager.subnetGatewayConfig.id.modal.form.gatewayIPAddress);
              $fieldset.append($label).append($input).append($help);

              $form.append($fieldset);
              return $form;
            },
            ports : function(nodes, nodeports) {
              var $form = $(document.createElement('form'));
              var $fieldset = $(document.createElement('fieldset'));
              // gateways drop down
              var $label = one.lib.form.label("Gateway Name");
              var $select = one.lib.form.select
                  .create(one.f.switchmanager.subnetGatewayConfig.registry.gateways);
              $select.attr('id', one.f.switchmanager.subnetGatewayConfig.id.modal.form.name);
              one.lib.form.select.prepend($select, {
                '' : 'Please Select a Gateway'
              });
              $select.val($select.find("option:first").val());
              $fieldset.append($label).append($select);

              // node ID
              var $label = one.lib.form.label("Node ID");
              var $select = one.lib.form.select.create(nodes);
              $select.attr('id', one.f.switchmanager.subnetGatewayConfig.id.modal.form.nodeId);
              one.lib.form.select.prepend($select, {
                '' : 'Please Select a Node'
              });
              $select.val($select.find("option:first").val());
              $fieldset.append($label).append($select);

              // bind onchange
              $select.change(function() {
                // retrieve port value
                var node = $(this).find('option:selected').attr('value');
                one.f.switchmanager.subnetGatewayConfig.registry['currentNode'] = node;
                var $ports = $('#' + one.f.switchmanager.subnetGatewayConfig.id.modal.form.ports);
                var ports = nodeports[node];
                var options = {};
                $(ports).each(function(idx, val) {
                  options[val.internalPortName] = val.portName + ' (' + val.portId + ')';
                });
                one.lib.form.select.inject($ports, options);
                one.lib.form.select.prepend($ports, {
                  '' : 'Please Select a Port'
                });
                $ports.val($ports.find("option:first").val());
              });

              // ports
              var $label = one.lib.form.label("Select Port");
              var $select = one.lib.form.select.create();
              one.lib.form.select.prepend($select, {
                '' : 'Please Select a Port'
              });
              $select.attr('id', one.f.switchmanager.subnetGatewayConfig.id.modal.form.ports);
              $fieldset.append($label).append($select);

              $form.append($fieldset);
              return $form;
            }
          },
          ajax : {
            gateway : function(requestData, callback) {
              $.getJSON(one.f.switchmanager.rootUrl + "/subnetGateway/add", requestData, function(data) {
                callback(data);
              });
            },
            ports : function(requestData, callback) {
              $.getJSON(one.f.switchmanager.rootUrl + "/subnetGateway/ports/add", requestData, function(
                  data) {
                callback(data);
              });
            }
          },
          footer : function() {
            var footer = [];
            var saveButton = one.lib.dashlet.button.single("Save",
                one.f.switchmanager.subnetGatewayConfig.id.modal.save, "btn-primary", "");
            var $saveButton = one.lib.dashlet.button.button(saveButton);
            footer.push($saveButton);
            return footer;
          },
          removeMultiple : {
            dialog : function(gatewaysToDelete) {
              var h3 = 'Remove Gateway IP Address';

              var footer = one.f.switchmanager.subnetGatewayConfig.modal.removeMultiple.footer();
              var $body = one.f.switchmanager.subnetGatewayConfig.modal.removeMultiple
                  .body(gatewaysToDelete);
              var $modal = one.lib.modal.spawn(one.f.switchmanager.subnetGatewayConfig.id.modal.modal,
                  h3, $body, footer);

              // bind close button
              $('#' + one.f.switchmanager.subnetGatewayConfig.id.modal.cancel, $modal).click(function() {
                $modal.modal('hide');
              });

              // bind remove rule button
              $('#' + one.f.switchmanager.subnetGatewayConfig.id.modal.remove, $modal).click(
                  this,
                  function(e) {
                    var requestData = {};
                    if (gatewaysToDelete.length > 0) {
                      requestData["gatewaysToDelete"] = gatewaysToDelete.toString();
                      var url = one.f.switchmanager.rootUrl + "/subnetGateway/delete";
                      one.f.switchmanager.subnetGatewayConfig.ajax.main(url, requestData, function(
                          response) {
                        $modal.modal('hide');
                        if (response.status == true) {
                          // refresh dashlet by passing dashlet div as param
                          one.lib.alert("Gateway IP Address(es) successfully removed");
                        } else {
                          alert(response.message);
                        }
                        one.f.switchmanager.subnetGatewayConfig.dashlet($("#right-bottom .dashlet"));
                      });
                    }
                  });
              $modal.modal();
            },
            footer : function() {
              var footer = [];
              var remove = one.lib.dashlet.button.single('Remove Gateway IP Address',
                  one.f.switchmanager.subnetGatewayConfig.id.modal.remove, 'btn-danger', '');
              var $remove = one.lib.dashlet.button.button(remove);
              footer.push($remove);

              var cancel = one.lib.dashlet.button.single('Cancel',
                  one.f.switchmanager.subnetGatewayConfig.id.modal.cancel, '', '');
              var $cancel = one.lib.dashlet.button.button(cancel);
              footer.push($cancel);

              return footer;
            },
            body : function(gatewayList) {
              var $p = $(document.createElement('p'));
              var p = 'Remove the following Gateway IP Address(es)?';
              // creata a BS label for each rule and append to list
              $(gatewayList).each(function() {
                var $span = $(document.createElement('span'));
                $span.append(this);
                p += '<br/>' + $span[0].outerHTML;
              });
              $p.append(p);
              return $p;
            }
          }
        },
        // data functions
        data : {
          devicesgrid : function(data) {
            one.f.switchmanager.subnetGatewayConfig.registry.gateways = [];
            var source = new StaticDataSource(
                {
                  columns : [
                      {
                        property : 'selector',
                        label : "<input type='checkbox'  id='"
                            + one.f.switchmanager.subnetGatewayConfig.id.dashlet.selectAll + "'/>",
                        sortable : false
                      }, {
                        property : 'name',
                        label : 'Name',
                        sortable : true
                      }, {
                        property : 'subnet',
                        label : 'Gateway IP Address/Mask',
                        sortable : true
                      }, {
                        property : 'nodePorts',
                        label : 'Ports',
                        sortable : false
                      } ],
                  data : data.nodeData,
                  formatter : function(items) {
                    $
                        .each(
                            items,
                            function(index, tableRow) {
                              tableRow["selector"] = '<input type="checkbox" class="subnetGatewayConfig" id="'
                                  + tableRow["name"] + '"></input>';
                              var json = tableRow["nodePorts"];
                              var nodePorts = JSON.parse(json);
                              var nodePortHtml = "<div>";
                              $
                                  .each(
                                      nodePorts,
                                      function(index, nodePort) {
                                        nodePortHtml += nodePort["nodePortName"] + " @ "
                                            + nodePort["nodeName"];
                                        nodePortHtml += "&nbsp;";
                                        nodePortHtml += '<a href="#" id="'
                                            + encodeURIComponent(nodePort["nodePortId"])
                                            + '" gatewayName="'
                                            + tableRow["name"]
                                            + '" onclick="javascript:one.f.switchmanager.subnetGatewayConfig.actions.deleteNodePort(this);">Remove</a>';
                                        nodePortHtml += "<br/>";
                                      });
                              nodePortHtml += "</div>";
                              tableRow["nodePorts"] = nodePortHtml;
                            });

                  },
                  delay : 0
                });
            // populate the registry with subnet names
            one.f.switchmanager.subnetGatewayConfig.registry.gateways = [];
            $.each(data.nodeData, function(key, value) {
              one.f.switchmanager.subnetGatewayConfig.registry.gateways.push(value["name"]);
            });
            return source;
          },
          devices : function(data) {
            var result = [];
            one.f.switchmanager.subnetGatewayConfig.registry.gateways = [];
            $.each(data.nodeData, function(key, value) {
              var tr = {};
              // fill up all the td's
              var subnetConfigObject = $.parseJSON(value["json"]);
              var nodePorts = subnetConfigObject.nodePorts;
              var $nodePortsContainer = $(document.createElement("div"));

              for ( var i = 0; i < nodePorts.length; i++) {
                var nodePort = nodePorts[i];
                $nodePortsContainer.append(nodePort + " ");
                // add delete anchor tag to delete ports
                var aTag = document.createElement("a");
                aTag.setAttribute("id", encodeURIComponent(nodePort));
                aTag.gatewayName = value["name"];
                aTag.addEventListener("click", function(evt) {
                  var htmlPortAnchor = evt.target;
                  var requestData = {};
                  requestData["gatewayName"] = evt.target.gatewayName;
                  requestData["nodePort"] = decodeURIComponent(evt.target.id);
                  // make ajax call to delete port
                  var url = one.f.switchmanager.rootUrl + "/subnetGateway/ports/delete";
                  one.f.switchmanager.subnetGatewayConfig.ajax.main(url, requestData, function(response) {
                    if (response.status == true) {
                      // refresh dashlet by passing dashlet div as param
                      one.f.switchmanager.subnetGatewayConfig.dashlet($("#right-bottom .dashlet"));
                    } else {
                      alert(response.message);
                    }
                  });

                });
                aTag.addEventListener("mouseover", function(evt) {
                  evt.target.style.cursor = "pointer";
                }, false);
                aTag.innerHTML = "Remove";
                $nodePortsContainer.append(aTag);
                $nodePortsContainer.append("<br/>");
              }

              // store gateways in the registry so that they can be used in the
              // add ports popup
              one.f.switchmanager.subnetGatewayConfig.registry.gateways.push(value["name"]);
              var entry = [];
              var checkbox = document.createElement("input");
              checkbox.setAttribute("type", "checkbox");
              checkbox.setAttribute("id", value["name"]);
              entry.push(checkbox);
              entry.push(value["name"]);
              entry.push(value["subnet"]);
              entry.push($nodePortsContainer);
              tr.entry = entry;
              result.push(tr);
            });
            return result;
          }
        },
        actions : {
          deleteNodePort : function(htmlPortAnchor) {
            var requestData = {};
            requestData["gatewayName"] = htmlPortAnchor.getAttribute("gatewayName");
            requestData["nodePort"] = decodeURIComponent(htmlPortAnchor.id);
            // make ajax call to delete port
            var url = one.f.switchmanager.rootUrl + "/subnetGateway/ports/delete";
            one.f.switchmanager.subnetGatewayConfig.ajax.main(url, requestData, function(response) {
              if (response.status == true) {
                // refresh dashlet by passing dashlet div as param
                one.f.switchmanager.subnetGatewayConfig.dashlet($("#right-bottom .dashlet"));
              } else {
                alert(response.message);
              }
            });
          }
        }
      }
      return module_subnetGatewayConfig;

});  // end define

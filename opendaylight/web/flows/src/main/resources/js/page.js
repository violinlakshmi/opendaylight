/*
 * Copyright (c) 2013 Cisco Systems, Inc. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

//PAGE flows
one.f = {};

// specify dashlets and layouts
one.f.dashlet = {
    flows : {
        id : 'flows',
        name : 'Flow Entries'
    },
    nodes : {
        id : 'nodes',
        name : 'Nodes'
    },
    detail : {
        id : 'detail',
        name : 'Flow Detail'
    }
};

one.f.menu = {
    left : {
        top : [
            one.f.dashlet.flows
        ],
        bottom : [
            one.f.dashlet.nodes
        ]
    },
    right : {
        top : [],
        bottom : [
            one.f.dashlet.detail
        ]
    }
};

one.f.address = {
    root : "/controller/web/flows",
    flows : {
        main : "/main",
        flows : "/node-flows",
        nodes : "/node-ports",
        flow : "/flow",
        modifyFlow : "/modifyFlow",
        deleteFlows:"/flow/deleteFlows"
    }
}

/** NODES **/
one.f.nodes = {
    id : {
        dashlet: {
            datagrid: "one_f_nodes_id_dashlet_datagrid"
        }
    },
    registry : {},
    dashlet : function($dashlet) {
        var $h4 = one.lib.dashlet.header("Nodes");
        $dashlet.append($h4);

        one.f.nodes.ajax.dashlet(function(data) {
            var $gridHTML = one.lib.dashlet.datagrid.init(one.f.nodes.id.dashlet.datagrid, {
                searchable: true,
                filterable: false,
                pagination: true,
                flexibleRowsPerPage: true
                }, "table-striped table-condensed");
            $dashlet.append($gridHTML);
            var dataSource = one.f.nodes.data.nodesDataGrid(data);
            $("#" + one.f.nodes.id.dashlet.datagrid).datagrid({dataSource: dataSource});
        });
    },
    ajax : {
        dashlet : function(callback) {
            $.getJSON(one.f.address.root+one.f.address.flows.flows, function(data) {
                callback(data);
            });
        }
    },
    data : {
        nodesDataGrid: function(data) {
            var gridData = [];
            $.each(data, function(nodeName, flow) {
                var nodeFlowObject = {};
                nodeFlowObject["nodeName"] = nodeName;
                nodeFlowObject["flows"] = flow;
                nodeFlowObject["rowData"] = nodeName + flow + "-foobar";
                gridData.push(nodeFlowObject);
            });

            var source = new StaticDataSource({
                    columns: [
                        {
                            property: 'nodeName',
                            label: 'Node',
                            sortable: true
                        },
                        {
                            property: 'flows',
                            label: 'Flows',
                            sortable: true
                        }
                    ],
                    data: gridData,
                    delay: 0
                });
            return source;
        }
    },
    body : {
        dashlet : function(body, callback) {
            var attributes = ['table-striped', 'table-bordered', 'table-hover', 'table-condensed'];
            var $table = one.lib.dashlet.table.table(attributes);

            var headers = ['Node', 'Flows'];
            var $thead = one.lib.dashlet.table.header(headers);
            $table.append($thead);

            var $tbody = one.lib.dashlet.table.body(body);
            $table.append($tbody);

            return $table;
        }
    }
}

/** FLOW DETAIL **/
one.f.detail = {
    id : {},
    registry : {},
    dashlet : function($dashlet, details) {
        var $h4 = one.lib.dashlet.header("Flow Details");
        $dashlet.append($h4);

        // details
        if (details == undefined) {
            var $none = $(document.createElement('div'));
            $none.addClass('none');
            var $p = $(document.createElement('p'));
            $p.text('Please select a flow');
            $p.addClass('text-center').addClass('text-info');

            $dashlet.append($none)
                .append($p);
        }
    },
    data : {
        dashlet : function(data) {
            var body = [];
            var tr = {};
            var entry = [];

            entry.push(data['name']);
            entry.push(data['node']);
            entry.push(data['flow']['priority']);
            entry.push(data['flow']['hardTimeout']);
            entry.push(data['flow']['idleTimeout']);

            tr.entry = entry;
            body.push(tr);
            return body;
        },
        description : function(data) {
            var body = [];
            var tr = {};
            var entry = [];
            entry.push(data['flow']['ingressPort']);
            entry.push(data['flow']['etherType']);
            entry.push(data['flow']['vlanId']);
            entry.push(data['flow']['vlanPriority']);
            entry.push(data['flow']['srcMac']);
            entry.push(data['flow']['dstMac']);
            entry.push(data['flow']['srcIp']);
            entry.push(data['flow']['dstIp']);
            entry.push(data['flow']['tosBits']);
            entry.push(data['flow']['srcPort']);
            entry.push(data['flow']['dstPort']);
            entry.push(data['flow']['protocol']);
            entry.push(data['flow']['cookie']);

            tr.entry = entry;
            body.push(tr);
            return body;
        },
        actions : function(data) {
            var body = [];
            var tr = {};
            var entry = [];
            var actions = '';

            $(data['flow']['actions']).each(function(index, value) {
                var locEqualTo = value.indexOf("=");
                if ( locEqualTo == -1 ) {
                    actions += value + ', ';
                } else {
                    var action = value.substr(0,locEqualTo);
                    if( action == "OUTPUT") {
                        var portIds = value.substr(locEqualTo+1).split(",");
                        actions += action + "=";
                        var allPorts = one.f.flows.registry.nodeports[one.f.flows.registry.selectedNode]['ports'];
                        for(var i =0; i < portIds.length ; i++) {
                            var portName = allPorts[portIds[i]];
                            actions += portName + ", ";
                        }
                    } else {
                        actions += value + ', ';
                    }
                }
            });
            actions = actions.slice(0,-2);
            entry.push(actions);

            tr.entry = entry;
            body.push(tr);
            return body;
        }
    },
    body : {
        dashlet : function(body) {
            // create table
            var header = ['Flow Name', 'Node', 'Priority', 'Hard Timeout', 'Idle Timeout'];
            var $thead = one.lib.dashlet.table.header(header);
            var attributes = ['table-striped', 'table-bordered', 'table-condensed'];
            var $table = one.lib.dashlet.table.table(attributes);
            $table.append($thead);

            var $tbody = one.lib.dashlet.table.body(body);
            $table.append($tbody);

            return $table;
        },
        description : function(body) {
            var header = ['Input Port', 'Ethernet Type', 'VLAN ID', 'VLAN Priority', 'Source MAC', 'Dest MAC', 'Source IP', 'Dest IP', 'ToS', 'Source Port', 'Dest Port', 'Protocol', 'Cookie'];
            var $thead = one.lib.dashlet.table.header(header);
            var attributes = ['table-striped', 'table-bordered', 'table-condensed'];
            var $table = one.lib.dashlet.table.table(attributes);
            $table.append($thead);

            var $tbody = one.lib.dashlet.table.body(body);
            $table.append($tbody);

            return $table;
        },
        actions : function(body) {
            var header = ['Actions'];
            var $thead = one.lib.dashlet.table.header(header);
            var attributes = ['table-striped', 'table-bordered', 'table-condensed'];
            var $table = one.lib.dashlet.table.table(attributes);
            $table.append($thead);

            var $tbody = one.lib.dashlet.table.body(body);
            $table.append($tbody);

            return $table;
        }
    }
}

/** FLOW ENTRIES **/
one.f.flows = {
    id : {
        dashlet : {
            add : "one_f_flows_id_dashlet_add",
            removeMultiple : "one_f_flows_id_dashlet_removeMultiple",
            remove : "one_f_flows_id_dashlet_remove",
            toggle : "one_f_flows_id_dashlet_toggle",
            edit : "one_f_flows_id_dashlet_edit",
            datagrid : "one_f_flows_id_dashlet_datagrid",
            selectAllFlows : "one_f_flows_id_dashlet_selectAllFlows"
        },
        modal : {
            install : "one_f_flows_id_modal_install",
            edit : "one_f_flows_id_modal_edit",
            add : "one_f_flows_id_modal_add",
            close : "one_f_flows_id_modal_close",
            modal : "one_f_flows_id_modal_modal",
            dialog : {
                modal : "one_f_flows_id_modal_dialog_modal",
                remove : "one_f_flows_id_modal_dialog_remove",
                close : "one_f_flows_id_modal_dialog_close"
            },
            action : {
                button : "one_f_flows_id_modal_action_button",
                modal : "one_f_flows_id_modal_action_modal",
                add : "one_f_flows_id_modal_action_add",
                close : "one_f_flows_id_modal_action_close",
                table : "one_f_flows_id_modal_action_table",
                addOutputPorts : "one_f_flows_id_modal_action_addOutputPorts",
                setVlanId : "one_f_flows_id_modal_action_setVlanId",
                setVlanPriority : "one_f_flows_id_modal_action_setVlanPriority",
                modifyDatalayerSourceAddress : "one_f_flows_id_modal_action_modifyDatalayerSourceAddress",
                modifyDatalayerDestinationAddress : "one_f_flows_id_modal_action_modifyDatalayerDestinationAddress",
                modifyNetworkSourceAddress : "one_f_flows_modal_action_modifyNetworkSourceAddress",
                modifyNetworkDestinationAddress : "one_f_flows_modal_action_modifyNetworkDestinationAddress",
                modifyTosBits : "one_f_flows_modal_action_modifyTosBits",
                modifyTransportSourcePort : "one_f_flows_modal_action_modifyTransportSourcePort",
                modifyTransportDestinationPort : "one_f_flows_modal_action_modifyTransportDestinationPort",
                modal : {
                    modal : "one_f_flows_modal_action_modal_modal",
                    remove : "one_f_flows_modal_action_modal_remove",
                    cancel : "one_f_flows_modal_action_modal_cancel"
                }
            },
            form : {
                name : "one_f_flows_id_modal_form_name",
                nodes : "one_f_flows_id_modal_form_nodes",
                port : "one_f_flows_id_modal_form_port",
                priority : "one_f_flows_id_modal_form_priority",
                hardTimeout : "one_f_flows_id_modal_form_hardTimeout",
                idleTimeout : "one_f_flows_id_modal_form_idleTimeout",
                cookie : "one_f_flows_id_modal_form_cookie",
                etherType : "one_f_flows_id_modal_form_etherType",
                vlanId : "one_f_flows_id_modal_form_vlanId",
                vlanPriority : "one_f_flows_id_modal_form_vlanPriority",
                srcMac : "one_f_flows_id_modal_form_srcMac",
                dstMac : "one_f_flows_id_modal_form_dstMac",
                srcIp : "one_f_flows_id_modal_form_srcIp",
                dstIp : "one_f_flows_id_modal_form_dstIp",
                tosBits : "one_f_flows_id_modal_form_tosBits",
                srcPort : "one_f_flows_id_modal_form_srcPort",
                dstPort : "one_f_flows_id_modal_form_dstPort",
                protocol : "one_f_flows_id_modal_form_protocol"
            }
        }
    },
    registry : {},
    dashlet : function($dashlet, callback) {

        // load body
        one.f.flows.ajax.dashlet(function(data) {

            var $h4 = one.lib.dashlet.header("Flow Entries");

            $dashlet.append($h4);
            if (one.f.flows.registry.privilege === 'WRITE') {
                var button = one.lib.dashlet.button.single("Add Flow Entry", one.f.flows.id.dashlet.add, "btn-primary", "btn-mini");
                var $button = one.lib.dashlet.button.button(button);

                $button.click(function() {
                    var $modal = one.f.flows.modal.initialize();
                    $modal.modal();
                });
                $dashlet.append($button);
                var button = one.lib.dashlet.button.single("Remove Flow Entry", one.f.flows.id.dashlet.removeMultiple, "btn-danger", "btn-mini");
                var $button = one.lib.dashlet.button.button(button);

                $button.click(function() {
                    var checkedCheckBoxes = $('.flowEntry[type=checkbox]:checked');
                    if (checkedCheckBoxes.size() === 0) {
                        return false;
                    }
                    
                    var requestData = [];
                    
                    checkedCheckBoxes.each(function(index, value) {
                        var flowEntry = {};
                        flowEntry['name'] = checkedCheckBoxes[index].name;
                        flowEntry['node'] = checkedCheckBoxes[index].getAttribute("node");
                        requestData.push(flowEntry);  
                    });
                    one.f.flows.modal.removeMultiple.dialog(requestData);
                });
                $dashlet.append($button);

            }

            var $gridHTML = one.lib.dashlet.datagrid.init(one.f.flows.id.dashlet.datagrid, {
                searchable: true,
                filterable: false,
                pagination: true,
                flexibleRowsPerPage: true
                }, "table-striped table-condensed");
            $dashlet.append($gridHTML);
            var dataSource = one.f.flows.data.flowsDataGrid(data);
            $("#" + one.f.flows.id.dashlet.datagrid).datagrid({dataSource: dataSource}).on("loaded", function() {
                    $("#"+one.f.flows.id.dashlet.datagrid.selectAllFlows).click(function() {
                                $("#" + one.f.flows.id.dashlet.datagrid).find(':checkbox').prop('checked',
                                        $("#"+one.f.flows.id.dashlet.datagrid.selectAllFlows).is(':checked'));
                    });
                    
                    $("#" + one.f.flows.id.dashlet.datagrid).find("tbody tr").each(function(index, tr) {
                    $tr = $(tr);
                    $span = $("td span", $tr);
                    var flowstatus = $span.data("flowstatus");
                    if($span.data("installinhw") != null) {
                        var installInHw = $span.data("installinhw").toString();
                        if(installInHw == "true" && flowstatus == "Success") {
                            $tr.addClass("success");
                        } else {
                            $tr.addClass("warning");
                        }
                    }
                    // attach mouseover to show pointer cursor
                    $tr.mouseover(function() {
                        $(this).css("cursor", "pointer");
                    });
                    // attach click event
                    $tr.click(function() {
                        var $td = $($(this).find("td")[1]);
                        var id = $td.text();
                        var node = $td.find("span").data("nodeid");
                        one.f.flows.detail(id, node);
                    });
                    $(".flowEntry").click(function(e){
                                if (!$('.flowEntry[type=checkbox]:not(:checked)').length) {
                            $("#"+one.f.flows.id.dashlet.datagrid.selectAllFlows)
                                .prop("checked",
                              true);
                        } else {
                            $("#"+one.f.flows.id.dashlet.datagrid.selectAllFlows)
                                .prop("checked",
                             false);
                        }
                        e.stopPropagation();
                    });
                });
            });
            
            // details callback
            if(callback != undefined) callback();
        });
    },
    detail : function(id, node) {
        // clear flow details
        var $detailDashlet = one.main.dashlet.right.bottom;
        $detailDashlet.empty();
        var $h4 = one.lib.dashlet.header("Flow Overview");
        $detailDashlet.append($h4);

        // details
        var flows = one.f.flows.registry.flows;
        one.f.flows.registry['selectedId'] = id;
        one.f.flows.registry['selectedNode'] = node;
        var flow;
        $(flows).each(function(index, value) {
          if (value.name == id && value.nodeId == node) {
            flow = value;
          }
        });
        if (one.f.flows.registry.privilege === 'WRITE') {
            // remove button
            var button = one.lib.dashlet.button.single("Remove Flow", one.f.flows.id.dashlet.remove, "btn-danger", "btn-mini");
            var $button = one.lib.dashlet.button.button(button);
            $button.click(function() {
                var $modal = one.f.flows.modal.dialog.initialize(id, node);
                $modal.modal();
            });
            // edit button
            var editButton = one.lib.dashlet.button.single("Edit Flow", one.f.flows.id.dashlet.edit, "btn-primary", "btn-mini");
            var $editButton = one.lib.dashlet.button.button(editButton);
            $editButton.click(function() {
            	var install = flow['flow']['installInHw'];
                var $modal = one.f.flows.modal.initialize(true,install);
                $modal.modal().on('shown',function(){
                    var $port = $('#'+one.f.flows.id.modal.form.port);
                    $('#'+one.f.flows.id.modal.form.nodes).trigger("change");
                });
            });
            // toggle button
            var toggle;
            if (flow['flow']['installInHw'] == 'true' && flow['flow']['status'] == 'Success') {
                toggle = one.lib.dashlet.button.single("Uninstall Flow", one.f.flows.id.dashlet.toggle, "btn-warning", "btn-mini");
            } else {
                toggle = one.lib.dashlet.button.single("Install Flow", one.f.flows.id.dashlet.toggle, "btn-success", "btn-mini");
            }
            var $toggle = one.lib.dashlet.button.button(toggle);
            $toggle.click(function() {
                one.f.flows.modal.ajax.toggleflow(id, node, function(data) {
                    if(data == "Success") {
                        one.main.dashlet.right.bottom.empty();
                        one.f.detail.dashlet(one.main.dashlet.right.bottom);
                        one.main.dashlet.left.top.empty();
                        one.f.flows.dashlet(one.main.dashlet.left.top, function() {
                           // checks are backwards due to stale registry
                           if(flow['flow']['installInHw'] == 'true') {
                               one.lib.alert('Uninstalled Flow');
                           } else {
                               one.lib.alert('Installed Flow');
                           }
                           one.f.flows.detail(id, node)
                        });
                    } else {
                        one.lib.alert('Cannot toggle flow: '+data);
                    }
                });
            });

            $detailDashlet.append($button).append($editButton).append($toggle);
        }
        // append details
        var body = one.f.detail.data.dashlet(flow);
        var $body = one.f.detail.body.dashlet(body);
        $detailDashlet.append($body);
        var body = one.f.detail.data.description(flow);
        var $body = one.f.detail.body.description(body);
        $detailDashlet.append($body);
        var body = one.f.detail.data.actions(flow);
        var $body = one.f.detail.body.actions(body);
        $detailDashlet.append($body);
    },
    modal : {
        dialog : {
            initialize : function(id, node) {
                var h3 = "Remove Flow";
                var $p = one.f.flows.modal.dialog.body(id);
                var footer = one.f.flows.modal.dialog.footer();
                var $modal = one.lib.modal.spawn(one.f.flows.id.modal.dialog.modal, h3, $p, footer);
                $('#'+one.f.flows.id.modal.dialog.close, $modal).click(function() {
                    $modal.modal('hide');
                });
                $('#'+one.f.flows.id.modal.dialog.remove, $modal).click(function() {
                    one.f.flows.modal.ajax.removeflow(id, node, function(data) {
                        if (data == "Success") {
                            $modal.modal('hide');
                            one.main.dashlet.right.bottom.empty();
                            one.f.detail.dashlet(one.main.dashlet.right.bottom);
                            one.main.dashlet.left.top.empty();
                            one.f.flows.dashlet(one.main.dashlet.left.top);
                            one.lib.alert('Flow removed');
                        } else {
                            one.lib.alert('Cannot remove flow: '+data);
                        }
                    });
                });
                return $modal;
            },
            footer : function() {
                var footer = [];

                var removeButton = one.lib.dashlet.button.single("Remove Flow", one.f.flows.id.modal.dialog.remove, "btn-danger", "");
                var $removeButton = one.lib.dashlet.button.button(removeButton);
                footer.push($removeButton);

                var closeButton = one.lib.dashlet.button.single("Cancel", one.f.flows.id.modal.dialog.close, "", "");
                var $closeButton = one.lib.dashlet.button.button(closeButton);
                footer.push($closeButton);

                return footer;
            },
            body : function(id) {
                var $p = $(document.createElement('p'));
                $p.append('Remove flow '+id+'?');
                return $p;
            }
        },
        initialize : function(edit,install) {
            var h3;
            if(edit) {
                h3 = "Edit Flow Entry";
                var footer = one.f.flows.modal.footerEdit();

            } else {
                h3 = "Add Flow Entry";
                var footer = one.f.flows.modal.footer();
            }

            var $modal = one.lib.modal.spawn(one.f.flows.id.modal.modal, h3, "", footer);

            // bind close button
            $('#'+one.f.flows.id.modal.close, $modal).click(function() {
                $modal.modal('hide');
            });

            if (edit) {
                // bind edit flow button
                $('#'+one.f.flows.id.modal.edit, $modal).click(function() {
                    one.f.flows.modal.save($modal, install, true);
                });
            } else {
                // bind add flow button
                $('#'+one.f.flows.id.modal.add, $modal).click(function() {
                    one.f.flows.modal.save($modal, 'false');
                });

                // bind install flow button
                $('#'+one.f.flows.id.modal.install, $modal).click(function() {
                    one.f.flows.modal.save($modal, 'true');
                });
            }


            var nodes = one.f.flows.registry.nodes;
            var nodeports = one.f.flows.registry.nodeports;
            var $body = one.f.flows.modal.body(nodes, nodeports, edit);
            one.lib.modal.inject.body($modal, $body,edit);

            return $modal;
        },
        save : function($modal, install, edit) {
            var result = {};

            result['name'] = $('#'+one.f.flows.id.modal.form.name, $modal).val();
            result['ingressPort'] = $('#'+one.f.flows.id.modal.form.port, $modal).val();
            result['priority'] = $('#'+one.f.flows.id.modal.form.priority, $modal).val();
            result['hardTimeout'] = $('#'+one.f.flows.id.modal.form.hardTimeout, $modal).val();
            result['idleTimeout'] = $('#'+one.f.flows.id.modal.form.idleTimeout, $modal).val();
            result['cookie'] = $('#'+one.f.flows.id.modal.form.cookie, $modal).val();
            result['etherType'] = $('#'+one.f.flows.id.modal.form.etherType, $modal).val();
            result['vlanId'] = $('#'+one.f.flows.id.modal.form.vlanId, $modal).val();
            result['vlanPriority'] = $('#'+one.f.flows.id.modal.form.vlanPriority, $modal).val();
            result['dlSrc'] = $('#'+one.f.flows.id.modal.form.srcMac, $modal).val();
            result['dlDst'] = $('#'+one.f.flows.id.modal.form.dstMac, $modal).val();
            result['nwSrc'] = $('#'+one.f.flows.id.modal.form.srcIp, $modal).val();
            result['nwDst'] = $('#'+one.f.flows.id.modal.form.dstIp, $modal).val();
            result['tosBits'] = $('#'+one.f.flows.id.modal.form.tosBits, $modal).val();
            result['tpSrc'] = $('#'+one.f.flows.id.modal.form.srcPort, $modal).val();
            result['tpDst'] = $('#'+one.f.flows.id.modal.form.dstPort, $modal).val();
            result['protocol'] = $('#'+one.f.flows.id.modal.form.protocol, $modal).val();
            result['installInHw'] = install;

            var nodeId = $('#'+one.f.flows.id.modal.form.nodes, $modal).val();

            $.each(result, function(key, value) {
                if (value == "") delete result[key];
            });

            var action = [];
            var $table = $('#'+one.f.flows.id.modal.action.table, $modal);
            $($table.find('tbody').find('tr')).each(function(index, value) {
                if (!$(this).find('td').hasClass('empty')) {
                    action.push($(value).data('action'));
                }
            });
            result['actions'] = action;

            // frontend validation
            if (result['name'] == undefined) {
                alert('Need flow name');
                return;
            }
            if (nodeId == '') {
                alert('Select node');
                return;
            }
            if (action.length == 0) {
                alert('Please specify an action');
                return;
            }

            // package for ajax call
            var resource = {};
            resource['body'] = JSON.stringify(result);
            if(edit){
                resource['action'] = 'edit';
            } else {
                resource['action'] = 'add';
            }

            resource['nodeId'] = nodeId;

            if (edit) {
                    one.f.flows.modal.ajax.saveflow(resource, function(data) {
                    if (data == "Success") {
                        $modal.modal('hide').on('hidden', function () {
                            one.f.flows.detail(result['name'], nodeId);
                        });
                        one.lib.alert('Flow Entry edited');
                        one.main.dashlet.left.top.empty();
                        one.f.flows.dashlet(one.main.dashlet.left.top);
                    } else {
                        alert('Could not edit flow: '+data);
                    }
                });
            } else {
                    one.f.flows.modal.ajax.saveflow(resource, function(data) {
                    if (data == "Success") {
                        $modal.modal('hide');
                        one.lib.alert('Flow Entry added');
                        one.main.dashlet.left.top.empty();
                        one.f.flows.dashlet(one.main.dashlet.left.top);
                    } else {
                        alert('Could not add flow: '+data);
                    }
                });
            }
        },
        ajax : {
            nodes : function(successCallback) {
                $.getJSON(one.f.address.root+one.f.address.flows.nodes, function(data) {
                    var nodes = one.f.flows.modal.data.nodes(data);
                    var nodeports = data;
                    one.f.flows.registry['nodes'] = nodes;
                    one.f.flows.registry['nodeports'] = nodeports;

                    successCallback(nodes, nodeports);
                });
            },
            saveflow : function(resource, callback) {
                $.post(one.f.address.root+one.f.address.flows.flow, resource, function(data) {
                    callback(data);
                });
            },
            removeflow : function(id, node, callback) {
                resource = {};
                resource['action'] = 'remove';
                $.post(one.f.address.root+one.f.address.flows.flow+'/'+node+'/'+id, resource, function(data) {
                    callback(data);
                });
            },
            toggleflow : function(id, node, callback) {
                resource = {};
                resource['action'] = 'toggle';
                $.post(one.f.address.root+one.f.address.flows.flow+'/'+node+'/'+id, resource, function(data) {
                    callback(data);
                });
            }
        },
        data : {
            nodes : function(data) {
                result = {};
                $.each(data, function(key, value) {
                    result[key] = value['name'];
                });
                return result;
            }
        },
        body : function(nodes, nodeports, edit) {
            var $form = $(document.createElement('form'));
            var $fieldset = $(document.createElement('fieldset'));
            var existingFlow;
            // flow description
            var $legend = one.lib.form.legend("");
            $legend.css('visibility', 'hidden');
            $fieldset.append($legend);
            // name
            var $label = one.lib.form.label("Name");
            var $input = one.lib.form.input("Flow Name");
            $input.attr('id', one.f.flows.id.modal.form.name);
            if(edit) {
                $input.attr('disabled', 'disabled');
                var flows = one.f.flows.registry.flows;
                $(flows).each(function(index, value) {
                  if (value.name == one.f.flows.registry.selectedId && value.nodeId == one.f.flows.registry.selectedNode) {
                    existingFlow = value.flow;
                  }
                });
                $input.val(existingFlow.name);
            }

            $fieldset.append($label).append($input);
            // node
            var $label = one.lib.form.label("Node");
            var $select = one.lib.form.select.create(nodes);
            one.lib.form.select.prepend($select, { '' : 'Please Select a Node' });
            $select.val($select.find("option:first").val());
            $select.attr('id', one.f.flows.id.modal.form.nodes);
            if(edit) {
                $select.attr('disabled', 'disabled');
                $select.val(existingFlow.node.type + "|"+ existingFlow.node.nodeIDString);
            }

            // bind onchange
            $select.change(function() {
                // retrieve port value
                var node = $(this).find('option:selected').attr('value');
                var $ports = $('#'+one.f.flows.id.modal.form.port);
                if (node == '') {
                    one.lib.form.select.inject($ports, {});
                    return;
                }
                one.f.flows.registry['currentNode'] = node;
                var ports = nodeports[node]['ports'];
                one.lib.form.select.inject($ports, ports);
                one.lib.form.select.prepend($ports, { '' : 'Please Select a Port' });
                $ports.val($ports.find("option:first").val());
                if(edit) {
                    $ports.val( existingFlow.ingressPort );
                }
            });

            $fieldset.append($label).append($select);
            // input port
            var $label = one.lib.form.label("Input Port");
            var $select = one.lib.form.select.create();

            $select.attr('id', one.f.flows.id.modal.form.port);
            $fieldset.append($label).append($select);
            // priority
            var $label = one.lib.form.label("Priority");
            var $input = one.lib.form.input("Priority");
            $input.attr('id', one.f.flows.id.modal.form.priority);
            $input.val('500');
            $fieldset.append($label).append($input);
            if(edit) {
                $input.val(existingFlow.priority);
            }
            // hardTimeout
            var $label = one.lib.form.label("Hard Timeout");
            var $input = one.lib.form.input("Hard Timeout");
            $input.attr('id', one.f.flows.id.modal.form.hardTimeout);
            if(edit) {
                $input.val(existingFlow.hardTimeout);
            }
            $fieldset.append($label).append($input);

            // idleTimeout
            var $label = one.lib.form.label("Idle Timeout");
            var $input = one.lib.form.input("Idle Timeout");
            $input.attr('id', one.f.flows.id.modal.form.idleTimeout);
            $fieldset.append($label).append($input);
            if(edit) {
                $input.val(existingFlow.idleTimeout);
            }
            // cookie
            var $label = one.lib.form.label("Cookie");
            var $input = one.lib.form.input("Cookie");
            $input.attr('id', one.f.flows.id.modal.form.cookie);
            $fieldset.append($label).append($input);
            if(edit) {
                $input.val(existingFlow.cookie);
            }

            // layer 2
            var $legend = one.lib.form.legend("Layer 2");
            $fieldset.append($legend);
            // etherType
            var $label = one.lib.form.label("Ethernet Type");
            var $input = one.lib.form.input("Ethernet Type");
            $input.attr('id', one.f.flows.id.modal.form.etherType);
            $input.val('0x800');
            $fieldset.append($label).append($input);
            if(edit) {
                $input.val(existingFlow.etherType);
            }
            // vlanId
            var $label = one.lib.form.label("VLAN Identification Number");
            var $input = one.lib.form.input("VLAN Identification Number");
            $input.attr('id', one.f.flows.id.modal.form.vlanId);
            var $help = one.lib.form.help("Range: 0 - 4095");
            $fieldset.append($label).append($input).append($help);
            if(edit) {
                $input.val(existingFlow.vlanId);
            }

            // vlanPriority
            var $label = one.lib.form.label("VLAN Priority");
            var $input = one.lib.form.input("VLAN Priority");
            $input.attr('id', one.f.flows.id.modal.form.vlanPriority);
            var $help = one.lib.form.help("Range: 0 - 7");
            $fieldset.append($label).append($input).append($help);
            if(edit) {
                $input.val(existingFlow.vlanPriority);
            }

            // srcMac
            var $label = one.lib.form.label("Source MAC Address");
            var $input = one.lib.form.input("3c:97:0e:75:c3:f7");
            $input.attr('id', one.f.flows.id.modal.form.srcMac);
            $fieldset.append($label).append($input);
            if(edit) {
                $input.val(existingFlow.srcMac);
            }
            // dstMac
            var $label = one.lib.form.label("Destination MAC Address");
            var $input = one.lib.form.input("7c:d1:c3:e8:e6:99");
            $input.attr('id', one.f.flows.id.modal.form.dstMac);
            $fieldset.append($label).append($input);
            if(edit) {
                $input.val(existingFlow.dstMac);
            }
            // layer 3
            var $legend = one.lib.form.legend("Layer 3");
            $fieldset.append($legend);

            // srcIp
            var $label = one.lib.form.label("Source IP Address");
            var $input = one.lib.form.input("192.168.3.128");
            $input.attr('id', one.f.flows.id.modal.form.srcIp);
            $fieldset.append($label).append($input);
            if(edit) {
                $input.val(existingFlow.srcIp);
            }
            // dstIp
            var $label = one.lib.form.label("Destination IP Address");
            var $input = one.lib.form.input("2001:2334::0/32");
            $input.attr('id', one.f.flows.id.modal.form.dstIp);
            $fieldset.append($label).append($input);
            if(edit) {
                $input.val(existingFlow.dstIp);
            }
            // tosBits
            var $label = one.lib.form.label("ToS Bits");
            var $input = one.lib.form.input("ToS Bits");
            $input.attr('id', one.f.flows.id.modal.form.tosBits);
            var $help = one.lib.form.help("Range: 0 - 63");
            $fieldset.append($label).append($input).append($help);
            if(edit) {
                $input.val(existingFlow.tosBits);
            }

            // layer 4
            var $legend = one.lib.form.legend("Layer 4");
            $fieldset.append($legend);
            // srcPort
            var $label = one.lib.form.label("Source Port");
            var $input = one.lib.form.input("Source Port");
            $input.attr('id', one.f.flows.id.modal.form.srcPort);
            var $help = one.lib.form.help("Range: 0 - 65535");
            $fieldset.append($label).append($input).append($help);
            if(edit) {
                $input.val(existingFlow.srcPort);
            }
            // dstPort
            var $label = one.lib.form.label("Destination Port");
            var $input = one.lib.form.input("Destination Port");
            $input.attr('id', one.f.flows.id.modal.form.dstPort);
            var $help = one.lib.form.help("Range: 0 - 65535");
            $fieldset.append($label).append($input).append($help);
            if(edit) {
                $input.val(existingFlow.dstPort);
            }
            // protocol
            var $label = one.lib.form.label("Protocol");
            var $input = one.lib.form.input("Protocol");
            $input.attr('id', one.f.flows.id.modal.form.protocol);
            $fieldset.append($label).append($input);
            if(edit) {
                $input.val(existingFlow.protocol);
            }
            // actions
            var $legend = one.lib.form.label("Actions");
            $fieldset.append($legend);
            // actions table
            var tableAttributes = ["table-striped", "table-bordered", "table-condensed", "table-hover", "table-cursor"];
            var $table = one.lib.dashlet.table.table(tableAttributes);
            $table.attr('id', one.f.flows.id.modal.action.table);
            var tableHeaders = ["Action", "Data"];
            var $thead = one.lib.dashlet.table.header(tableHeaders);
            var $tbody = one.lib.dashlet.table.body("", tableHeaders);
            $table.append($thead).append($tbody);
            // actions
            var actions = {
                "" : "Please Select an Action",
                "DROP" : "Drop",
                "LOOPBACK" : "Loopback",
                "FLOOD" : "Flood",
                "SW_PATH" : "Software Path",
                "HW_PATH" : "Hardware Path",
                "CONTROLLER" : "Controller",
                "OUTPUT" : "Add Output Ports",
                "SET_VLAN_ID" : "Set VLAN ID",
                "SET_VLAN_PCP" : "Set VLAN Priority",
                "POP_VLAN" : "Strip VLAN Header",
                "SET_DL_SRC" : "Modify Datalayer Source Address",
                "SET_DL_DST" : "Modify Datalayer Destination Address",
                "SET_NW_SRC" : "Modify Network Source Address",
                "SET_NW_DST" :"Modify Network Destination Address",
                "SET_NW_TOS" : "Modify ToS Bits",
                "SET_TP_SRC" : "Modify Transport Source Port",
                "SET_TP_DST" : "Modify Transport Destination Port"
            };
            var $select = one.lib.form.select.create(actions);
            // when selecting an action
            $select.change(function() {
                var action = $(this).find('option:selected');
                one.f.flows.modal.action.parse(action.attr('value'));
                $select[0].selectedIndex = 0;
            });

            if(edit) {
                $(existingFlow.actions).each(function(index, value){
                    setTimeout(function(){
                        var locEqualTo = value.indexOf("=");
                        if ( locEqualTo == -1 ) {
                            one.f.flows.modal.action.add.add(actions[value], value);
                        } else {
                            var action = value.substr(0,locEqualTo);
                            if( action == "OUTPUT") {
                                var portIds = value.substr(locEqualTo+1).split(",");
                                var ports = [];
                                var allPorts = one.f.flows.registry.nodeports[one.f.flows.registry.currentNode]['ports'];
                                for(var i =0; i < portIds.length ; i++) {
                                    var portName = allPorts[portIds[i]];
                                    ports.push(portName);
                                }
                                one.f.flows.modal.action.add.addPortsToTable(ports.join(", "), portIds.join(","));
                            } else {
                                var val = value.substr(locEqualTo+1);
                                one.f.flows.modal.action.add.addDataToTable(actions[action], val, action)
                            }
                        }
                    }, 1000)
                });
            }
            $fieldset.append($select).append($table);

            // return
            $form.append($fieldset);
            return $form;
        },
        action : {
            parse : function(option) {
                switch (option) {
                    case "OUTPUT" :
                        var h3 = "Add Output Port";
                        var $modal = one.f.flows.modal.action.initialize(h3, one.f.flows.modal.action.body.addOutputPorts, one.f.flows.modal.action.add.addOutputPorts);
                        $modal.modal();
                        break;
                    case "SET_VLAN_ID" :
                        var h3 = "Set VLAN ID";
                        var placeholder = "VLAN Identification Number";
                        var id = one.f.flows.id.modal.action.setVlanId;
                        var help = "Range: 0 - 4095";
                        var action = 'SET_VLAN_ID';
                        var name = "VLAN ID";
                        var body = function() {
                            return one.f.flows.modal.action.body.set(h3, placeholder, id, help);
                        };
                        var add = function($modal) {
                            one.f.flows.modal.action.add.set(name, id, action, $modal);
                        };
                        var $modal = one.f.flows.modal.action.initialize(h3, body, add);
                        $modal.modal();
                        break;
                    case "SET_VLAN_PCP" :
                        var h3 = "Set VLAN Priority";
                        var placeholder = "VLAN Priority";
                        var id = one.f.flows.id.modal.action.setVlanPriority;
                        var help = "Range: 0 - 7";
                        var action = 'SET_VLAN_PCP';
                        var name = "VLAN Priority";
                        var body = function() {
                            return one.f.flows.modal.action.body.set(h3, placeholder, id, help);
                        };
                        var add = function($modal) {
                            one.f.flows.modal.action.add.set(name, id, action, $modal);
                        };
                        var $modal = one.f.flows.modal.action.initialize(h3, body, add);
                        $modal.modal();
                        break;
                    case "POP_VLAN" :
                        var name = "Strip VLAN Header";
                        var action = 'POP_VLAN';
                        one.f.flows.modal.action.add.add(name, action);
                        break;
                    case "SET_DL_SRC" :
                        var h3 = "Set Source MAC Address";
                        var placeholder = "Source MAC Address";
                        var id = one.f.flows.id.modal.action.modifyDatalayerSourceAddress;
                        var help = "Example: 00:11:22:aa:bb:cc";
                        var action = 'SET_DL_SRC';
                        var name = "Source MAC";
                        var body = function() {
                            return one.f.flows.modal.action.body.set(h3, placeholder, id, help);
                        };
                        var add = function($modal) {
                            one.f.flows.modal.action.add.set(name, id, action, $modal);
                        };
                        var $modal = one.f.flows.modal.action.initialize(h3, body, add);
                        $modal.modal();
                        break;
                    case "SET_DL_DST" :
                        var h3 = "Set Destination MAC Address";
                        var placeholder = "Destination MAC Address";
                        var id = one.f.flows.id.modal.action.modifyDatalayerDestinationAddress;
                        var help = "Example: 00:11:22:aa:bb:cc";
                        var action = 'SET_DL_DST';
                        var name = "Destination MAC";
                        var body = function() {
                            return one.f.flows.modal.action.body.set(h3, placeholder, id, help);
                        };
                        var add = function($modal) {
                            one.f.flows.modal.action.add.set(name, id, action, $modal);
                        };
                        var $modal = one.f.flows.modal.action.initialize(h3, body, add);
                        $modal.modal();
                        break;
                    case "SET_NW_SRC" :
                        var h3 = "Set IP Source Address";
                        var placeholder = "Source IP Address";
                        var id = one.f.flows.id.modal.action.modifyNetworkSourceAddress;
                        var help = "Example: 127.0.0.1";
                        var action = 'SET_NW_SRC';
                        var name = "Source IP";
                        var body = function() {
                            return one.f.flows.modal.action.body.set(h3, placeholder, id, help);
                        };
                        var add = function($modal) {
                            one.f.flows.modal.action.add.set(name, id, action, $modal);
                        };
                        var $modal = one.f.flows.modal.action.initialize(h3, body, add);
                        $modal.modal();
                        break;
                    case "SET_NW_DST" :
                        var h3 = "Set IP Destination Address";
                        var placeholder = "Destination IP Address";
                        var id = one.f.flows.id.modal.action.modifyNetworkDestinationAddress;
                        var help = "Example: 127.0.0.1";
                        var action = 'SET_NW_DST';
                        var name = "Destination IP";
                        var body = function() {
                            return one.f.flows.modal.action.body.set(h3, placeholder, id, help);
                        };
                        var add = function($modal) {
                            one.f.flows.modal.action.add.set(name, id, action, $modal);
                        };
                        var $modal = one.f.flows.modal.action.initialize(h3, body, add);
                        $modal.modal();
                        break;
                    case "SET_NW_TOS" :
                        var h3 = "Set IPv4 ToS";
                        var placeholder = "IPv4 ToS";
                        var id = one.f.flows.id.modal.action.modifyTosBits;
                        var help = "Range: 0 - 63";
                        var action = 'SET_NW_TOS';
                        var name = "ToS Bits";
                        var body = function() {
                            return one.f.flows.modal.action.body.set(h3, placeholder, id, help);
                        };
                        var add = function($modal) {
                            one.f.flows.modal.action.add.set(name, id, action, $modal);
                        };
                        var $modal = one.f.flows.modal.action.initialize(h3, body, add);
                        $modal.modal();
                        break;
                    case "SET_TP_SRC" :
                        var h3 = "Set Transport Source Port";
                        var placeholder = "Transport Source Port";
                        var id = one.f.flows.id.modal.action.modifyTransportSourcePort;
                        var help = "Range: 1 - 65535";
                        var action = 'SET_TP_SRC';
                        var name = "Source Port";
                        var body = function() {
                            return one.f.flows.modal.action.body.set(h3, placeholder, id, help);
                        };
                        var add = function($modal) {
                            one.f.flows.modal.action.add.set(name, id, action, $modal);
                        };
                        var $modal = one.f.flows.modal.action.initialize(h3, body, add);
                        $modal.modal();
                        break;
                    case "SET_TP_DST" :
                        var h3 = "Set Transport Destination Port";
                        var placeholder = "Transport Destination Port";
                        var id = one.f.flows.id.modal.action.modifyTransportDestinationPort;
                        var help = "Range: 1 - 65535";
                        var action = 'SET_TP_DST';
                        var name = "Destination Port";
                        var body = function() {
                            return one.f.flows.modal.action.body.set(h3, placeholder, id, help);
                        };
                        var add = function($modal) {
                            one.f.flows.modal.action.add.set(name, id, action, $modal);
                        };
                        var $modal = one.f.flows.modal.action.initialize(h3, body, add);
                        $modal.modal();
                        break;
                    case "DROP" :
                        var name = "Drop";
                        var action = 'DROP';
                        one.f.flows.modal.action.add.add(name, action);
                        break;
                    case "LOOPBACK" :
                        var name = "Loopback";
                        var action = 'LOOPBACK';
                        one.f.flows.modal.action.add.add(name, action);
                        break;
                    case "FLOOD" :
                        var name = "Flood";
                        var action = 'FLOOD';
                        one.f.flows.modal.action.add.add(name, action);
                        break;
                    case "SW_PATH" :
                        var name = "Software Path";
                        var action = 'SW_PATH';
                        one.f.flows.modal.action.add.add(name, action);
                        break;
                    case "HW_PATH" :
                        var name = "Hardware Path";
                        var action = 'HW_PATH';
                        one.f.flows.modal.action.add.add(name, action);
                        break;
                    case "CONTROLLER" :
                        var name = "Controller";
                        var action = 'CONTROLLER';
                        one.f.flows.modal.action.add.add(name, action);
                        break;
                }
            },
            initialize : function(h3, bodyCallback, addCallback) {
                var footer = one.f.flows.modal.action.footer();
                var $body = bodyCallback();
                var $modal = one.lib.modal.spawn(one.f.flows.id.modal.action.modal, h3, $body, footer);
                // bind close button
                $('#'+one.f.flows.id.modal.action.close, $modal).click(function() {
                    $modal.modal('hide');
                });
                // bind add flow button
                $('#'+one.f.flows.id.modal.action.add, $modal).click(function() {
                    addCallback($modal);
                });
                return $modal;
            },
            add : {
                addOutputPorts : function($modal) {
                    var $options = $('#'+one.f.flows.id.modal.action.addOutputPorts).find('option:selected');
                    var ports = '';
                    var pid = '';
                    $options.each(function(index, value) {
                        ports = ports+$(value).text()+", ";
                        pid = pid+$(value).attr('value')+",";
                    });
                    ports = ports.slice(0,-2);
                    pid = pid.slice(0,-1);
                    one.f.flows.modal.action.add.addPortsToTable(ports, pid);
                    $modal.modal('hide');
                },
                addPortsToTable : function(ports, pid){
                    var $tr = one.f.flows.modal.action.table.add("Add Output Ports", ports);
                    $tr.attr('id', 'OUTPUT');
                    $tr.data('action', 'OUTPUT='+pid);
                    $tr.click(function() {
                        one.f.flows.modal.action.add.modal.initialize(this);
                    });
                    one.f.flows.modal.action.table.append($tr);
                },
                add : function(name, action) {
                    var $tr = one.f.flows.modal.action.table.add(name);
                    $tr.attr('id', action);
                    $tr.data('action', action);
                    $tr.click(function() {
                        one.f.flows.modal.action.add.modal.initialize(this);
                    });
                    one.f.flows.modal.action.table.append($tr);
                },
                set : function(name, id, action, $modal) {
                    var $input = $('#'+id);
                    var value = $input.val();
                    one.f.flows.modal.action.add.addDataToTable(name,value,action)
                    $modal.modal('hide');
                },
                addDataToTable : function(name,value,action) {
                    var $tr = one.f.flows.modal.action.table.add(name, value);
                    $tr.attr('id', action);
                    $tr.data('action', action+'='+value);
                    $tr.click(function() {
                        one.f.flows.modal.action.add.modal.initialize(this);
                    });
                    one.f.flows.modal.action.table.append($tr);
                },
                remove : function(that) {
                    $(that).remove();
                    var $table = $('#'+one.f.flows.id.modal.action.table);
                    if ($table.find('tbody').find('tr').size() == 0) {
                        var $tr = $(document.createElement('tr'));
                        var $td = $(document.createElement('td'));
                        $td.attr('colspan', '3');
                        $tr.addClass('empty');
                        $td.text('No data available');
                        $tr.append($td);
                        $table.find('tbody').append($tr);
                    }
                },
                modal : {
                    initialize : function(that) {
                        var h3 = "Remove Action";
                        var footer = one.f.flows.modal.action.add.modal.footer();
                        var $body = one.f.flows.modal.action.add.modal.body();
                        var $modal = one.lib.modal.spawn(one.f.flows.id.modal.action.modal.modal, h3, $body, footer);

                        // bind cancel button
                        $('#'+one.f.flows.id.modal.action.modal.cancel, $modal).click(function() {
                            $modal.modal('hide');
                        });

                        // bind remove button
                        $('#'+one.f.flows.id.modal.action.modal.remove, $modal).click(function() {
                            one.f.flows.modal.action.add.remove(that);
                            $modal.modal('hide');
                        });

                        $modal.modal();
                    },
                    body : function() {
                        var $p = $(document.createElement('p'));
                        $p.append("Remove this action?");
                        return $p;
                    },
                    footer : function() {
                        var footer = [];

                        var removeButton = one.lib.dashlet.button.single("Remove Action", one.f.flows.id.modal.action.modal.remove, "btn-danger", "");
                        var $removeButton = one.lib.dashlet.button.button(removeButton);
                        footer.push($removeButton);

                        var cancelButton = one.lib.dashlet.button.single("Cancel", one.f.flows.id.modal.action.modal.cancel, "", "");
                        var $cancelButton = one.lib.dashlet.button.button(cancelButton);
                        footer.push($cancelButton);

                        return footer;
                    }
                }
            },
            table : {
                add : function(action, data) {
                    var $tr = $(document.createElement('tr'));
                    var $td = $(document.createElement('td'));
                    $td.append(action);
                    $tr.append($td);
                    var $td = $(document.createElement('td'));
                    if (data != undefined) $td.append(data);
                    $tr.append($td);
                    return $tr;
                },
                append : function($tr) {
                    var $table = $('#'+one.f.flows.id.modal.action.table);
                    var $empty = $table.find('.empty').parent();
                    if ($empty.size() > 0) $empty.remove();
                    $table.append($tr);
                }
            },
            body : {
                common : function() {
                    var $form = $(document.createElement('form'));
                    var $fieldset = $(document.createElement('fieldset'));
                    return [$form, $fieldset];
                },
                addOutputPorts : function() {
                    var common = one.f.flows.modal.action.body.common();
                    var $form = common[0];
                    var $fieldset = common[1];
                    // output port
                    $label = one.lib.form.label("Select Output Ports");
                    if (one.f.flows.registry.currentNode == undefined){
                        return; //Selecting Output ports without selecting node throws an exception
                    }
                    var ports = one.f.flows.registry.nodeports[one.f.flows.registry.currentNode]['ports'];
                    $select = one.lib.form.select.create(ports, true);
                    $select.attr('id', one.f.flows.id.modal.action.addOutputPorts);
                    $fieldset.append($label).append($select);
                    $form.append($fieldset);
                    return $form;
                },
                set : function(label, placeholder, id, help) {
                    var common = one.f.flows.modal.action.body.common();
                    var $form = common[0];
                    var $fieldset = common[1];
                    // input
                    $label = one.lib.form.label(label);
                    $input = one.lib.form.input(placeholder);
                    $input.attr('id', id);
                    $help = one.lib.form.help(help);
                    // append
                    $fieldset.append($label).append($input).append($help);
                    $form.append($fieldset);
                    return $form;
                }
            },
            footer : function() {
                var footer = [];
                var addButton = one.lib.dashlet.button.single("Add Action", one.f.flows.id.modal.action.add, "btn-primary", "");
                var $addButton = one.lib.dashlet.button.button(addButton);
                footer.push($addButton);

                var closeButton = one.lib.dashlet.button.single("Close", one.f.flows.id.modal.action.close, "", "");
                var $closeButton = one.lib.dashlet.button.button(closeButton);
                footer.push($closeButton);

                return footer;
            }
        },
        footer : function() {
            var footer = [];

            var installButton = one.lib.dashlet.button.single("Install Flow", one.f.flows.id.modal.install, "btn-success", "");
            var $installButton = one.lib.dashlet.button.button(installButton);
            footer.push($installButton);

            var addButton = one.lib.dashlet.button.single("Save Flow", one.f.flows.id.modal.add, "btn-primary", "");
            var $addButton = one.lib.dashlet.button.button(addButton);
            footer.push($addButton);

            var closeButton = one.lib.dashlet.button.single("Close", one.f.flows.id.modal.close, "", "");
            var $closeButton = one.lib.dashlet.button.button(closeButton);
            footer.push($closeButton);

            return footer;
        },
        footerEdit : function() {
            var footer = [];

            var editButton = one.lib.dashlet.button.single("Save Flow", one.f.flows.id.modal.edit, "btn-success", "");
            var $editButton = one.lib.dashlet.button.button(editButton);
            footer.push($editButton);

            var closeButton = one.lib.dashlet.button.single("Close", one.f.flows.id.modal.close, "", "");
            var $closeButton = one.lib.dashlet.button.button(closeButton);
            footer.push($closeButton);

            return footer;
        },
        removeMultiple: {
            dialog: function(flows) {
                var h3 = 'Remove Flow Entry';
                var flowList = [];
                for (var i = 0; i < flows.length; i++) {
                    flowList.push(flows[i]["name"]);
                }
                var footer = one.f.flows.modal.removeMultiple.footer();
                var $body = one.f.flows.modal.removeMultiple.body(flowList);
                var $modal = one.lib.modal.spawn(one.f.flows.id.modal.dialog.modal, h3, $body, footer);

                // bind close button
                $('#'+one.f.flows.id.modal.dialog.close, $modal).click(function() {
                    $modal.modal('hide');
                });

                // bind remove rule button
                $('#'+one.f.flows.id.modal.dialog.remove, $modal).click(this, function(e) {
                    var resource = {};
                    resource['body'] = JSON.stringify(flows);

                    $.post(one.f.address.root+one.f.address.flows.deleteFlows, resource, function(response) {
                        $modal.modal('hide');
                        if(response == "Success") {
                            one.lib.alert("Flow Entry(s) successfully removed");
                        } else {
                            one.lib.alert(response);
                        }
                        one.main.dashlet.right.bottom.empty();
                        one.f.detail.dashlet(one.main.dashlet.right.bottom);
                        one.main.dashlet.left.top.empty();
                        one.f.flows.dashlet(one.main.dashlet.left.top);
                    });
                });
                $modal.modal();
            },
            footer : function() {
                var footer = [];
                var remove = one.lib.dashlet.button.single('Remove Flow Entry',one.f.flows.id.modal.dialog.remove, 'btn-danger', '');
                var $remove = one.lib.dashlet.button.button(remove);
                footer.push($remove);

                var cancel = one.lib.dashlet.button.single('Cancel', one.f.flows.id.modal.dialog.close, '', '');
                var $cancel = one.lib.dashlet.button.button(cancel);
                footer.push($cancel);

                return footer;
            },
            body : function (flows) {
                var $p = $(document.createElement('p'));
                var p = 'Remove the following Flow Entry(s)?';
                //creata a BS label for each rule and append to list
                $(flows).each(function(){
                    var $span = $(document.createElement('span'));
                    $span.append(this);
                    p += '<br/>' + $span[0].outerHTML;
                });
                $p.append(p);
                return $p;
            }
        }
    },
    ajax : {
        dashlet : function(callback) {
            $.getJSON(one.f.address.root+one.f.address.flows.main, function(data) {
                one.f.flows.registry['flows'] = data.flows;
                one.f.flows.registry['privilege'] = data.privilege;
                one.f.flows.modal.ajax.nodes(function(){/*Empty function. Do nothing. */})

                callback(data);
            });
        }
    },
    data : {
        flowsDataGrid: function(data) {
            var source = new StaticDataSource({
                    columns: [
                        {
                            property: 'selector',
                            label: "<input type='checkbox' id='"+one.f.flows.id.dashlet.datagrid.selectAllFlows+"'/>",
                            sortable: false
                        },
                        {
                            property: 'name',
                            label: 'Flow Name',
                            sortable: true
                        },
                        {
                            property: 'node',
                            label: 'Node',
                            sortable: true
                        }
                    ],
                    data: data.flows,
                    formatter: function(items) {
                        $.each(items, function(index, item) {
                            var $checkbox = document.createElement("input");
                            $checkbox.setAttribute("type", "checkbox");
                            $checkbox.setAttribute("name", item.name);
                            $checkbox.setAttribute("node", item.nodeId);
                            $checkbox.setAttribute('class','flowEntry')
                            item.selector = $checkbox.outerHTML;
                                  item["name"] = '<span data-installInHw=' + item["flow"]["installInHw"] + 
                                ' data-flowstatus=' + item["flow"]["status"] + 
                                ' data-nodeId=' + item["nodeId"] + '>' + item["name"] + '</span>';
                        });

                    },
                    delay: 0
                });
            return source;
        },
        dashlet : function(data) {
            var body = [];
            $(data).each(function(index, value) {
                var tr = {};
                var entry = [];

                
                entry.push(value['name']);
                entry.push(value['node']);
                if (value['flow']['installInHw'] == 'true' && value['flow']['status'] == 'Success')
                    tr['type'] = ['success'];
                else if (value['flow']['installInHw'] == 'false' && value['flow']['status'] == 'Success')
                    tr['type'] = ['warning'];
                else 
                    tr['type'] = ['warning'];
                tr['entry'] = entry;
                tr['id'] = value['nodeId'];

                body.push(tr);
            });
            return body;
        }
    },
    body : {
        dashlet : function(body, callback) {
            var attributes = ['table-striped', 'table-bordered', 'table-hover', 'table-condensed', 'table-cursor'];
            var $table = one.lib.dashlet.table.table(attributes);

            var headers = ['Flow Name', 'Node'];
                
            var $thead = one.lib.dashlet.table.header(headers);
            $table.append($thead);

            var $tbody = one.lib.dashlet.table.body(body);
            $table.append($tbody);
            return $table;
        }
    }
}

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

one.f.populate = function($dashlet, header) {
    var $h4 = one.lib.dashlet.header(header);
    $dashlet.append($h4);
};

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
        case menu.flows.id:
            one.f.flows.dashlet($dashlet);
            break;
        case menu.nodes.id:
            one.f.nodes.dashlet($dashlet);
            break;
        case menu.detail.id:
            one.f.detail.dashlet($dashlet);
            break;
    };
});

// activate first tab on each dashlet
$('.dash .nav').each(function(index, value) {
    $($(value).find('li')[0]).find('a').click();
});

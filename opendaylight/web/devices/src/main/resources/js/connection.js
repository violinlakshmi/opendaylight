define([ 'datasource' ], function(StaticDataSource) {
  var connection = {
    id : { // one.f.connection.id
      datagrid : 'one-f-connection-id-datagrid',
      add : 'one-f-connection-id-add'
    },
    dashlet : function($dashlet) {
      one.lib.dashlet.empty($dashlet);
      // heading
      $dashlet.append(one.lib.dashlet.header(one.f.dashlet.connection.name));
      // add button
      var add = one.lib.dashlet.button.single('Add Node', one.f.connection.id.add, 'btn-primary',
          'btn-mini');
      var $add = one.lib.dashlet.button.button(add);
      $add.click(function() {
        one.f.connection.add.initialize();
      });
      $dashlet.append($add);
      // load table
      var url = one.f.switchmanager.rootUrl + '/connect/nodes';
      $.getJSON(url, function(data) {
        var $gridHTML = one.lib.dashlet.datagrid.init(one.f.connection.id.datagrid, {
          searchable : true,
          filterable : false,
          pagination : true,
          flexibleRowsPerPage : true
        }, 'table-striped table-condensed table-cursor');
        $dashlet.append($gridHTML);
        var dataSource = one.f.connection.data(data);
        $('#' + one.f.connection.id.datagrid, $dashlet).datagrid({
          dataSource : dataSource
        }).on('loaded', function() {
          $(this).find('tbody tr').click(function() {
            var nodeId = $(this).find('.nodeId').text();
            var nodeType = $(this).find('.nodeType').text();
            var nodeName = $(this).find('.nodeName').text();
            one.f.connection.remove.initialize(nodeId, nodeName, nodeType);
          });
        });
      });
    },
    data : function(data) {
      var source = new StaticDataSource({
        columns : [ {
          property : 'nodeName',
          label : 'Node',
          sortable : true
        } ],
        data : data,
        formatter : function(items) {
          $.each(items,
              function(index, item) {
                var $nodeId = $(document.createElement('span'));
                $nodeId.css('display', 'none');
                var $nodeType = $nodeId.clone();
                var $nodeName = $nodeId.clone();
                $nodeId.append(item.nodeId).addClass('nodeId');
                $nodeType.append(item.nodeType).addClass('nodeType');
                $nodeName.append(item.nodeName).addClass('nodeName');
                item.nodeName += $nodeId[0].outerHTML + $nodeType[0].outerHTML
                    + $nodeName[0].outerHTML;
              });
        },
        delay : 0
      });
      return source;
    },
    add : {
      id : { // one.f.connection.add.id
        modal : 'one-f-connection-add-id-modal',
        add : 'one-f-connection-add-id-add',
        cancel : 'one-f-connection-add-id-cancel',
        form : {
          nodeId : 'one-f-connection-add-id-form-nodeId',
          ipAddress : 'one-f-connection-add-id-form-ipAddress',
          port : 'one-f-connection-add-id-form-port',
          nodeType : 'one-f-connection-add-id-form-nodeType'
        }
      },
      initialize : function() {
        var h3 = 'Add Node';
        var footer = one.f.connection.add.footer();
        var $body = one.f.connection.add.body();
        ;
        var $modal = one.lib.modal.spawn(one.f.connection.add.id.modal, h3, $body, footer);
        // bind add buton
        $('#' + one.f.connection.add.id.add, $modal).click(function() {
          var nodeId = $('#' + one.f.connection.add.id.form.nodeId, $modal).val();
          if (nodeId === '') {
            alert('Please enter a node ID');
            return false;
          }
          var resources = {};
          resources.ipAddress = $('#' + one.f.connection.add.id.form.ipAddress, $modal).val();
          if (resources.ipAddress === '') {
            alert('Please enter an IP Address');
            return false;
          }
          resources.port = $('#' + one.f.connection.add.id.form.port, $modal).val();
          if (resources.port === '') {
            alert('Please enter a port');
            return false;
          }
          var nodeType = $('#' + one.f.connection.add.id.form.nodeType, $modal).val();
          if (nodeType !== '') {
            resources.nodeType = nodeType;
          }
          var url = one.f.switchmanager.rootUrl + '/connect/' + encodeURI(nodeId);
          $.post(url, resources, function(result) {
            if (result.success === true) {
              $modal.modal('hide');
              one.lib.alert(result.description);
            } else {
              alert(result.code + ': ' + result.description);
            }
          });
        });
        // bind cancel button
        $('#' + one.f.connection.add.id.cancel, $modal).click(function() {
          $modal.modal('hide');
        });
        $modal.modal();
      },
      body : function() {
        var $form = $(document.createElement('form'));
        var $fieldset = $(document.createElement('fieldset'));
        // node id
        var $label = one.lib.form.label('Node ID');
        var $input = one.lib.form.input('Node ID');
        $input.attr('id', one.f.connection.add.id.form.nodeId);
        $fieldset.append($label).append($input);
        // ip address
        $label = one.lib.form.label('IP Address');
        $input = one.lib.form.input('IP Address');
        $input.attr('id', one.f.connection.add.id.form.ipAddress);
        $fieldset.append($label).append($input);
        // port
        $label = one.lib.form.label('Port');
        $input = one.lib.form.input('Port');
        $input.attr('id', one.f.connection.add.id.form.port);
        var $help = one.lib.form.help('Enter a number');
        $fieldset.append($label).append($input).append($help);
        // node type
        $label = one.lib.form.label('Node Type');
        $input = one.lib.form.input('Node Type');
        $input.attr('id', one.f.connection.add.id.form.nodeType);
        $help = one.lib.form.help('Optional');
        $fieldset.append($label).append($input).append($help);
        $form.append($fieldset);
        return $form;
      },
      footer : function() {
        var footer = [];
        var add = one.lib.dashlet.button.single('Submit', one.f.connection.add.id.add,
            'btn-primary', '');
        var $add = one.lib.dashlet.button.button(add);
        footer.push($add);
        var cancel = one.lib.dashlet.button
            .single('Cancel', one.f.connection.add.id.cancel, '', '');
        var $cancel = one.lib.dashlet.button.button(cancel);
        footer.push($cancel);
        return footer;
      }
    },
    remove : {
      id : { // one.f.connection.remove.id
        modal : 'one-f-connection-remove-id-modal',
        remove : 'one-f-connection-remove-id-remove',
        cancel : 'one-f-connection-remove-id-cancel'
      },
      initialize : function(nodeId, nodeName, nodeType) {
        var h3 = 'Remove Node';
        var footer = one.f.connection.remove.footer();
        var $body = one.f.connection.remove.body(nodeName);
        var $modal = one.lib.modal.spawn(one.f.connection.remove.id.modal, h3, $body, footer);
        // bind remove buton
        $('#' + one.f.connection.remove.id.remove, $modal).click(function() {
          var resources = {};
          resources.nodeType = nodeType;
          var url = one.f.switchmanager.rootUrl + '/disconnect/' + encodeURI(nodeId);
          $.post(url, resources, function(result) {
            if (result.success === true) {
              $modal.modal('hide');
              one.lib.alert(result.description);
            } else {
              alert(result.code + ': ' + result.description);
            }
          }).fail(function() {
            debugger;
          });
        });
        // bind cancel button
        $('#' + one.f.connection.remove.id.cancel, $modal).click(function() {
          $modal.modal('hide');
        });
        $modal.modal();
      },
      body : function(nodeName) {
        var $p = $(document.createElement('p'));
        $p.append('Remove the following node? ');
        var $span = $(document.createElement('span'));
        $span.addClass('label label-info');
        $span.append(nodeName);
        $p.append($span[0].outerHTML);
        return $p;
      },
      footer : function() {
        var footer = [];
        var remove = one.lib.dashlet.button.single('Remove', one.f.connection.remove.id.remove,
            'btn-danger', '');
        var $remove = one.lib.dashlet.button.button(remove);
        footer.push($remove);
        var cancel = one.lib.dashlet.button.single('Cancel', one.f.connection.remove.id.cancel, '',
            '');
        var $cancel = one.lib.dashlet.button.button(cancel);
        footer.push($cancel);
        return footer;
      }
    }
  } // end connection module
  return connection;
}); // end define function

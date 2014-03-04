define([ 'datasource' ], function(StaticDataSource) {
  var staticRoute = {
    id : {
      dashlet : {
        add : "one_f_switchmanager_staticRouteConfig_id_dashlet_add",
        remove : "one_f_switchmanager_staticRouteConfig_id_dashlet_remove",
        datagrid : "one_f_switchmanager_staticRouteConfig_id_dashlet_datagrid",
        selectAll : "one_f_switchmanager_staticRouteConfig_id_dashlet_selectAll"
      },
      modal : {
        modal : "one_f_switchmanager_staticRouteConfig_id_modal_modal",
        save : "one_f_switchmanager_staticRouteConfig_id_modal_save",
        cancel : "one_f_switchmanager_staticRouteConfig_id_modal_cancel",
        remove : "one_f_switchmanager_staticRouteConfig_id_modal_remove",
        form : {
          routeName : "one_f_switchmanager_staticRouteConfig_id_modal_form_routename",
          staticRoute : "one_f_switchmanager_staticRouteConfig_id_modal_form_staticroute",
          nextHop : "one_f_switchmanager_staticRouteConfig_id_modal_form_nexthop",
        }
      }
    },
    dashlet : function($dashlet) {
      one.lib.dashlet.empty($dashlet);
      var url = one.f.switchmanager.rootUrl + "/staticRoutes";
      one.f.switchmanager.staticRouteConfig.ajax.main(url, {}, function(content) {

        if (content.privilege === 'WRITE') {
          // Add static route button
          var button = one.lib.dashlet.button.single("Add Static Route",
              one.f.switchmanager.staticRouteConfig.id.dashlet.add, "btn-primary", "btn-mini");
          var $button = one.lib.dashlet.button.button(button);
          $button.click(function() {
            var $modal = one.f.switchmanager.staticRouteConfig.modal.initialize();
            $modal.modal();
          });
          $dashlet.append(one.lib.dashlet.header(one.f.dashlet.staticRouteConfig.name));
          $dashlet.append($button);

          // Delete static route button
          var button = one.lib.dashlet.button.single("Remove Static Route",
              one.f.switchmanager.staticRouteConfig.id.dashlet.remove, "btn-danger", "btn-mini");
          var $button = one.lib.dashlet.button.button(button);
          $button.click(function() {
            var routesToDelete = [];
            var checkedCheckBoxes = $(
                "#" + one.f.switchmanager.staticRouteConfig.id.dashlet.datagrid).find(
                "tbody input:checked");
            checkedCheckBoxes.each(function(index, value) {
              routesToDelete.push(checkedCheckBoxes[index].id);
            });
            if (checkedCheckBoxes.size() === 0) {
              return false;
            }
            one.f.switchmanager.staticRouteConfig.modal.removeMultiple.dialog(routesToDelete);
          });
          $dashlet.append($button);
        }
        var $gridHTML = one.lib.dashlet.datagrid.init(
            one.f.switchmanager.staticRouteConfig.id.dashlet.datagrid, {
              searchable : true,
              filterable : false,
              pagination : true,
              flexibleRowsPerPage : true
            }, "table-striped table-condensed");
        $dashlet.append($gridHTML);
        var dataSource = one.f.switchmanager.staticRouteConfig.data.staticRouteConfigGrid(content);
        $("#" + one.f.switchmanager.staticRouteConfig.id.dashlet.datagrid).datagrid({
          dataSource : dataSource
        }).on(
            "loaded",
            function() {
              $("#" + one.f.switchmanager.staticRouteConfig.id.dashlet.selectAll).click(
                  function() {
                    $("#" + one.f.switchmanager.staticRouteConfig.id.dashlet.datagrid).find(
                        ':checkbox').prop(
                        'checked',
                        $("#" + one.f.switchmanager.staticRouteConfig.id.dashlet.selectAll).is(
                            ':checked'));
                  });
              $(".staticRoute").click(
                  function(e) {
                    if (!$('.staticRoute[type=checkbox]:not(:checked)').length) {
                      $("#" + one.f.switchmanager.staticRouteConfig.id.dashlet.selectAll).prop(
                          "checked", true);
                    } else {
                      $("#" + one.f.switchmanager.staticRouteConfig.id.dashlet.selectAll).prop(
                          "checked", false);
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
        var h3 = "Add Static Route";
        var footer = one.f.switchmanager.staticRouteConfig.modal.footer();
        var $modal = one.lib.modal.spawn(one.f.switchmanager.staticRouteConfig.id.modal.modal, h3,
            "", footer);
        // bind save button
        $('#' + one.f.switchmanager.staticRouteConfig.id.modal.save, $modal).click(function() {
          one.f.switchmanager.staticRouteConfig.modal.save($modal);
        });
        var $body = one.f.switchmanager.staticRouteConfig.modal.body();
        one.lib.modal.inject.body($modal, $body);
        return $modal;
      },
      save : function($modal) {
        var result = {};
        result['routeName'] = $(
            '#' + one.f.switchmanager.staticRouteConfig.id.modal.form.routeName, $modal).val();
        result['staticRoute'] = $(
            '#' + one.f.switchmanager.staticRouteConfig.id.modal.form.staticRoute, $modal).val();
        result['nextHop'] = $('#' + one.f.switchmanager.staticRouteConfig.id.modal.form.nextHop,
            $modal).val();
        one.f.switchmanager.staticRouteConfig.modal.ajax.staticRouteConfig(result, function(
            response) {
          if (response.status == true) {
            $modal.modal('hide');
            // refresh dashlet by passing dashlet div as param
            one.f.switchmanager.staticRouteConfig.dashlet($("#left-bottom .dashlet"));
          } else {
            // TODO: Show error message in a error message label instead.
            alert(response.message);
          }
        });
      },
      body : function() {
        var $form = $(document.createElement('form'));
        var $fieldset = $(document.createElement('fieldset'));
        // static route name
        var $label = one.lib.form.label("Name");
        var $input = one.lib.form.input("Name");
        $input.attr('id', one.f.switchmanager.staticRouteConfig.id.modal.form.routeName);
        $fieldset.append($label).append($input);
        // static route IP Mask
        var $label = one.lib.form.label("Static Route");
        var $input = one.lib.form.input("Static Route");
        var $help = one.lib.form.help('Example: 53.55.0.0/16');
        $input.attr('id', one.f.switchmanager.staticRouteConfig.id.modal.form.staticRoute);
        $fieldset.append($label).append($input).append($help);
        // static route IP Mask
        var $label = one.lib.form.label("Next Hop");
        var $input = one.lib.form.input("Next Hop");
        var $help = one.lib.form.help('Example: 192.168.10.254');
        $input.attr('id', one.f.switchmanager.staticRouteConfig.id.modal.form.nextHop);
        $fieldset.append($label).append($input).append($help);
        // return
        $form.append($fieldset);
        return $form;
      },
      ajax : {
        staticRouteConfig : function(requestData, callback) {
          $.getJSON(one.f.switchmanager.rootUrl + "/staticRoute/add", requestData, function(data) {
            callback(data);
          });
        }
      },
      data : {

      },
      footer : function() {
        var footer = [];
        var saveButton = one.lib.dashlet.button.single("Save",
            one.f.switchmanager.staticRouteConfig.id.modal.save, "btn-primary", "");
        var $saveButton = one.lib.dashlet.button.button(saveButton);
        footer.push($saveButton);
        return footer;
      },
      removeMultiple : {
        dialog : function(routesToDelete) {
          var h3 = 'Remove Static Route';

          var footer = one.f.switchmanager.staticRouteConfig.modal.removeMultiple.footer();
          var $body = one.f.switchmanager.staticRouteConfig.modal.removeMultiple
              .body(routesToDelete);
          var $modal = one.lib.modal.spawn(one.f.switchmanager.staticRouteConfig.id.modal.modal,
              h3, $body, footer);

          // bind close button
          $('#' + one.f.switchmanager.staticRouteConfig.id.modal.cancel, $modal).click(function() {
            $modal.modal('hide');
          });

          // bind remove rule button
          $('#' + one.f.switchmanager.staticRouteConfig.id.modal.remove, $modal).click(
              this,
              function(e) {
                if (routesToDelete.length > 0) {
                  var requestData = {};
                  requestData["routesToDelete"] = routesToDelete.toString();
                  var url = one.f.switchmanager.rootUrl + "/staticRoute/delete";
                  one.f.switchmanager.staticRouteConfig.ajax.main(url, requestData, function(
                      response) {
                    $modal.modal('hide');
                    if (response.status == true) {
                      // refresh dashlet by passing dashlet div as param
                      one.lib.alert("Static Route(s) successfully removed");
                    } else {
                      alert(response.message);
                    }
                    one.f.switchmanager.staticRouteConfig.dashlet($("#left-bottom .dashlet"));
                  });
                }
              });
          $modal.modal();
        },
        footer : function() {
          var footer = [];
          var remove = one.lib.dashlet.button.single('Remove Static Route',
              one.f.switchmanager.staticRouteConfig.id.modal.remove, 'btn-danger', '');
          var $remove = one.lib.dashlet.button.button(remove);
          footer.push($remove);

          var cancel = one.lib.dashlet.button.single('Cancel',
              one.f.switchmanager.staticRouteConfig.id.modal.cancel, '', '');
          var $cancel = one.lib.dashlet.button.button(cancel);
          footer.push($cancel);

          return footer;
        },
        body : function(staticRouteList) {
          var $p = $(document.createElement('p'));
          var p = 'Remove the following Static Route(s)?';
          // creata a BS label for each rule and append to list
          $(staticRouteList).each(function() {
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
      staticRouteConfigGrid : function(data) {
        var source = new StaticDataSource({
          columns : [
              {
                property : 'selector',
                label : "<input type='checkbox'  id='"
                    + one.f.switchmanager.staticRouteConfig.id.dashlet.selectAll + "'/>",
                sortable : false
              }, {
                property : 'name',
                label : 'Name',
                sortable : true
              }, {
                property : 'staticRoute',
                label : 'Static Route',
                sortable : true
              }, {
                property : 'nextHop',
                label : 'Next Hop Address',
                sortable : true
              } ],
          data : data.nodeData,
          formatter : function(items) {
            $.each(items, function(index, item) {
              item["selector"] = '<input type="checkbox" class="staticRoute" id="' + item["name"]
                  + '"></input>';
            });
          },
          delay : 0
        });
        return source;
      },
      staticRouteConfig : function(data) {
        var result = [];
        $.each(data.nodeData, function(key, value) {
          var tr = {};
          // fill up all the td's
          var entry = [];
          var checkbox = document.createElement("input");
          checkbox.setAttribute("type", "checkbox");
          checkbox.setAttribute("id", value["name"]);
          entry.push(checkbox);
          entry.push(value["name"]);
          entry.push(value["staticRoute"]);
          entry.push(value["nextHop"]);
          tr.entry = entry;
          result.push(tr);
        });
        return result;
      }
    }
  } // end staticroute module
  return staticRoute;
}); // end define function

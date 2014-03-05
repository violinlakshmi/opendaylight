/**
 * This JS file loads all other scripts using requirejs 
 */
requirejs.config({
    paths: {
        jquery: 'jquery-1.9.1.min',
        less: 'less-1.3.3.min',
        underscore: 'underscore-min',
        fuelux: 'fuelux/',
    }
});

// Start the main app logic.
requirejs(
	['jquery', 'less','global', 'lib', 'open', 'open-topology'],
function   ($, less, one) {
    one.main.menu.load();

    // Visual topology json.
    $.getJSON(one.global.remoteAddress + "controller/web/topology/visual.json",
            function(data) {
                one.topology.init(data);
            });
});

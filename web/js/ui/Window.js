(function() {
by8.require('by8.ui.Panel');

var my = by8.extend('by8.ui.Window', by8.ui.Panel, {
    collapsible: true,
    
    css: 'window',
    
    init: function(config) {
        my.superclass.init.call(this, config);
        
    }
});
})();
(function() {
by8.require('by8.ui.Component');

var my = by8.extend('by8.ui.html.Link', by8.ui.Component, {
    autoEl: {
        tag: 'a',
        href: 'javascript:void(0)'
    },
    
    init: function(config) {
        my.superclass.init.call(this, config);
        
    }
});
})();
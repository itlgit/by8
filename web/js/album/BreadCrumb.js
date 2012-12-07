(function() {
    by8.require('by8.ui.Component');
    
    var my = by8.extend('by8.album.BreadCrumb', by8.ui.Component, {
        css: 'breadcrumb',
        
        path: undefined,
        
        init: function(config) {
            my.superclass.init.call(this, config);
            
            this.el.update('&gt; '+this.html);
        }
    });
})();
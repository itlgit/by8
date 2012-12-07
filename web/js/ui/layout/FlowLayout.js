(function() {
    var LayoutManager = by8.require('by8.ui.layout.LayoutManager');
    
    var my = by8.extend('by8.ui.layout.FlowLayout', LayoutManager, {
        /**
         * The CSS class to be added to the container's layout target (ct).
         */
        css: 'flow-layout'
    });
})();
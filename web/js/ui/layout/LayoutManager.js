(function() {
    by8.require('by8.Observable');
    
    var my = by8.extend('by8.ui.layout.LayoutManager', by8.Observable, {
        css: '',
        
        /**
         * The container which we're laying out
         */
        container: undefined,
        
        constructor: function(config) {
            config = config || {};
            this.setContainer(config.container);
            delete config.container;
            my.superclass.constructor.call(this, config);
        },
        
        setContainer: function(container) {
            this.container = container;
            if (container) {
                container.ct.addClass(this.css);
            }
        },
        
        doLayout: function() {
            /*
             * Render all children
             */
            this.renderChild(this.container.children);
        },
        
        /**
         * Render a child or array of children to the container.
         * @param child
         */
        renderChild: function(child) {
            if (by8.isArray(child)) {
                var me = this;
                by8.each(child, function(c) {
                    me.renderChild(c);
                });
                return;
            }
            if (!child.rendered) {
                child.render(this.container.ct);
            }
        }
    });
})();
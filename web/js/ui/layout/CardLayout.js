(function() {
    var LayoutManager = by8.require('by8.ui.layout.LayoutManager');
    
    var my = by8.extend('by8.ui.layout.CardLayout', LayoutManager, {
        /**
         * The CSS class to be added to the container's layout target (ct).
         */
        css: 'card-layout',
        
        constructor: function(config) {
            my.superclass.constructor.call(this, config);
        },
        
        /**
         * @override
         * @param container
         */
        setContainer: function(container) {
            my.superclass.setContainer.call(this, container);
            if (container && !this.listenerAdded) {
                container.on('childactivated', this.renderChild, this);
                this.listenerAdded = true;
                container.on('childactivated', this.onChildActivated, this);
            }
        },
        
        /**
         * @override
         * @param child
         */
        renderChild: function(child) {
            /*
             * Only ever render the activeChild
             */
            my.superclass.renderChild.call(this, this.container.activeChild);
        },
        
        /**
         * Show active child, hide all others.
         * @param child
         */
        onChildActivated: function(child) {
            by8.each(this.container.children, function(c) {
                if (c !== child) {
                    c.el.hide();
                }
            });
            child.el.show();
        }
    });
})();
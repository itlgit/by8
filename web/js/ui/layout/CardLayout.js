(function() {
    var LayoutManager = by8.require('by8.ui.layout.LayoutManager');
    
    var my = by8.extend('by8.ui.layout.CardLayout', LayoutManager, {
        constructor: function(config) {
            my.superclass.constructor.call(this, config);
        },
        
        setContainer: function(container) {
            my.superclass.setContainer.call(this, container);
            if (container && !this.listenerAdded) {
                container.on('childactivated', this.renderChild, this);
                this.listenerAdded = true;
                container.ct.addClass('card-layout');
                container.on('childactivated', this.onChildActivated, this);
            }
        },
        
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
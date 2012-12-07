(function() {
by8.require('by8.ui.Component');

var my = by8.extend('by8.ui.Container', by8.ui.Component, {
    /**
     * The active component within the container
     */
    activeChild: undefined,
    
    /**
     * Array of children to be rendered to our DOM
     */
    children: undefined,
    
    /**
     * The layout manager to be used.  Defaults to by8.ui.layout.LayoutManager
     */
    layout: undefined,
    
    /**
     * The Element to where our children will be rendered.  Defaults to this.el
     * during init().  If subclasses need to change it, do so before children
     * rendering begins in render().
     */
    ct: undefined,
    
    init: function(config) {
        my.superclass.init.call(this, config);
        
        this.ct = this.el;
        
        if (!this.layout) {
            var Layout = by8.require('by8.ui.layout.LayoutManager');
            this.layout = new Layout();
        }
        
        this.initChildren();
    },
    
    initChildren: function() {
        /*
         * Remove this.children to re-add and fire events
         */
        var children = this.children || [];
        this.children = [];
        this.add(children);
        
        if (!this.activeChild) {
            this.setActiveChild(this.children[0]);
        } else if (by8.isNumber(this.activeChild)) {
            this.setActiveChild(this.children[this.activeChild]);
        }
    },
    
    render: function() {
        my.superclass.render.apply(this, arguments);
        
        /*
         * If layout isn't hooked up to its container yet (us)
         */
        if (!this.layout.container) {
            this.layout.setContainer(this);
        }
        this.layout.doLayout();
    },
    
    /**
     * Add a child to the container
     * @param child
     */
    add: function(child) {
        if (by8.isArray(child)) {
            var me = this;
            by8.each(child, function(c) {
                me.add(c);
            });
            return;
        }
        if (this.children.indexOf(child) < 0) {
            this.children.push(child);
            child.container = this;
            child.on('activated', this.setActiveChild, this);
            this.fireEvent('childadded', [child]);
        }
    },
    
    /**
     * Sets the currently active child.  This function will do nothing if the
     * passed child is already active in the container.
     * @param child
     */
    setActiveChild: function(child) {
        if (this.activeChild !== child) {
            this.activeChild = child;
            this.fireEvent('childactivated', [child]);
        }
    }
});
})();
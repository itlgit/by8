(function() {
    by8.require('by8.ui.Panel');
    
    var my = by8.extend('by8.ui.TabPanel', by8.ui.Panel, {
        css: 'tabpanel',
        
        init: function(config) {
            var CardLayout = by8.require('by8.ui.layout.CardLayout');
            config.layout = config.layout || new CardLayout();
            
            this.on('childadded', this.onTabAdded, this);
            this.on('childactivated', this.onTabActivated, this);
            
            my.superclass.init.call(this, config);
            /*
             * Bring titleBar back to top
             */
            if (this.headerBar) {
                this.el.insertBefore(this.titleBar, this.headerBar);
            }
        },
        
        onTabAdded: function(tab) {
            if (!this.headerBar) {
                this.headerBar = this.el.createChild({
                    css: 'header-strip'
                }, this.body);
            }
            /*
             * Create a tab header for the new tab's title
             */
            var title = tab.title || this.children.length;
            tab.header = this.headerBar.createChild({
                tag: 'span',
                html: title
            });
            var me = this;
            tab.header.on('click', function() {
                me.setActiveChild(tab);
            });
        },
        
        onTabActivated: function(tab) {
            this.headerBar.query('.active').removeClass('active');
            tab.header.addClass('active');
        }
        
    });
})();
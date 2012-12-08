(function() {
by8.require('by8.ui.Panel');

var my = by8.extend('by8.ui.Window', by8.ui.Panel, {
    collapsible: true,
    
    css: 'window',
    
    /**
     * The action to be taken when the window is closed.  Defaults to 'closed'
     * Valid values: close, hide, invisible
     */
    closeAction: 'close',
    
    /**
     * Whether the window should do its close action when the Esc key is pressed
     */
    closeOnEsc: true,
    
    init: function(config) {
        my.superclass.init.call(this, config);
        
        this.closeButton = this.titleBar.createChild({
            tag: 'span',
            css: 'close',
            title: 'Close'
        });
        var me = this;
        this.closeButton.on('click', function() {
            me[me.closeAction]();
        });
        
        this._keyRelay = function() {
            me.onKeyPress.apply(me, arguments);
        };
        if (this.closeOnEsc) {
            by8.fly(document).on('keypress', this._keyRelay);
        }
    },
    
    close: function() {
        this.destroy();
    },
    
    onKeyPress: function(e) {
        if (e.keyCode === 27) {
            this[this.closeAction]();
        }
    },
    
    destroy: function() {
        by8.fly(document).un('keypress', this._keyRelay);
        my.superclass.destroy.call(this);
    }
});
})();
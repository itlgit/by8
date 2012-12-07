(function() {
var my = by8.extend('by8.Observable', Object, {
    /*
     * listeners =
     * {
     *   eventName: [
     *     ...
     *     [callback(), scope]
     *     ...
     *   ]
     * }
     */
    constructor: function(config) {
        config = config || {};
        this.listeners = {};
        
        /*
         * Read config listeners into this.listeners
         */
        var me = this;
        by8.each(config.listeners, function(listener, event) {
            if (by8.isFunction(listener)) {
                me.on(event, listener, config.listeners.scope || me);
            }
        });
        delete config.listeners;
    },
    
    destroy: function() {
        var me = this;
        by8.each(this.listeners, function(listener, event) {
            me.un(event, listener[0], listener[1]);
        });
    },
    
    on: function(event, callback, scope) {
        var listeners = this.listeners[event];
        if (!listeners) {
            listeners = this.listeners[event] = [];
        }
        listeners.push([callback, scope]);
    },
    
    un: function(event, callback, scope) {
        var listeners = this.listeners[event],
            me = this;
        if (listeners) {
            var at = -1;
            by8.each(listeners, function(listener, i) {
                if (listener[0] === callback && callback[1] === scope) {
                    at = i;
                    return false;
                }
            });
            if (at > -1) {
                listeners.splice(at, 1);
            }
        }
    },
    
    fireEvent: function(event, args) {
        var listeners = this.listeners[event],
            me = this,
            rc = undefined;
        if (listeners) {
            by8.each(listeners, function(listener) {
                rc = listener[0].apply(listener[1] || me, args);
                return rc;
            });
        }
        return rc;
    }
});
})();
by8.getProperty('by8.ui.ComponentMgr', true);

(function() {
    var compHash = {};
    
    var mgr = by8.ui.ComponentMgr = {
            get: function(id) {
                return compHash[id];
            },

            set: function(id, comp) {
                compHash[id] = comp;
            },

            remove: function(id) {
                delete compHash[id];
            },

            getIds: function() {
                var ids = [];
                for (var id in compHash) {
                    ids.push(id);
                }
                return ids;
            }
    };

    /*
     * Shorthand methods
     */
    by8.mixin(by8, {
        getComp: function(id) {
            return mgr.get(id);
        },
        setComp: function(id, comp) {
            return mgr.set(id, comp);
        },
        removeComp: function(id) {
            return mgr.remove(id);
        }
    });
})();
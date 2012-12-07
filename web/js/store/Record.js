(function() {

var my = by8.extend('by8.store.Record', Object, {
    data: undefined,
    
    dirty: undefined,
    
    constructor: function(data) {
        this.data = data || {};
        this.dirty = {};
    },
    
    set: function(key, value) {
        this.dirty[key] = value;
    },
    
    get: function(key) {
        var d = this.data;
        if (key in this.dirty) {
            d = this.dirty;
        }
        return d[key];
    },
    
    commit: function() {
        by8.mixin(this.data, this.dirty);
        this.revert();
    },
    
    /**
     * Revert the value specified by key, or if none given, revert the entire
     * record to the values before the last commit().
     * @param key
     */
    revert: function(key) {
        if (key) {
            delete this.dirty[key];
        } else {
            this.dirty = {};
        }
    },
    
    isDirty: function() {
        for (var p in this.dirty) {
            return true;
        }
        return false;
    }
});
})();
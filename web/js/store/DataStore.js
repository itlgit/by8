(function() {
var Record = by8.require('by8.store.Record');
by8.require('by8.Observable');

var my = by8.extend('by8.store.DataStore', by8.Observable, {
    records: undefined,
    
    constructor: function(config) {
        my.superclass.constructor.call(this, config);
        this.config = config || {};
        this.init(this.config);
    },
    
    init: function(config) {
        this.records = [];
        by8.mixin(this, config);
    },
    
    size: function() {
        return this.records.length;
    },
    
    each: function(callback, scope) {
        return by8.each(this.records, callback, scope);
    },
    
    load: function(records) {
        this.records = [].concat(records);
        this.fireEvent('loaded', [this, this.records]);
    },
    
    /**
     * Read the raw data (array) to convert array elements to Records and
     * save in the local store.
     * @param data
     */
    read: function(data) {
        if (data) {
            var recs = [];
            if (this.reader) {
                data = this.reader.read(data);
            }
            if (by8.isArray(data)) {
                by8.each(data, function(r) {
                    var rec = new Record(r);
                    recs.push(rec);
                });
            }
            this.load(recs);
        }
    },
    
    /**
     * Add the record, optionally at a specified index
     * @param index (Optional) The index within the store's records at which to add
     * the record
     * @param record The record to be added
     */
    add: function(index, record) {
        if (arguments.length === 1) {
            record = arguments[0];
            index = this.records.length;
        }
        this.records.splice(index, 1, record);
        this.fireEvent('recordadded', [record]);
    },
    
    /**
     * Remove the specified record or the one at the given index
     * @param index The record or the index within the store
     * @return Record The record that was removed
     */
    remove: function(index) {
        if (by8.isObject(index)) {
            by8.each(this.records, function(r, i) {
                if (r === index) {
                    index = i;
                    return false;
                }
            });
        }
        var rec = this.records.splice(index, 1);
        this.fireEvent('recordremoved', [rec]);
        return rec;
    },
    
    /**
     * Remove all records from the store
     */
    clear: function() {
        while (this.records.length) {
            this.remove(this.records.length-1);
        }
    }
});
})();
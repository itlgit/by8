(function() {

by8.extend('by8.album.ManifestReader', Object, {
    constructor: function(prop) {
        this.prop = prop;
    },
    
    read: function(data) {
        if (data) {
            var items = data[this.prop];
            var recs = [];
            var prop = this.prop;
            by8.each(items, function(item) {
                var rec = {};
                rec[prop] = item;
                recs.push(rec);
            });
            return recs;
        }
    }
});
})();
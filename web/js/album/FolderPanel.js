/**
 * A Panel that handles album folder content, e.g., photos & vids
 */
(function() {
    by8.require('by8.ui.Panel');
    
    var my = by8.extend('by8.album.FolderPanel', by8.ui.Panel, {
        folderPath: undefined,
        
        render: function() {
            my.superclass.render.apply(this, arguments);
            
            var Store = by8.require('by8.store.RemoteDataStore'),
                Reader = by8.require('by8.album.ManifestReader');
            this.store = new Store({
                url: this.folderPath,
                reader: new Reader('directories'),
                listeners: {
                    loaded: this.onStoreLoad,
                    scope: this
                }
            });
            
        },
        
        onStoreLoad: function(store, records) {
            var text = [];
            by8.each(records, function(record) {
                by8.each(record.data, function(val, key) {
                    text.push(key +' = '+val+', ');
                });
                text.push('<br/>');
            });
            this.el.update(text.join(''));
        }
    });
})();
(function() {
by8.require('by8.store.DataStore');

var my = by8.extend('by8.store.RemoteDataStore', by8.store.DataStore, {
    url: '',
    
    proxy: undefined,
    
    init: function(config) {
        my.superclass.init.call(this, config);
        
        /*
         * If url given but no proxy, create proxy.  url and proxy are mutually
         * exclusive.
         */
        if (!this.proxy) {
            var Proxy = by8.require('by8.store.Proxy');
            this.proxy = new Proxy({
                listeners: {
                    loaded: function(data) {
                        this.read(data);
                    },
                    scope: this
                }
            });
        }
        this.reload();
    },
    
    /**
     * Query the data from the proxy.
     * @param url (Optional) The url from where to query the data.  If no value
     * is specified, the query will use the last URL passed in.
     */
    reload: function(url) {
        this.url = url || this.url;
        if (this.url) {
            this.proxy.load(this.url);
        }
    }
});
})();
(function() {
by8.require('by8.Observable');

var my = by8.extend('by8.store.Proxy', by8.Observable, {
    xhr: undefined,
    
    load: function(url, postData) {
        this.xhr = by8.ajax(url, {
            data: postData,
            type: postData ? 'POST' : 'GET',
            success: function(data) {
                this.fireEvent('loaded', [data]);
            },
            context: this
        });
    }
});
})();
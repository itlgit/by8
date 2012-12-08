(function() {
    by8.require('by8.ui.TabPanel');
    
    var my = by8.extend('by8.album.Navigator', by8.ui.TabPanel, {
        init: function(config) {
            this.on('childadded', this.onChildAdded, this);
            my.superclass.init.call(this, config);
            
            var Viewer = by8.require('by8.album.viewer.Viewer');
            this.viewer = new Viewer({
                id: 'viewer',
                transparent: true,
                renderTo: document.body
            });
            this.viewer.invisible();
        },
        
        /*
         * Listen to each child's 'manifestloaded' and 'fileclicked' events
         */
        onChildAdded: function(child) {
            child.on('fileclicked', this.onFileClicked, this);
        },
        
        onFileClicked: function(path, record) {
            this.viewer.setManifest(record);
            this.viewer.showFile(path);
        }
    });

})();
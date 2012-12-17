(function() {
    var Component = by8.require('by8.ui.Component');
    
    var my = by8.extend('by8.album.FolderComponent', Component, {
        css: 'folder-comp',
        
        init: function(config) {
            my.superclass.init.call(this, config);
            if (this.thumb) {
                this.el.createChild({
                    tag: 'img',
                    src: window.urlPrefix+this.thumb
                });
            }
            var lastSlash = this.path.lastIndexOf('/')+1;
            this.el.createChild({
                tag: 'span',
                css: 'text',
                html: this.path.substring(lastSlash || 0)
            });
        }
    });
})();
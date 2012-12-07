/**
 * A Panel that handles album folder content, e.g., photos & vids
 */
(function() {
    by8.require('by8.ui.Panel');
    
    var my = by8.extend('by8.album.FolderPanel', by8.ui.Panel, {
        folderPath: undefined,
        
        init: function(config) {
            if (!config.layout) {
                var Flow = by8.require('by8.ui.layout.FlowLayout');
                this.layout = new Flow();
            }
            my.superclass.init.call(this, config);
        },
        
        render: function() {
            my.superclass.render.apply(this, arguments);
            
            var Store = by8.require('by8.store.RemoteDataStore');
            this.store = new Store({
                url: this.folderPath,
                listeners: {
                    loaded: this.onStoreLoad,
                    scope: this
                }
            });
        },
        
        reload: function(path) {
            this.removeAll();
            this.store.reload('thumbs/'+path+'/manifest.json');
            
            /*
             * Remove all breadcrumbs up to (including) current path
             */
            var tb = this.toolbar;
            var remove = false;
            var toRemove = [];
            by8.each(tb.children, function(bc) {
                if (remove || bc.path === path) {
                    remove = true;
                    toRemove.push(bc);
                }
            });
            by8.each(toRemove, function(bc) {
                tb.remove(bc);
            });
            
            /*
             * Use remaining breadcrumbs to build leading path to be hidden
             * from other breadcrumbs.
             */
            var fullPath = [];
            by8.each(tb.children, function(bc) {
                fullPath.push(bc.html);
            });
            fullPath = fullPath.join('/');
            
            by8.require('by8.album.BreadCrumb');
            var crumb = new by8.album.BreadCrumb({
                html: path.substring(fullPath.length),
                path: path,
                listeners: {
                    click: function(comp) {
                        this.reload(comp.path);
                    },
                    scope: this
                }
            });
            this.toolbar.add(crumb);
        },
        
        onStoreLoad: function(store, records) {
            this.createDirectories(records[0].get('directories'));
            this.createFiles(records[0].get('images'));
        },
        
        createDirectories: function(directories) {
            var me = this,
                FolderComponent = by8.require('by8.album.FolderComponent');
            by8.each(directories, function(dir) {
                var item = new FolderComponent({
                    html: dir,
                    path: dir,
                    listeners: {
                        click: function(comp) {
                            me.reload(comp.path);
                        }
                    }
                });
                me.add(item);
            });
        },
        
        createFiles: function(files) {
            var me = this,
                FolderComponent = by8.require('by8.album.FolderComponent');
            by8.each(files, function(file) {
                var item = new FolderComponent({
                    html: file.lg,
                    path: file.lg,
                    thumb: file.tn,
                    listeners: {
                        click: function(comp) {
                            console.debug('showing '+comp.path);
                        }
                    }
                });
                me.add(item);
            });
        }
    });
})();
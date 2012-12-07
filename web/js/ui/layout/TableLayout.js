(function() {
    var Layout = by8.require('by8.ui.layout.LayoutManager');
    var my = by8.extend('by8.ui.layout.TableLayout', Layout, {
        css: 'table-layout',
        
        setContainer: function(container) {
            my.superclass.setContainer.call(this, container);
            
            if (container) {
                this.table = container.ct.createChild({
                    tag: 'table',
                    children: [{
                        tag: 'tbody',
                        children: [{
                            tag: 'tr'
                        }]
                    }]
                });
                container.on('childadded', this.onChildAdded, this);
                container.on('childremoved', this.onChildRemoved, this);
            }
        },
        
        onChildAdded: function(child) {
            var tr = by8.fly(this.table.query('tr')[0]);
            tr.createChild({
                tag: 'td',
                children: [
                    child.el
                ]
            });
        },
        
        onChildRemoved: function(child) {
            /*
             * Scan for empty <td>, remove
             */
            var tr = this.table.query('tr')[0];
            var toRemove = [];
            by8.each(tr.children, function(td) {
                if (!td.children.length) {
                    toRemove.push(td);
                }
            });
            by8.each(toRemove, function(td) {
                tr.removeChild(td);
            });
        }
    });
})();
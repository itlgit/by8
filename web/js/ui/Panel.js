(function() {
by8.require('by8.ui.Container');

var my = by8.extend('by8.ui.Panel', by8.ui.Container, {
    css: 'panel',
    
    title: '',
    
    /**
     * Transparent background
     */
    transparent: false,
    
    init: function(config) {
        my.superclass.init.call(this, config);
        
        var el = this.el;
        
        if (this.transparent) {
            this.opaque = el.createChild({
                css: 'opaque'
            });
            el.addClass('transparent');
        }
       
        this.titleBar = el.createChild({
            css: 'title-bar',
            children: [{
                tag: 'span',
                css: 'title-text'
            }]
        });
        this.setTitle(this.title);
        
        /*
         * TODO: convert toolbar from [] into component
         */
        if (this.toolbar) {
            by8.require('by8.ui.layout.TableLayout');
            this.toolbar = new by8.ui.Container({
                css: 'toolbar',
                layout: new by8.ui.layout.TableLayout(),
                renderTo: el
            });
        }
        
        this.bwrap = el.createChild({
            css: 'bwrap',
            children: [{
                css: 'body'
            }]
        });
        this.ct = this.body = new by8.Element(this.bwrap.query(':first')[0]);
    },
    
    getFrameHeight: function() {
        var el = this.body.dom,
            offsetHeight = 0;
        while (el !== this.el.dom) {
            offsetHeight += el.offsetTop;
            el = el.parentNode;
        }
        return offsetHeight;
    },
    
    setSize: function(w, h) {
        my.superclass.setSize.call(this, w, h);
        if (this.rendered && this.body) {
            /*
             * Get Panel's overall size, calculate body size
             */
            var elSize = this.el.getSize();
            var adjustedHeight = elSize.height - this.getFrameHeight();
            console.debug('Panel:'+this.id+' resizing body to '+elSize.width+'x'+adjustedHeight);
            this.body.setSize(elSize.width, adjustedHeight);
        }
    },
    
    setTitle: function(title) {
        this.title = title || '';
        this.titleBar.query('.title-text').html(title);
    }
});
})();
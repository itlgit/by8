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
       
        if (this.title) {
            this.titleBar = el.createChild({
                css: 'title-bar',
                children: [{
                    tag: 'span',
                    css: 'title-text',
                    html: this.title
                }]
            });
        }
        
        by8.require('by8.ui.layout.TableLayout');
        this.toolbar = new by8.ui.Container({
            css: 'toolbar',
            layout: new by8.ui.layout.TableLayout(),
            renderTo: el
        });
        
        this.bwrap = el.createChild({
            css: 'bwrap',
            children: [{
                css: 'body'
            }]
        });
        this.ct = this.body = new by8.Element(this.bwrap.query(':first')[0]);
    },
    
    render: function() {
        my.superclass.render.apply(this, arguments);
        
        /*
         * Set the initial size of bwrap, taking into account the header.
         */
        var bwrapWidth = this.bwrap.dom.clientWidth/2,
            offsetLeft = this.body.dom.offsetLeft,
            parentWidth = this.el.dom.clientWidth;
        var bwrapHeight = this.bwrap.dom.clientHeight/2,
            offsetTop = this.body.dom.offsetTop,
            parentHeight = this.el.dom.clientHeight;
        this.frameSize = {
            w: offsetLeft+bwrapWidth,
            h: offsetTop+bwrapHeight
        };
//        this.body.setSize(parentWidth - this.frameSize.w, parentHeight - this.frameSize.h);
        var newHeight = parentHeight - this.frameSize.h;
        if (newHeight < 1) {
            newHeight = 'auto';
        }
        this.body.setSize(undefined, newHeight);
    },
    
    setTitle: function(title) {
        by8('.title-text', this.titleBar.dom)[0].innerHTML = this.title = title;
    }
});
})();
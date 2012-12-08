(function() {
    by8.require('by8.Observable');
    
    var my = by8.extend('by8.ui.Component', by8.Observable, {
        /**
         * Indicates whether the component's DOM has been rendered and added to the
         * parent node.
         */
        rendered: false,
        
        /**
         * ID/Element/DOM of an existing DOM element to which the component will be
         * applied.
         */
        applyTo: false,
        
        /**
         * ID/Element/DOM of an existing DOM element into which the component DOM
         * will be added.
         */
        renderTo: false,
        
        /**
         * The CSS class applied to the component
         */
        css: 'by8-comp',
        
        /**
         * The X-coordinate, relative to the container
         */
        x: undefined,
        
        /**
         * The Y-coordinate, relative to the container
         */
        y: undefined,
        
        /**
         * The default width of the component.
         */
        width: undefined,
        
        /**
         * The default height of the component.
         */
        height: undefined,
        
        /**
         * The default by8.createElement configuration to be used when constructing
         * the component's DOM
         */
        autoEl: {},
        
        /**
         * The innerHTML content to be embedded into this component.  This should
         * only be used to embed simple text into the component.  If child nodes are
         * needed, consider using a Container or creating dynamic children after the
         * component has been rendered.
         */
        html: '',
        
        constructor: function(config) {
            my.superclass.constructor.call(this, config);
            this.config = config || {};
            this.init(this.config);
            
            if (this.renderTo) {
                this.render(this.renderTo);
            }
    
            by8.require('by8.ui.ComponentMgr');
            by8.setComp(this.id, this);
        },
        
        destroy: function() {
            this.el.destroy();
            by8.removeComp(this.id);
            my.superclass.destroy.call(this);
        },
        
        /**
         * Component initialization
         * @param config
         */
        init: function(config) {
            /*
             * Generate a default ID from the class name if one hasn't been provided
             */
            if (!config.id) {
                var idPrefix = this.declaredClass ? this.declaredClass.replace(/\./g, '_') : 'by8-comp';
                config.id = by8.genId(idPrefix);
            }
            by8.mixin(this, config);
            
            this.el = by8.get(by8.createElement(by8.mixinNew(
                {},
                this.autoEl,
                {
                    id: this.id,
                    html: this.html,
                    css: this.getCssClassChain()
                }
            )));
            
            if (this.hidden) {
                this.hide();
            }
            this.setPosition(this.x, this.y);
            this.setSize(this.width, this.height);
            this.initEvents();
        },
        
        initEvents: function() {
            this.relayEvents(
                'click',
                'keydown',
                'keyup',
                'keypress'
            );
        },
        
        relayEvents: function() {
            var me = this,
                el = me.el;
            by8.each(arguments, function(event) {
                el.on(event, function(e) {
                    me.fireEvent(event, [me, e]);
                });
            });
        },
        
        /**
         * From 'this' object, get the chain of declared "css" properties to be
         * applied to the component DOM.
         * TODO: re-factor into more generic function to get chain of any property
         */
        getCssClassChain: function() {
            var sc = this,
                chain = [];
            do {
    //            if (sc.hasOwnProperty('css') && sc.css) {
                if (sc.css && chain.indexOf(sc.css) < 0) {
                    chain.unshift(sc.css);
                }
            } while (sc = sc.superclass);
            return chain.join(' ');
        },
        
        /**
         * Render the component to the given Element
         * @param el
         */
        render: function(target) {
            by8.get(target).appendChild(this.el);
            this.rendered = true;
            this.fireEvent('rendered', [this]);
        },
        
        /**
         * Managed-on.  Relay event handler to backing Element.
         * @param event
         * @param callback
         * @param scope
         */
        mon: function(event, callback, scope) {
            this.el.on.apply(this.el, arguments);
        },
        
        mun: function(event, callback, scope) {
            this.el.un.apply(this.el, arguments);
        },
        
        setPosition: function(x, y) {
            this.el.setPosition(x, y);
        },
        
        getSize: function() {
            return this.el.getSize();
        },
        
        /**
         * Sets the size of the component.
         * @param w
         * @param h
         */
        setSize: function(w, h) {
            this.el.setSize(w, h);
        },
        
        /**
         * Hide the component
         * @param hide Boolean to hide/show
         */
        hide: function(hide) {
            if (hide === false) {
                this.show();
                return;
            }
            this.el.hide();
            this.fireEvent('hide', [this]);
        },
        
        show: function(show) {
            if (show === false) {
                this.hide();
                return;
            }
            this.el.show();
            this.fireEvent('show', [this]);
        },
        
        visible: function(visible) {
            if (visible === false) {
                this.invisible();
                return;
            }
            this.el.visible();
            this.fireEvent('visible', [this]);
        },
        
        invisible: function(invisible) {
            if (invisible === false) {
                this.visible();
                retrun;
            }
            this.el.invisible();
            this.fireEvent('invisible', [this]);
        }
    });
})();
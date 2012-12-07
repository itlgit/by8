/**
 * This class encapsulates a DOM Element and provides cross-browser event
 * handling upon the element.
 */
(function(by8) {
    var elementCache = {},
        idGenCount = 0;
    
by8.mixin(by8, {
    /**
     * The main DOM Element wrapper.
     * @param {DOM/String} element The element or its ID.
     */
    Element: by8.extend(Object, {
        constructor: function(element) {
            by8.mixin(this, {
                dom: by8(element)[0],
                id: element.id
            });
        },
        on: function(eventName, callback) {
            by8(this.dom).bind(eventName, callback);
        },
        un: function(eventName, callback) {
            by8(this.dom).unbind(eventName, callback);
        },
        getSize: function() {
            return {
                width: this.dom.clientWidth || 0,
                height: this.dom.clientHeight || 0};
        },
        setPosition: function(x, y) {
            if (x !== undefined) {
                this.setStyle('left', x+'px');
            }
            if (y !== undefined) {
                this.setStyle('top', y+'px');
            }
        },
        /**
         * Sets the size of the DOM element.  If 'w' is an object, it should
         * contain 'width' and/or 'height' properties.
         * @param w
         * @param h
         */
        setSize: function(w, h) {
            if (by8.isObject(w)) {
                w = w.width;
                h = w.height;
            }
            if (w !== undefined) {
                this.setStyle('width', w+'px');
            }
            if (h !== undefined) {
                this.setStyle('height', h+'px');
            }
        },
        setStyle: function(prop, value) {
            this.dom.style[prop] = value;
        },
        appendChild: function(e) {
            return this.dom.appendChild(e.dom || e);
        },
        insertBefore: function(e, ref) {
            return this.dom.insertBefore(e.dom || e, ref.dom || ref);
        },
        createChild: function(config, ref) {
            var e = by8.get(by8.createElement(config));
            if (ref !== undefined) {
                this.insertBefore(e, ref);
            } else {
                this.appendChild(e);
            }
            return e;
        },
        addClass: function(cls) {
            by8(this.dom).addClass(cls);
        },
        removeClass: function(cls) {
            by8(this.dom).removeClass(cls);
        },
        toggleClass: function(cls) {
            by8(this.dom).toggleClass(cls);
        },
        hasClass: function(cls) {
            return by8(this.dom).hasClass(cls);
        },
        hide: function() {
            this.addClass('by8-hidden');
        },
        show: function() {
            this.removeClass('by8-hidden');
        },
        query: function(path) {
            return by8(path, this.dom);
        },
        update: function(html) {
            by8(this.dom).html(html);
        },
        destroy: function() {
            by8(this.dom).unbind();
            if (this.dom.parentNode) {
                this.dom.parentNode.removeChild(this.dom);
            }
        }
    }),
    
    /**
     * Get an instance of the Element wrapper.  If an Element wrapper already
     * exists for the DOM element, return the cached wrapper instead of creating
     * a new one.  To enable object caching, if the element doesn't yet have an
     * ID, one will be assigned to it.
     * 
     */
    get: function(element) {
        /*
         * element == Element, return it
         */
        if (element.dom) {
            return element;
        }
        
        element = this(element)[0];
        if (!element) {
            return;
        }
        var id = element.id;
        if (!id) {
            id = this.genId();
            element.id = id;
        }
        if (!elementCache[id]) {
            elementCache[id] = new this.Element(element);
        }
        /*
         * Sanity check.  Make sure supplied object ID doesn't match that of
         * another in the cache.
         */
        if (elementCache[id] && element !== elementCache[id].dom) {
            throw Error('Two elements have the same ID '+id);
        }
        return elementCache[id];
    },
    
    /**
     * Returns the flyweight object bound to the given DOM element.
     */
    fly: function(element) {
        if (!this.flyweight) {
            this.flyweight = new this.Element(element);
            delete this.flyweight.id;
        }
        this.flyweight.dom = this(element)[0];
        return this.flyweight;
    },
    
    /**
     * Generates the next sequential (unique) ID
     * @param prefix A optional prefix for the ID.  If not set, "by8-gen-" is
     * used.
     */
    genId: function(prefix) {
        prefix = prefix || 'by8-gen';
        return prefix + ++idGenCount;
    }
});

})(by8);
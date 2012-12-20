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
        /**
         * Gets the value of the property named by <code>prop</code>
         * @param prop
         */
        get: function(prop) {
            return this.dom[prop];
        },
        /**
         * Set the value of the property named by <code>prop</code>
         * @param prop
         * @param val
         */
        set: function(prop, val) {
            this.dom[prop] = val;
        },
        on: function(eventName, callback) {
            by8(this.dom).bind(eventName, callback);
        },
        un: function(eventName, callback) {
            by8(this.dom).unbind(eventName, callback);
        },
        attr: function(key, val) {
            if (val === undefined) {
                return this.dom.getAttribute(key);
            }
            this.dom.setAttribute(key, val);
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
         * Gets the Element's containment size, i.e., the space it has to contain
         * other elements.
         * @param overall If the overall size (including padding, margin, etc)
         * should be included in the size.
         * @returns {___anonymous1245_1352}
         */
        getSize: function(overall) {
            if (overall) {
                return {
                    width: by8(this.dom).outerWidth(),
                    height: by8(this.dom).outerHeight()
                };
            }
            return {
                width: by8(this.dom).width(),
                height: by8(this.dom).height()
            };
        },
        /**
         * Sets the size of the DOM element.  If 'w' is an object, it should
         * contain 'width' and/or 'height' properties.
         * @param w
         * @param h
         */
        setSize: function(w, h) {
            if (by8.isObject(w)) {
                h = w.height;
                w = w.width;
            }
            if (w !== undefined) {
                this.setStyle('width', w+ (by8.isNumber(w) ? 'px' : ''));
            }
            if (h !== undefined) {
                this.setStyle('height', h+ (by8.isNumber(h) ? 'px' : ''));
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
        visible: function() {
            this.removeClass('by8-invisible');
        },
        invisible: function() {
            this.addClass('by8-invisible');
        },
        query: function(path) {
            return by8(path, this.dom);
        },
        update: function(html) {
            by8(this.dom).html(html);
        },
        remove: function() {
            if (this.dom.parentNode) {
                this.dom.parentNode.removeChild(this.dom);
            }
        },
        destroy: function() {
            by8(this.dom).unbind();
            this.remove();
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
        var dom = this(element)[0];
        if (dom) {
            this.flyweight.dom = this(element)[0];
            return this.flyweight;
        }
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

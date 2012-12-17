/*!
 * ByEight.com JavaScript library
 */
globalEval = function(content) {
//    return eval.apply(window, arguments);
    return eval(content);
};
(function() {
    var by8 = window.by8 = function(path, context) {
        return $(path, context);
    };
    
    var modulePaths = {},
        includedModules = {},
        $;
    
    /*
     * Find relative path to by8-core.js from the calling page.  Use as
     * root for dependent scripts.
     */
    var scripts = document.getElementsByTagName('script');
    for (var i=0,len=scripts.length; i<len; i++) {
        var src = scripts[i].getAttribute('src'),
            coreAt = src && src.search(/\/by8-core\.js/);
        if (coreAt > 0) {
            modulePaths.defaultPath = src.substring(0, coreAt) + "/";
            break;
        }
    }
    
    function copy(target, source) {
        if (!source) {
            return;
        }
        for (var p in source) {
            target[p] = source[p];
        }
        return target;
    }
    function copyNew(target, source) {
        if (!source) {
            return;
        }
        for (var p in source) {
            if (!(p in target)) {
                target[p] = source[p];
            }
        }
        return target;
    }
    
    /**
     * Mixin properties from the source to the target.  This function copies all
     * properties (by reference) from the source object into the target object.
     * 
     * @param {Object} target The target object to which the properties are copied.
     * If target is null/undefined, a new blank object will be created.
     * @param {Object} source The source object from which the properties are copied.
     * @param {Object} defaults The object containing default values to apply to the
     * target only if the same named property does not already exist in the source.
     * @return {Object} The target object with source and default properties applied.
     */
    by8.mixin = function(target, source, defaults) {
        target = target || {};
        copy(target, defaults);
        copy(target, source);
        return target;
    };
    
    by8.mixin(by8, {
        emptyFn: function(){},
        
        /**
         * Same as by8.mixin() except don't copy over properties that already exist
         * in target.
         */
        mixinNew: function(target, source, defaults) {
            target = target || {};
            copyNew(target, source);
            copyNew(target, defaults);
            return target;
        },
        
        /**
         * Perform an action when the page (document) is loaded and ready.
         * @param {Function} callback The callback function to run
         * @param {Object} scope An optional scope in which to run the callback
         */
        ready: function(callback, scope) {
            $(document).ready(callback);
        },
        
        /**
         * Defers execution of a callback function until after the timeout period.
         * @param {Function} callback The callback funtcion
         * @param {Number} timeout The timeout millis to wait before executing the callback
         * @param {Object} scope The scope in which to execute the callback
         * @param {Array} args The arguments to pass to the callback at execution time
         */
        defer: function(callback, timeout, scope, args) {
            setTimeout(function() {
                callback.apply(scope, args || []);
            }, timeout);
        },
        
        /**
         * Loop through the array and run the callback for each item.
         * @param {Array} items The array through which to loop.
         * @param {Function} callback The callback function which will be called once
         * for each item in the array.
         * @param {Object} scope Optional scope in which to run the callback
         * 
         * Each call to the callback will be given the parameters:
         * - current array item
         * - current array index
         */
        each: function(items, callback, scope) {
            var lastrc;
            /*
             * Iterate over array
             */
            if (by8.isArray(items)) {
                for (var i=0,len=items.length; i<len; i++) {
                    if (callback) {
                        lastrc = callback.call(scope || items[i], items[i], i);
                        if (lastrc === false) {
                            break;
                        }
                    }
                }
            }
            /*
             * Iterate over object properties
             */
            else if (by8.isObject(items)) {
                for (var p in items) {
                    if (callback) {
                        lastrc = callback.call(scope, items[p], p);
                        if (lastrc === false) {
                            break;
                        }
                    }
                }
            }
        },
        
        /**
         * Convenience function to create an HTML element from a single config.
         * @param {Object} config Configuration object for the element.  Recognized
         * properties of the config object are:
         * - tag The element tag name
         * - html The contents applied to the element's innerHTML
         * - children An array of nested children configurations to append to the
         * - ns The namespace of the element
         * containing element.
         * All other properties are applied as attributes to the element.
         */
        createElement: function(config) {
            var tag = config.tag || 'div',
                ns = config.ns || '',
                css = config.css || '',
                t = ns ? document.createElementNS(ns, tag) : document.createElement(tag),
                children = config.children || [];
            if ('textContent' in t) {
                t.textContent = config.html || '';
            } else {
                t.innerHTML = config.html || '';
            }
            if (css) {
                t.setAttribute('class', css);
            }
            delete config.html; delete config.tag; delete config.children; delete config.ns;
            delete config.css;
            
            config.id = config.id || this.genId();
            for (var p in config) {
                t.setAttribute(p, config[p]);
            }
            
            /*
             * Recursively create/append children.  If a child is a DOM node, append
             * it directly to the EL.
             */
            for (var i=0,len=children.length; i<len; i++) {
                var child = children[i];
                /*
                 * Regular DOM node
                 */
                if (child.nodeName && child.nodeType) {
                    t.appendChild(child);
                }
                /*
                 * Element
                 */
                else if (child.dom) {
                    t.appendChild(child.dom);
                }
                /*
                 * Child config object
                 */
                else {
                    t.appendChild(by8.createElement(child));
                }
            }
            return t;
        },
        
        /**
         * Add a module name and path from which to look for the module code.  If
         * only moduleName is supplied, it's assumed to be the default module path
         * for requests which haven't explicitly set a module path.
         * 
         * @param {String} moduleName The JS module name (package name)
         * @param {String} path The directory path to the root of the module
         */
        addModulePath: function(moduleName, path) {
            if (path) {
                modulePaths[moduleName] = path;
            } else {
                modulePaths.defaultPath = moduleName;
            }
        },
        
        /**
         * Get the script specified by path if it hasn't already been downloaded.
         */
        require: function(module) {
            if (!(includedModules[module] || by8.getProperty(module))) {
                by8.required(module);
                var path = by8.getPathFromModule(module),
                    content = by8.getXhrText(path);
                globalEval(content+'\r\n\r\n//@ sourceURL='+path);
            }
            includedModules[module] = by8.getProperty(module);
            return includedModules[module];
        },
        
        /**
         * Creates the object containers.  Packager servlet also changes by8.require()
         * to by8.required()
         */
        required: function(module) {
            return by8.getProperty(module, true);
        },
        
        /**
         * Same as require, except that the packager adds the module after the
         * calling script.
         * @param module
         * @returns
         */
        include: function(module) {
            return by8.require(module);
        },
        
        /**
         * Convert a module name, such as "by8.Element" to a file path from where
         * the source can be downloaded.
         * @param module The fully-qualified element name
         * @returns {String} The path to download the module source
         */
        getPathFromModule: function(module) {
            /*
             * Explicit file name, just return it
             */
            if (module.match(/\.js$/)) {
                return modulePaths.defaultPath+module;
            }
            /*
             * Remove "by8" namespace since appcontext serves that purpose
             */
            module = module.replace(/^by8\./, '');
            var path = (modulePaths[module] || modulePaths.defaultPath) + module.replace(/\./g, '/') + '.js';
            return path;
        },
        
        ajax: function() {
            return $.ajax.apply($, arguments);
        },
        
        getXhrText: function(path, postdata) {
            var xhr = new XMLHttpRequest();
            xhr.open(postdata ? 'POST' : 'GET', path, false);
            xhr.send(postdata);
            var content = xhr.responseText;
            return content;
        },
        
        /**
         * Gets the property by the dot-notation named path.
         * @param {String} path The named path to the property, i.e., "foo.bar"
         * @param {Boolean} create If true, create container objects to the named
         * property.
         * @return {Object} The property named by the path
         */
        getProperty: function(path, create) {
            function getPaths(path) {
                var parts = path.split(/\./);
                return [parts.shift(), parts.join('.')];
            }
            function get(path, scope) {
                if (!scope) {
                    return;
                }
                if (path.match(/\./)) {
                    var paths = getPaths(path);
                    if (!(paths[0] in scope) && create) {
                        scope[paths[0]] = {};
                    }
                    return get(paths[1], scope[paths[0]]);
                }
                return scope[path];
            }
            return get(path, window);
        },
        
        isArray: function(o) {
//            return by8.isObject(o) && 'length' in o && 'push' in o;
            return by8.isObject(o) && 'length' in o;
        },
        isFunction: function(o) {
            return typeof o === 'function';
        },
        isNumber: function(o) {
            return typeof o === 'number';
        },
        isObject: function(o) {
            return typeof o === 'object';
        },
        isString: function(str) {
            return typeof str === 'string';
        },
        
        proxy: function() {
            return $.proxy.apply($, arguments);
        },
        
        /**
         * Create a new subclass from an optional superclass, applying default
         * properties.  If three arguments are passed, they are assumed to be:
         * <ol>
         * <li>The constructor of the subclass</li>
         * <li>The constructor of the superclass</li>
         * <li>The properties to be applied to the subclass.</li>
         * </ol>
         * 
         * If only two arguments are passed, they are assumed to be:
         * <ol>
         * <li>The constructor of the superclass</li>
         * <li>The properties to be applied to the subclass.</li>
         * </ol>
         * 
         * In both cases, the constructor for the subclass is returned.
         * 
         * @param {String/Function} arg0 (Optional) The constructor of the subclass.
         * The subclass parameter can be a String name of the constructor, i.e.,
         * 'foo.bar.A' or the actual class constructor function.
         * @param {Function} arg1 The constructor of the superclass.
         * @param {Object} arg2 The properties to be applied to the subclass.
         * @return {Function} The constructor for the subclass.
         */
        extend: function(arg0, arg1, arg2) {
            var subclass = arg0, superclass = arg1, properties = arg2;
            if (arguments.length === 2) {
                subclass = undefined;
                superclass = arg0, properties = arg1;
            }
            
            var declaredClass = undefined;
            /*
             * If subclass is a string, get ref to the package object and create the
             * constructor.
             */
            if (typeof subclass == 'string') {
                declaredClass = subclass;
                subclass = by8.getProperty(subclass, true);
            }
            /*
             * Constructor from definition or assign default if none supplied
             */
            if (!subclass) {
                if (properties && properties.hasOwnProperty('constructor')) {
                    subclass = properties.constructor;
                } else {
                    subclass = function() {
                        var sc = superclass,
                            sub = this;
                        sc.apply(sub, arguments);
                    };
                }
            }
            
            if (declaredClass) {
                var pkgName = declaredClass.split(/\./),
                subclassName = pkgName.pop(),
                pkg = by8.getProperty(pkgName.join('.')) || window;
                pkg[subclassName] = subclass;
            }
            
            /*
             * Apply inheritance to prototypes
             */
            subclass.superclass = superclass.prototype;
            by8.mixin(subclass.prototype, properties, {
                declaredClass: declaredClass,
                superclass: superclass.prototype,
                __proto__: superclass.prototype
            });
            return subclass;
        }
    });

    by8.require('jQuery');
    $ = jQuery.noConflict(true);
    by8.include('by8.Element');
    by8.include('by8.Console');
})();
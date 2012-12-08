(function() {
    by8.require('by8.ui.Window');
    
    var my = by8.extend('by8.album.viewer.Viewer', by8.ui.Window, {
        closeAction: 'invisible',
        
        init: function(config) {
            my.superclass.init.call(this, config);
            
            this.view = this.body.createChild({
                css: 'view'
            });
            this.prevButton = this.view.createChild({
                tag: 'span',
                css: 'nav prev',
                html: '<',
                title: 'Previous'
            });
            this.img = this.view.createChild({
                tag: 'img'
            });
            this.video = this.view.createChild({
                tag: 'video',
                children: [{
                    tag: 'source',
                    type: 'video/flv'
                }]
            });
            this.nextButton = this.view.createChild({
                tag: 'span',
                css: 'nav next',
                html: '>',
                title: 'Next'
            });
            
            this.prevButton.on('click', by8.proxy(this.previous, this));
            this.nextButton.on('click', by8.proxy(this.next, this));
        },
        
        setManifest: function(manifest) {
            this.manifest = manifest;
        },
        
        next: function() {
            var current = this.findFile(this.title),
                images = this.manifest.get('images'),
                at = images.indexOf(current)+1;
            if (at >= images.length) {
                at = 0;
            }
            var next = images[at];
            this.showFile(next.lg);
        },
        
        previous: function() {
            var current = this.findFile(this.title),
            images = this.manifest.get('images'),
            at = images.indexOf(current)-1;
            if (at < 0) {
                at = images.length-1;
            }
            var prev = images[at];
            this.showFile(prev.lg);
        },
        
        showFile: function(path) {
            this.setTitle(path);
            var file = this.findFile(path);
                viewSize = this.getProportionalSize(file.w, file.h);
            
            var fullPath = window.urlPrefix+file.lg,
                img = this.img,
                video = this.video;
            if (file.type === 'image') {
                img.show();
                video.hide();
                img.setSize(viewSize);
                img.attr('src', fullPath);
            } else {
                video.show();
                img.hide();
                video.setSize(viewSize);
                video.query('source').attr('src', fullPath);
            }
            this.visible();
        },
        
        findFile: function(path) {
            var file = undefined;
            by8.each(this.manifest.get('images'), function(f) {
                if (f.lg === path) {
                    file = f;
                    return false;
                }
            });
            return file;
        },
        
        /**
         * Given the size of the component under view, return the proportional
         * size of the scaled viewport.
         * @param w
         * @param h
         */
        getProportionalSize: function(w, h) {
            var h_ratio = h/w,
                w_ratio = w/h;
            var pad = 200,
                myWidth = this.body.getSize().width - pad,
                myHeight = this.body.getSize().height;
            var width, height;
            if (w > h) {
                width = myWidth;
                height = (h/w)*myWidth;
                var diff = height - myHeight;
                if (diff > 0) {
                    height = myHeight;
                    width -= diff*w_ratio;
                }
            } else {
                height = myHeight;
                width = (w/h)*myHeight;
                var diff = width - myWidth;
                if (diff > 0) {
                    width = myWidth;
                    height -= diff*h_ratio;
                }
            }
            return {width: Math.round(width), height: Math.round(height)};
        },
        
        /**
         * Given {w, h}, return the center offset size relative to the window
         * @param size
         */
        getCenterOffset: function(size) {
            
        }
        
    });
})();
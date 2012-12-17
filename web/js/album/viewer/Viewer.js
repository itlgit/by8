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
            this.nextButton = this.view.createChild({
                tag: 'span',
                css: 'nav next',
                html: '>',
                title: 'Next'
            });
            
            this.prevButton.on('click', by8.proxy(this.previous, this));
            this.nextButton.on('click', by8.proxy(this.next, this));
            
            this.on(this.closeAction, this.clearView, this);
            this.on('windowresized', this.setSize, this);
        },
        
        createImage: function(thumb, path, w, h) {
            var img = this.view.createChild({
                tag: 'img',
                src: path,
                width: w,
                height: h,
                style: 'background:transparent url("'+thumb+'") 0 0 no-repeat scroll;background-size:'+w+'px '+h+'px',
            });
            return img;
        },
        
        /**
         * Supported aspect ratios of the player, multiplied x100 to avoid
         * precision mismatch.
         */
        aspectRatios: {
            '100': '1:1',
            '150': '3:2',
            '133': '4:3',
            '125': '5:4',
            '155': '14:9',
            '140': '14:10',
            '177': '16:9',
            '160': '16:10'
        },
        
        getAspectRatio: function(w, h) {
            var ratio = String((w/h)*100).substring(0, 3),
                aspect = this.aspectRatios[ratio];
            by8.each(this.aspectRatios, function(ar, dec) {
                dec = Number(dec);
                if (Math.abs(dec - Number(ratio)) <= 10) {
                    aspect = ar;
                    return false;
                }
            });
            return aspect;
        },
        
        createVideo: function(thumb, path, w, h) {
            var flowplayer = by8.require('flowplayer');
            
            var vid = this.view.createChild({
                css: 'video-container',
                style: 'width:'+w+'px;height:'+h+'px'
            });
            flowplayer(vid.id, 'flvplayer/flowplayer-3.2.15.swf', {
                clip: {
                    autoPlay: true,
                    autoBuffering: true
                },
                playlist: [ path ],
                onFinish: function() {
                    console.debug('playback finished');
                }
            });
            return vid;
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
            
            var lgPath = window.urlPrefix+file.lg,
                tnPath = window.urlPrefix+file.tn;
            
            this.clearView();
            if (file.type === 'image') {
                this.fileEl = this.createImage(tnPath, lgPath, viewSize.width, viewSize.height);
            } else {
                this.fileEl = this.createVideo(tnPath, lgPath, viewSize.width, viewSize.height);
            }
            this.view.appendChild(this.fileEl);
            this.visible();
        },
        
        clearView: function() {
            if (this.fileEl) {
                this.fileEl.destroy();
            }
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
            var hpad = 200, vpad = 50,
                myWidth = this.body.getSize().width - hpad,
                myHeight = this.body.getSize().height - vpad;
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
var by8 = {};

require([
//         'https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js',
         'jquery',
         'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js'
         ], function($) {


$.extend(by8, {
    
    /**
     * Initialize the Preview.
     * @param {Function} callback
     * The callback function to run when the initialization is complete.
     */
    initPreview: function(callback) {
        if (!this.items) {
            var items = this.items = [];
            $('.thumbnail-link').each(function(i) {
                /*
                 * Get the thumbnail dimensions and assume the large image height
                 * is tn*1024.  Calculate width from ratio.
                 */
                var w = by8.getItemAttr(i, 'width'),
                h = by8.getItemAttr(i, 'height'),
                ratio = h/w,
                height = 1024,
                width = Math.round(height/ratio),
                type = by8.getItemAttr(i, 'data-type'),
                src = by8.getItemAttr(i, 'data-url');
                
                if (type === 'image') {
                    items.push({
                        src: src,
                        w: width,
                        h: height
                    });
                }
                else if (type === 'video') {
                    items.push({
                        html: by8.createVideoTag(src, i)
                    });
                }
            });
        }
        requirejs(['PhotoSwipe/photoswipe.min',
                   'PhotoSwipe/photoswipe-ui-default.min'], callback);
    },
    
    showPreview: function(uri) {
        var offset = 0;
        $('.thumbnail-link').each(function(i) {
            if ($(this).attr('data-thumbnail') === uri) {
                offset = i;
            }
        });
        if (by8.gallery) {
            by8.gallery.goTo(offset);
        }
        else {
            by8.initPreview(function(PhotoSwipe, PhotoSwipeUI_Default) {
                var options = {
                        index: offset,
                        history: false,
                        getImageURLForShare: by8.getImageURLForShare,
                        getThumbBoundsFn: by8.getThumbBoundsFn
                };
                var pswpElement = $('.pswp')[0];
                var gallery = by8.gallery =
                    new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, by8.items, options);
                gallery.listen('afterChange', by8.onChange);
                gallery.listen('destroy', by8.onGalleryDestroy);
                gallery.init();
            });
        }
    },

    getImageURLForShare: function(shareButtonData) {
        var src = by8.gallery.currItem.src;
        if (shareButtonData.id === 'download') {
            src = src.replace(/thumbs\//, '');
        }
        return src;
    },
    
    /**
     * Get the coordinations from which PhotoSwipe should animate
     */
    getThumbBoundsFn: function(index) {
        var link = $('.thumbnail-link').eq(index),
        offset = link.offset(),
        width = by8.getItemAttr(index, 'width');
        return {
            x: offset.left,
            y: offset.top-50/*navbar*/,
            w: width
        };
    },

    /**
     * Runs after Preview changes slides.  Update the browser's hash with the
     * one for the current slide.
     */
    onChange: function() {
        /*
         * Update browser hash
         */
        var index = by8.gallery.getCurrentIndex(),
        lastIndex = by8.lastIndex,
        hash = by8.getItemAttr(index, 'data-thumbnail');
        document.location.hash = hash;
        /*
         * If previous video, stop it before starting the current one.
         */
        by8.lastIndex = index;
        var video = $('video[data-index="'+lastIndex+'"]')[0];
        if (video) {
            video.pause();
        }
        video = $('video[data-index="'+index+'"]')[0];
        if (video) {
            video.play();
        }
    },
    
    /**
     * Called when the gallery is destroyed.
     */
    onGalleryDestroy: function() {
        delete by8.gallery;
        document.location.hash += '&closed';
        /*
         * Stop current videos
         */
        var index = by8.lastIndex;
        video = $('video[data-index="'+index+'"]')[0];
        if (video) {
            video.pause();
        }
    },
    
    /**
     * Create a video HTML tag for the given URL.
     * @param {String}
     */
    createVideoTag: function(url, index) {
        var video = [
            '<video controls data-index="'+index+'" width="100%" height="100%">',
            '<source type="video/mp4" src="'+url+'"/>',
            '</video>'
        ].join('');
        return video;
    },
    
    /**
     * Given the Slick index, find the id from the parent anchor &lt;a>
     * @param {Number} index
     * The index of the item to find
     * @param {String} attrName
     * The name of the attribute to fetch.  If the attrName isn't found on the
     * link, then search on the underlying "img" element.
     */
    getItemAttr: function(index, attrName) {
        var anchor = $('.thumbnail-link').eq(index),
        value = anchor.attr(attrName);
        if (!value) {
            var img = anchor.find('.thumbnail');
            value = img.attr(attrName);
        }
        return value;
    },
    
    /**
     * Given the <code>url</code>, find the item index
     */
    getIndexFromUrl: function(url) {
        
    },
    
    /**
     * Toggle the visibility of the Preview controls
     */
    toggleControlsVisible: function(visible) {
        var arrow = $(visible && visible.target).is('.slick-arrow'),
        controls = $('.slick-arrow, .close, .navbar, .footer');
        
        if (!arrow) {
            if (!controls.is(':visible') || visible === true) {
                controls.show({
                    duration: 250
                });
            }
            else {
                controls.hide({
                    duration: 250
                });
            }
        }
    }
});
/*
 * On ready
 */
$(function() {
    var links = $('.thumbnail-link'),
    len = links.length;
    /*
     * Change links' 'href' to its 'data-thumbnail'
     */
    links.each(function() {
        var thumb = $(this).attr('data-thumbnail');
        if (thumb) {
            var href = this.href;
            $(this).attr('data-url', href);
            this.href = '#'+thumb;
        }
    });
    /*
     * Handle initial load URL with hashes
     */
    var hash = document.location.hash;
    if (hash && hash.indexOf('&closed') < 0) {
        by8.showPreview(hash.substring(1), true);
    }
    $(window).on('hashchange', function(e) {
        var hash = document.location.hash;
        if (hash && hash.indexOf('&closed') < 0) {
            by8.showPreview(hash.substring(1), true);
        }
        else if (by8.gallery) {
            by8.gallery.close();
        }
    });
});

});
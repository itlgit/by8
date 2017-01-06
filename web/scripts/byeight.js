var by8 = {};

require([
//         'https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js',
         'jquery',
         'slick/slick',
         'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js'
         ], function($) {


$.extend(by8, {
    
    initPreview: function() {
        var items = $('.preview .slick-item'),
        body = $('.preview .body');
        if (!items.length) {
            /*
             * If Preview hasn't yet been populated, query all thumbnails
             * on the page and create a Slick carousel item for them.
             */
            var children = document.createDocumentFragment('div');
            $('.thumbnail').each(function(i) {
                var src = this.src,
                img = document.createElement('img');
                img.className = 'slick-item';
                img.src = src;
                children.appendChild(img);
            });
            body.append(children);
            /*
             * Initialize Slick
             */
            body.on('click', by8.toggleControlsVisible);
            body.on('beforeChange', by8.onBeforeChange);
            body.on('afterChange', by8.onChange);
            body.slick({
                arrows: true,
                infinite: true,
                mobileFirst: true
            });
            $('.preview .close').on('click', by8.hidePreview);
            /*
             * Init PanZoom
             */
        }
    },
    
    /**
     * Show the Preview window and scroll to the image idenfied by the uri.
     * @param {String} uri
     * The URI of the slide to display
     * @param {Boolean} skipAnim
     * True to skip animation of showing Preview
     */
    showPreview: function(uri, skipAnim) {
        $('.lead.images').hide();

        $('.preview').show({
            duration: skipAnim ? 0 : 250,
            complete: function() {
                by8.initPreview();
                /*
                 * Find the offset image to which we need to scroll
                 */
                var body = $('.preview .body'),
                offset = body.slick('slickCurrentSlide');
                $('.thumbnail-link').each(function(i) {
                    if ($(this).data('thumbnail') === uri) {
                        offset = i;
                    }
                });
                body.slick('slickGoTo', offset, skipAnim);
                
            }
        });
    },
    
    /**
     * Hide the Preview
     */
    hidePreview: function() {
        $('.video').remove();
        $('.preview:visible').hide({
            duration: 250
        });
        document.location.hash = '';
        $('.lead.images').show();
        by8.toggleControlsVisible(true);
    },
    
    doImageClick: function(uri) {
        console.debug('image: '+uri);
    },
    
    doVideoClick: function(uri) {
        console.debug('video: '+uri);
    },
    
    /**
     * Run before Preview changes slides.  Detect if image or video and swap out
     * thumbnail with real content.
     */
    onBeforeChange: function(e, slick, currentIndex, nextIndex) {
        var slide = $('.slick-item[data-slick-index='+nextIndex+']'),
        type = by8.getItemAttr(nextIndex, 'data-type');
        
        /*
         * Cleanup previous <video> elements
         */
        $('.video').remove();
        
        var src = by8.getItemAttr(nextIndex, 'data-url');
        if (type === 'image') {
            slide.attr('src', src);
        }
        else if (type === 'video') {
            var track = $('.slick-track'),
            video = by8.createVideoTag(src);
            video.width = slide.width();
            track.append(video);
        }
    },
    /**
     * Runs after Preview changes slides.  Update the browser's hash with the
     * one for the current slide.
     */
    onChange: function(e, slick, currentIndex) {
        var hash = by8.getItemAttr(currentIndex, 'data-thumbnail');
        document.location.hash = hash;
        /*
         * Update footer with image name.
         * TODO: get tags
         */
        var url = by8.getItemAttr(currentIndex, 'data-url'),
        index = url.lastIndexOf('/'),
        name = url.substring(index+1);
        $('.footer .text').html(name);
    },
    
    createVideoTag: function(url) {
        var video = document.createElement('video'),
        source = document.createElement('source');
        
        source.type = 'video/mp4';
        source.src = url;
        video.appendChild(source);
        
        video.autoplay = true;
        video.controls = true;
        video.className = 'video';
        return video;
    },
    
    /**
     * Given the Slick index, find the data-thumbnail from the parent anchor &lt;a>
     */
    getItemAttr: function(index, attrName) {
        var anchor = $('.thumbnail-link')[index];
        return $(anchor).attr(attrName);
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
        var thumb = $(this).data('thumbnail');
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
    if (hash) {
        by8.showPreview(hash.substring(1), true);
    }
    $(window).on('hashchange', function(e) {
        var hash = document.location.hash;
        if (hash) {
            by8.showPreview(hash.substring(1), true);
        }
        else {
            by8.hidePreview();
        }
    });

    /*
     * Handle ESC on main document
     */
    $(document).on('keyup', function(e) {
        if (e.keyCode === 27/*ESC*/) {
            by8.hidePreview();
        }
    });
});

});
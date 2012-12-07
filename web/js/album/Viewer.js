(function() {
by8.require('by8.ui.Window');

var my = by8.extend('by8.album.Viewer', by8.ui.Window, {
    title: 'No media',
    
    css: 'viewer',
    
    collapsible: false,
    
    mediaURL: '',
});
})();
by8.require('by8.album.Navigator');

by8.ready(function() {
    var win = by8(window),
        winWidth = win.innerWidth(),
        winHeight = win.innerHeight(),
        padding = 50;
    var Panel = by8.require('by8.album.FolderPanel'),
        n = new by8.album.Navigator({
        id: 'navigator',
        title: 'Navigator',
        renderTo: '#body',
        x: padding/2,
        y: padding/2,
        width: winWidth - padding,
        height: winHeight - padding,
        children: [
            new Panel({
                title: 'Photos',
                folderPath: 'thumbs/photos/manifest.json'
            }),
            new Panel({
                title: 'Videos',
                folderPath: 'thumbs/videos/manifest.json'
            })
        ]
    });
    by8.fly(window).on('resize', function(e) {
        var w = by8(e.target).innerWidth();
        var h = by8(e.target).innerHeight();
        n.setSize(w - padding, h - padding);
    });
});

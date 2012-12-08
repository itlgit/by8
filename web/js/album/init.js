by8.require('by8.album.Navigator');

by8.ready(function() {
    var win = by8(window),
        winWidth = win.innerWidth(),
        winHeight = win.innerHeight(),
        padding = 50;
    var Panel = by8.require('by8.album.FolderPanel');
    var n = new by8.album.Navigator({
        id: 'navigator',
        title: '<span class="surname"><span class="f">N</span>guyen</span> Family Album',
        renderTo: '#body',
        x: padding/2,
        y: padding/2,
        width: winWidth - padding,
        height: winHeight - padding,
        children: [
            new Panel({
                title: 'Photos',
                initialPath: 'photos'
            }),
            new Panel({
                title: 'Videos',
                initialPath: 'videos'
            })
        ]
    });
    by8.fly(window).on('resize', function(e) {
        var w = by8(e.target).innerWidth();
        var h = by8(e.target).innerHeight();
        n.setSize(w - padding, h - padding);
    });
});

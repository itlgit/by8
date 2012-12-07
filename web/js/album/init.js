by8.require('by8.album.Navigator');

by8.ready(function() {
    var Panel = by8.require('by8.album.FolderPanel'),
        n = new by8.album.Navigator({
        id: 'navigator',
        title: 'Navigator',
        renderTo: '#body',
        x: 25,
        y: 25,
        width: 300,
        height: 500,
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
});

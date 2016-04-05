//
// Start update
//

var updateVideos = function (callback) {

    var curplidx = 0;
    var videos = [];
    var cnt = 1;

    var done = function (videos) {

        var vtext = "";
        $.each(videos, function (idx) {
            vtext += this;
            if (idx < videos.length - 1) {
                vtext += ',';
            }
        });

        var pass = prompt('Update password:');
        $.ajax({
            type: "POST",
            url: 'update.php?pass=' + pass,
            data: '&videos=' + vtext,
            success: function (data) {
                alert(data);
            },
            dataType: 'text'
        });

    }

    if(callback){
        done = callback;
    }

    var loadPlaylist = function (urls, start) {
        if (curplidx >= urls.length) {
            done(videos);
            return;
        }

        url = urls[curplidx];



        var callurl = url + '&alt=json&start-index=' + start + '&max-results=50';
        console.log('Loading playlist '+callurl);

        jQuery.ajax(callurl, {
            dataType: 'json',
            error: function () {
                alert('Error 2')
            },
            success: function (data) {
                console.log(data);
                jQuery.each(data.feed.entry, function () {
                      
                    //videos.push(this.link[0].href);
                    videos.push(this.media$group.yt$videoid.$t);

                    cnt++;

                });
                var total = data.feed.openSearch$totalResults.$t;
                var next = start + 50;
                if (next > total) {
                    curplidx++;
                    loadPlaylist(urls, 1);
                    return;
                }
                loadPlaylist(urls, next);
            }
        });
    }

    jQuery.ajax(
        'https://gdata.youtube.com/feeds/api/users/sonictruth/playlists?v=2', {
            dataType: 'xml',
            error: function () {
                alert('Error')
            },
            success: function (data) {
                var $e = jQuery(data).find('entry')
                var playlisturls = [];
                jQuery.each($e, function () {
                    var title = jQuery(this).find('title').text().toLowerCase();
                    if (title.indexOf('videos official') === 0) { //videos official //music no video iii
                        var plsrc = jQuery(this).find('content').attr('src');
                        playlisturls.push(plsrc);

                       console.log('Found ' + title + '...');
                    }
                });
                curplidx = 0;
                loadPlaylist(playlisturls, 1);

            },
        }
    )

};




//
// End update
//


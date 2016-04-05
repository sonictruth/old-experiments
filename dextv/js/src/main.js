var youtube_player; 
var currentvideo = 0;



// full window resize
$('#player').height($(window).height());
$(window).resize(function () {
    $('#player').height($(window).height());
})


// adding YouTube controls
$(function () {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});

function onYouTubeIframeAPIReady() {
    //noinspection JSUnresolvedFunction,JSUnresolvedVariable
    youtube_player = new YT.Player('player', {
        playerVars: {
            'controls': 0,
            'autoplay': 0,
            'hd': 1
        },
        events: {
            'onError': onPlayerError,
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// playing video in left pane
function play_video(id) {

    console.log('play video', id);
    //noinspection JSUnresolvedFunction

    if (youtube_player) {
        youtube_player.loadVideoById(id, 0);
    }
}

var loadVideos = function () {
    jQuery.ajax('videos.txt', {
        cache: false,
        dataType: 'text',
        error: function () {
            alert('Error 2')
        },
        success: function (data) {
            window.videos = data.split(',');
            $("#status").html(videos.length + " videos loaded");
            if (document.location.hash != '') {
                window.videos = shuffle(window.videos);
                play_video(document.location.hash.substr(1));
            } else {
                $("#msg").modal();
            }



        }
    });

};

function onPlayerError(ev) {
    if (ev.data >= 100) {
        setTimeout(function () {
            playNext();
        }, 1000);
    } else {

    }
}

function playNext() {
    console.log("Play index: " + currentvideo);
    var id = videos[currentvideo];
    currentvideo++;
    if (currentvideo >= videos.length) {
        currentvideo = 0;
    }
    document.location.hash = id;
    play_video(id);

}

function onPlayerReady(evt) {
    loadVideos();
}

function onPlayerStateChange(event) {
    var status = event.data;
    console.log('Status', status)
    if (status == 1) {
        var url = youtube_player.getVideoUrl();
        var title = youtube_player.getVideoData().title;
        window.document.title = "dexTV > " + title;
        $("#artist").html('<a target="_blank" href="' + url + '">' + title + '</a>');
    }
    if (status == 0 || status == 5) {
         playNext();
    }
}

$("#next").click(function () {
    playNext();
});



var getVideosFromPlaylists = function (urls, callback, loadingstatus) {
    console.log('getVideosFromPlaylists', urls);
    loadingstatus('Started loading...');
    var curplidx = 0;
    var videos = [];

    var loadPlaylist = function (urls, start) {

        if (curplidx >= urls.length) {
            callback(videos);
            console.log('getVideosFromPlaylists done', urls.length, curplidx);
            return;
        }

        url = urls[curplidx];

        var callurl = url + '&alt=json&start-index=' + start + '&max-results=50';

        console.log('VideosFromPlaylist :', curplidx, videos.length+1);
        loadingstatus('Playlist' + curplidx + ' ' + videos.length);
        jQuery.ajax(callurl, {
            dataType: 'json',
            error: function () {
                alert('Error 2')
            },
            success: function (data) {
                jQuery.each(data.feed.entry, function () {
                    videos.push(this.media$group.yt$videoid.$t);


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


    loadPlaylist(urls, 1);



};


function showPlaylists(username) {
    getPlaylists(username, listPlaylists);
}

function getPlaylists(username, callback) {

    jQuery.ajax(
        'https://gdata.youtube.com/feeds/api/users/' + username + '/playlists?v=2', {
            dataType: 'xml',
            error: function () {
                alert('Error!')
            },
            success: function (data) {
                var $e = jQuery(data).find('entry')
                var playlisturls = [];
                jQuery.each($e, function () {
                    var title = jQuery(this).find('title').text().toLowerCase();
                    var plsrc = jQuery(this).find('content').attr('src');
                    playlisturls.push({
                        'title': title,
                        'src': plsrc
                    });
                });
                callback(playlisturls);
            },
        }
    )


}



function listPlaylists(playlisturls) {
    if(playlisturls.length==0){
       alert('No public playlists!');
    }else{
    $.modal.close()
    $c = $("#listplaylists .plcontent");
    $c.html('<form id="pllist">');
    $.each(playlisturls, function (idx, o) {
        var h = '<input  type="checkbox" name="pl' + idx + '" value="' + this.src + '">' + this.title + '<br/>';

        $c.append(h);
    });
    $c.append('</form>');
    $("#listplaylists").modal();
    }
}

$("#listplaylists button").click(function () {
    var urls = $("#listplaylists input:checkbox:checked").map(function () {
        return $(this).val();
    }).get();
    $.modal.close();
    $("#loadingstatus").modal();
    $ls = $("#loadingstatus div");
    
    getVideosFromPlaylists(urls, function (newvideos) {
        $.modal.close();
        currentvideo = 0;
        window.videos = shuffle(newvideos);
        playNext();
        $("#status").html(videos.length + " videos");
    }, function(status){ $ls.html(status);    });
});


$("#pall").click(function () {
    $.modal.close()
    window.videos = shuffle(window.videos);
    playNext();
});

$("#p50").click(function () {
    $.modal.close();
    $("#status").html("Latest 50 videos");
    window.videos = window.videos.slice(0, 50);
    playNext();
});


$("#p100").click(function () {
    $.modal.close()
    $("#status").html("Latest 100 videos");
    window.videos = window.videos.slice(0, 100);
    playNext();
});

$("#p200").click(function () {
    $.modal.close()
    $("#status").html("Latest 200 videos");
    window.videos = window.videos.slice(0, 200);
    playNext();
});



$("#pyou").click(function () {
    var user = prompt("Enter youtube username:","subpoprecords");
    showPlaylists(user)
});

function shuffle(array, random) {
    var i = array.length,
        j, swap;
    while (--i) {
        j = (random ? random() : Math.random()) * (i + 1) | 0;
        swap = array[i];
        array[i] = array[j];
        array[j] = swap;
    }
    return array;
}

var t = null;
var auto = false;
var busy = false;

// 
//

var locations = new Array();

locations[0] = [44.420000,44.450000,26.040000,26.150000]; // buc
locations[1] = [51.435604,51.553166,-0.216979,-0.0473785]; // lon
locations[2] = [48.831729,48.885037,2.393646,2.287902]; // paris
locations[3] = [35.663711,35.723660,139.813385,139.710388]; // tokyo
locations[4] = [33.787137,34.082237,-118.082427,-118.383178]; // la
locations[5] = [40.717859,40.822643,-73.950004, -74.012832]; // ny
locations[6] = [55.734069,55.770200,37.649803,37.588348]; // moscow
locations[7] = [52.467514,52.538152,13.320579,13.4764480]; // berlin


var cloc = 0;

function chooseCity(i){
   if(busy){ return false; }
   cloc = i;
   startRendering();

}

function chooseRCity(){
   if(busy){ return false; }
   chooseCity(randomToN(locations.length));
}


//
// Random shit
// 
function randomFloatBetween(minValue, maxValue, precision) {
    if (typeof (precision) == 'undefined') {
        precision = 2;
    }
    return parseFloat(Math.min(minValue + (Math.random() * (maxValue - minValue)), maxValue).toFixed(precision));
}

function randomToN(maxVal, floatVal) {
    var randVal = Math.random() * maxVal;
    return typeof floatVal == 'undefined' ? Math.round(randVal) : randVal.toFixed(floatVal);
}


function startRendering() {
    console.log('start...');
    busy = true;
    clearTimeout(t);

    var lat = randomFloatBetween(locations[cloc][0], locations[cloc][1], 6);
    var long = randomFloatBetween(locations[cloc][2], locations[cloc][3], 6);

    renderPic('dd', lat + ',' + long, null, null);

    /*
    $.ajax({
        url: 'p.php?location=' + r1 + ',' + r2,
        dataType: 'json',
        success: function (d) {
                var r2 = randomFloatBetween(26.040000, 26.150000, 6);
                var r1 = randomFloatBetween(44.420000, 44.450000, 6);

            try {
                //var r1 = d.results[0].geometry.location.lat;
                //var r2 = d.results[0].geometry.location.lng;
               renderPic(d.results[0].formatted_address, r1 + ',' + r2, null, null);
            } catch (e) {

                renderPic('', r1 + ',' + r2, null, null);
            }

        }
    });
    */

}

function renderPic(s, loc, f, h) {


    $('#r').hide();
    $("#loader").show();


    if (h == null) {
        h = randomToN(360);
    }
    var srcReal = 'http://maps.googleapis.com/maps/api/streetview?size=591x391&location=' + loc + '&heading=' + h + '&fov=50&pitch=1&sensor=false';
    var src = 'p2.php?location=' + loc + '&heading=' + h;
    if (f == null) {
        var fil = ['vintage', 'lomo', 'sunrise', 'crossProcess', 'orangePeel', 'love', 'grungy', 'pinhole', 'jarques', 'oldBoot', 'glowingSun', 'hazyDays', 'herMajesty', 'nostalgia', 'hemingway', 'concentrate'];
        var f = fil[Math.floor(Math.random() * fil.length)];
    }
    document.location.href = '#f=' + f + '&loc=' + loc + '&h=' + h;
    if (!Modernizr.canvas) {
        Caman(src, "#pcanvas", function () {
            var d = document.getElementById('pcanvas').getContext('2d').getImageData(1, 1, 3, 3).data;
            if (d[0] == 228 && d[1] == 227 && d[2] == 223) {
                console.log('Missing street view');
                t = setTimeout(startRendering, 3500);
                return;
            } else {
                this[f]().render(showme);
            }
        });
    } else {
        $('#pcanvas').replaceWith('<img id="pcanvas" onload="showme();" src="' + srcReal + '" width="591" height="391">');
    }
    $('#pcanvas')[0].onclick = function () {
        var gmapurl = 'https://maps.google.com/maps?q=' + loc;
        window.open(gmapurl, 'randombmap', 'width=800,height=600,location=0,toolbar=0,menubar=0')
    };
    var p1 = phrases[0][randomToN(9)];
    var p2 = phrases[1][randomToN(9)];
    var p3 = phrases[2][randomToN(9)];
    var p4 = phrases[3][randomToN(9)];
    var p5 = phrases[4][randomToN(9)];
    $('#rtxt').html(p1 +' ' + p2+' ' +p3+' ' +p4+' ' +p5);
}

function showme() {
    busy = false;
    $('#polh').rotate(0);
    $("#loader").hide();
    var cfg = {
        animateTo: -5
    };
    $("#r").fadeIn('slow', function () {
        $('#polh').rotate(cfg);
    })
    if (auto) {
        t = setTimeout(startRendering, 5500);
    } else {}
}

function next() {
    if(busy){ return false; }
    clearTimeout(t);
    auto = false;
    $("#loader").show();
    $("#r").hide();
    startRendering();
    return false;
}

function autoz() {
    clearTimeout(t);
    $("#r").hide();
    auto = true;
    startRendering();
    return false;
}

function stopz() {
    clearTimeout(t);
    auto = false;
    return false;
}


function getURLParameter(name) {
    return decodeURI(
    (RegExp(name + '=' + '(.+?)(&|$)').exec(location.href) || [, null])[1]);
}

//
// Ready for action
//

$(document).ready(function () {
    if (Modernizr.canvas) {
        $("#polh").rotate({
            bind: {
                mouseover: function () {
                    $(this).rotate({
                        animateTo: 0
                    })
                },
                mouseout: function () {
                    $(this).rotate({
                        animateTo: -5
                    })
                }
            }
        });
    }
    if (getURLParameter('f') != 'null' && getURLParameter('loc') != 'null') {
        renderPic('', getURLParameter('loc'), getURLParameter('f'), getURLParameter('h'))
    } else {
        startRendering();
    }
})


var phrases = new Array();

phrases[0] = new Array();

phrases[0][0] = "I'm troubled by how";
phrases[0][1] = "With regard to the issue of content,";
phrases[0][2] = "I find this work menacing/playful because of the way";
phrases[0][3] = "It should be added that";
phrases[0][4] = "I disagree with some of the things that have just been said, but";
phrases[0][5] = "Although I am not a painter, I think that";
phrases[0][6] = "Umm...";
phrases[0][7] = "I'm surprised that no one's mentioned yet that";
phrases[0][8] = "It's difficult to enter into this work because of how";
phrases[0][9] = "As an advocate of the Big Mac Aesthetic, I feel that";

phrases[1] = new Array();

phrases[1][0] = "the internal dynamic";
phrases[1][1] = "the sublime beauty";
phrases[1][2] = "the disjunctive perturbation";
phrases[1][3] = "the optical suggestions";
phrases[1][4] = "the reductive quality";
phrases[1][5] = "the subaqueous qualities";
phrases[1][6] = "the iconicity";
phrases[1][7] = "the aura";
phrases[1][8] = "the mechanical mark-making";
phrases[1][9] = "the metaphorical resonance";

phrases[2] = new Array();
phrases[2][0] = "of the biomorphic forms";
phrases[2][1] = "of the sexual signifier";
phrases[2][2] = "of the negative space";
phrases[2][3] = "of the spatial relationships";
phrases[2][4] = "of the facture";
phrases[2][5] = "of the purity of line";
phrases[2][6] = "of the Egyptian motifs";
phrases[2][7] = "of the gesture";
phrases[2][8] = "of the figurative-narrative line-space matrix";
phrases[2][9] = "of the sexy fish";

phrases[3] = new Array();

phrases[3][0] = "verges on codifying";
phrases[3][1] = "seems very disturbing in light of";
phrases[3][2] = "contextualize";
phrases[3][3] = "endangers the devious simplicity of";
phrases[3][4] = "brings within the realm of discourse";
phrases[3][5] = "makes resonant";
phrases[3][6] = "visually and conceptually activates";
phrases[3][7] = "notates";
phrases[3][8] = "spatially undermines";
phrases[3][9] = "threatens to penetrate";


phrases[4] = new Array();

phrases[4][0] = "the accessibility of the work.";
phrases[4][1] = "a participation in the critical dialogue of the 90s.";
phrases[4][2] = "the eloquence of these pieces.";
phrases[4][3] = "the remarkable handling of ljght.";
phrases[4][4] = "the inherent overspecificity.";
phrases[4][5] = "the distinctive formal juxtapositions.";
phrases[4][6] = "the essentially transitional quality.";
phrases[4][7] = "the larger carcass.";
phrases[4][8] = "the substructure of critical thinking.";
phrases[4][9] = "the exploration of montage elements.";

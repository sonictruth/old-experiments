function chooseCity(a){return busy?!1:(cloc=a,startRendering(),void 0)}function chooseRCity(){return busy?!1:(chooseCity(randomToN(locations.length)),void 0)}function randomFloatBetween(a,b,c){return"undefined"==typeof c&&(c=2),parseFloat(Math.min(a+Math.random()*(b-a),b).toFixed(c))}function randomToN(a,b){var c=Math.random()*a;return"undefined"==typeof b?Math.round(c):c.toFixed(b)}function startRendering(){console.log("start..."),busy=!0,clearTimeout(t);var a=randomFloatBetween(locations[cloc][0],locations[cloc][1],6),b=randomFloatBetween(locations[cloc][2],locations[cloc][3],6);renderPic("dd",a+","+b,null,null)}function renderPic(a,b,c,d){$("#r").hide(),$("#loader").show(),null==d&&(d=randomToN(360));var e="http://maps.googleapis.com/maps/api/streetview?size=591x391&location="+b+"&heading="+d+"&fov=50&pitch=1&sensor=false",f="p2.php?location="+b+"&heading="+d;if(null==c)var g=["vintage","lomo","sunrise","crossProcess","orangePeel","love","grungy","pinhole","jarques","oldBoot","glowingSun","hazyDays","herMajesty","nostalgia","hemingway","concentrate"],c=g[Math.floor(Math.random()*g.length)];document.location.href="#f="+c+"&loc="+b+"&h="+d,Modernizr.canvas?$("#pcanvas").replaceWith('<img id="pcanvas" onload="showme();" src="'+e+'" width="591" height="391">'):Caman(f,"#pcanvas",function(){var a=document.getElementById("pcanvas").getContext("2d").getImageData(1,1,3,3).data;return 228==a[0]&&227==a[1]&&223==a[2]?(console.log("Missing street view"),t=setTimeout(startRendering,3500),void 0):(this[c]().render(showme),void 0)}),$("#pcanvas")[0].onclick=function(){var a="https://maps.google.com/maps?q="+b;window.open(a,"randombmap","width=800,height=600,location=0,toolbar=0,menubar=0")};var h=phrases[0][randomToN(9)],i=phrases[1][randomToN(9)],j=phrases[2][randomToN(9)],k=phrases[3][randomToN(9)],l=phrases[4][randomToN(9)];$("#rtxt").html(h+" "+i+" "+j+" "+k+" "+l)}function showme(){busy=!1,$("#polh").rotate(0),$("#loader").hide();var a={animateTo:-5};$("#r").fadeIn("slow",function(){$("#polh").rotate(a)}),auto&&(t=setTimeout(startRendering,5500))}function next(){return busy?!1:(clearTimeout(t),auto=!1,$("#loader").show(),$("#r").hide(),startRendering(),!1)}function autoz(){return clearTimeout(t),$("#r").hide(),auto=!0,startRendering(),!1}function stopz(){return clearTimeout(t),auto=!1,!1}function getURLParameter(a){return decodeURI((RegExp(a+"="+"(.+?)(&|$)").exec(location.href)||[,null])[1])}var t=null,auto=!1,busy=!1,locations=new Array;locations[0]=[44.42,44.45,26.04,26.15],locations[1]=[51.435604,51.553166,-.216979,-.0473785],locations[2]=[48.831729,48.885037,2.393646,2.287902],locations[3]=[35.663711,35.72366,139.813385,139.710388],locations[4]=[33.787137,34.082237,-118.082427,-118.383178],locations[5]=[40.717859,40.822643,-73.950004,-74.012832],locations[6]=[55.734069,55.7702,37.649803,37.588348],locations[7]=[52.467514,52.538152,13.320579,13.476448];var cloc=0;$(document).ready(function(){Modernizr.canvas&&$("#polh").rotate({bind:{mouseover:function(){$(this).rotate({animateTo:0})},mouseout:function(){$(this).rotate({animateTo:-5})}}}),"null"!=getURLParameter("f")&&"null"!=getURLParameter("loc")?renderPic("",getURLParameter("loc"),getURLParameter("f"),getURLParameter("h")):startRendering()});var phrases=new Array;phrases[0]=new Array,phrases[0][0]="I'm troubled by how",phrases[0][1]="With regard to the issue of content,",phrases[0][2]="I find this work menacing/playful because of the way",phrases[0][3]="It should be added that",phrases[0][4]="I disagree with some of the things that have just been said, but",phrases[0][5]="Although I am not a painter, I think that",phrases[0][6]="Umm...",phrases[0][7]="I'm surprised that no one's mentioned yet that",phrases[0][8]="It's difficult to enter into this work because of how",phrases[0][9]="As an advocate of the Big Mac Aesthetic, I feel that",phrases[1]=new Array,phrases[1][0]="the internal dynamic",phrases[1][1]="the sublime beauty",phrases[1][2]="the disjunctive perturbation",phrases[1][3]="the optical suggestions",phrases[1][4]="the reductive quality",phrases[1][5]="the subaqueous qualities",phrases[1][6]="the iconicity",phrases[1][7]="the aura",phrases[1][8]="the mechanical mark-making",phrases[1][9]="the metaphorical resonance",phrases[2]=new Array,phrases[2][0]="of the biomorphic forms",phrases[2][1]="of the sexual signifier",phrases[2][2]="of the negative space",phrases[2][3]="of the spatial relationships",phrases[2][4]="of the facture",phrases[2][5]="of the purity of line",phrases[2][6]="of the Egyptian motifs",phrases[2][7]="of the gesture",phrases[2][8]="of the figurative-narrative line-space matrix",phrases[2][9]="of the sexy fish",phrases[3]=new Array,phrases[3][0]="verges on codifying",phrases[3][1]="seems very disturbing in light of",phrases[3][2]="contextualize",phrases[3][3]="endangers the devious simplicity of",phrases[3][4]="brings within the realm of discourse",phrases[3][5]="makes resonant",phrases[3][6]="visually and conceptually activates",phrases[3][7]="notates",phrases[3][8]="spatially undermines",phrases[3][9]="threatens to penetrate",phrases[4]=new Array,phrases[4][0]="the accessibility of the work.",phrases[4][1]="a participation in the critical dialogue of the 90s.",phrases[4][2]="the eloquence of these pieces.",phrases[4][3]="the remarkable handling of ljght.",phrases[4][4]="the inherent overspecificity.",phrases[4][5]="the distinctive formal juxtapositions.",phrases[4][6]="the essentially transitional quality.",phrases[4][7]="the larger carcass.",phrases[4][8]="the substructure of critical thinking.",phrases[4][9]="the exploration of montage elements.";

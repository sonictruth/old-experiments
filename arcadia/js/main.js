/*global $:false */


$(function () {
    'use strict';

    var Attraction = function (type, rating, places) {
        this.type = type;
        this.rating = rating;
        this.places = places;
    };

    var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

    var attractions = [];
    attractions.push(new Attraction("Culture", 0, ['Arcadia Museum of Fine Arts', 'Museum of Natural History', 'Arcadia Castle']));
    attractions.push(new Attraction("Sightseeing", 0, ['Arc Park', 'Arcadia Waterfall']));
    attractions.push(new Attraction("Entertainment", 0, ['Arcadia Zoo', 'Arcadia Fun Land']));
    attractions.push(new Attraction("Shopping", 0, ['Shopping Arcadia', 'Arcadia Stores']));

    // step validators

    var validators = {};
    validators.choosedate = function () {
        // nothing to do now
        return true;
    };

    validators.choosepeople = function () {
        if ($("#people-ages .age").length === 0) {
            return "Nobody ?";
        }

        // check for kids:
        $(".age").each(function () {
            if ($(this).val() == "12") {
               // do something
           }
       });

        return true;
    };



    // helper functions
    var showAlert = function (text) {
        var $modal = $("#alert-modal");
        $modal.find(".modal-body").html(text);
        $modal.modal("show");
    };

    var getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    var getDateString = function (date) {
        return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
    };

    var sortAttractions = function() {
        attractions.sort(function (a, b) {
            if (a.rating < b.rating) return true;
        });
    };

    // navigation
    $(".btn-next,.btn-prev").click(function () {
        var btn = this;
        var isNext = $(btn).hasClass("btn-next");
        var $step = $(btn).parents(".step");
        var validator = $step.data("validator");
        // validate
        if (isNext && validators[validator]) {
            var result = validators[validator]();
            if (result !== true) {
                showAlert(result);
                return;
            }
        }
        $step.fadeOut(500, function () {
            if (isNext) {
                $step.next().fadeIn();
                window.location.hash = $step.index() + 1;
            } else {
                $step.prev().fadeIn();
                window.location.hash = $step.index() - 1;
            }
        });
        return false;
    });


    // chose dates step
    var $startDate = $('#start-date').datetimepicker({
        bootcssVer: 3,
        format: 'mm/dd/yyyy',
        todayBtn: true,
        todayHighlight: true,
        maxView: 3,
        minView: 2
    });
    var $endDate = $('#end-date').datetimepicker({
        bootcssVer: 3,
        format: 'mm/dd/yyyy',
        todayBtn: false,
        todayHighlight: false,
        maxView: 3,
        minView: 2
    });


    var nowDate = new Date();
    var nextDay = new Date(nowDate.getTime());
    nextDay.setDate(nowDate.getDate() + 1);

    $startDate.datetimepicker('setStartDate', getDateString(nowDate));
    $endDate.datetimepicker('setStartDate', getDateString(nextDay));
    $endDate.datetimepicker('setDate', nextDay);

    $startDate.datetimepicker().on('changeDate', function (ev) {
        var st = $startDate.datetimepicker('getDate').getTime();
        var et = $endDate.datetimepicker('getDate').getTime();

        if (st > et) {
            $endDate.datetimepicker('setDate', $startDate.datetimepicker('getDate'));
        }

    });

    $endDate.datetimepicker().on('changeDate', function (ev) {
        var st = $startDate.datetimepicker('getDate').getTime();
        var et = $endDate.datetimepicker('getDate').getTime();

        if (et < st) {
            $startDate.datetimepicker('setDate', $endDate.datetimepicker('getDate'));
        }

    });


    // people and age step
    $("#people-count").on('change', function () {
        var howmany = parseInt(this.value);
        if (isNaN(howmany)) 
            { howmany = 0;}
        if (howmany > 50) {howmany = 50;}

        var howmanyInputs = $("#people-ages .age").length;
        if ($(howmanyInputs < howmany)) {
            var toAdd = howmany - howmanyInputs;
            for (var i = 1; i <= toAdd; i++) {
                $("#choose-age").clone().removeAttr("id").addClass("age").show().appendTo("#people-ages");
            }
        }
       
        if (howmanyInputs > howmany) {
            var toRemove = howmanyInputs - howmany;
            for (var j = 1; j <= toRemove; j++) {
                $("#people-ages .age").last().remove();
            }
        }
        $("#people-ages").fadeIn();

    });



    // attractions
    for (var i = 0; i < attractions.length; i++) {
        var prefixId = "rating-input-";
        var attractionType = attractions[i].type;
        var id = prefixId + attractionType;
        $('<h3>' + attractionType + '</h3><input id="' + id + '" type="number" /><br/>').appendTo("#personal-preferences");
        $('#' + id).rating({
            min: 0,
            max: 5,
            step: 0.5,
            showClear: false,
            showCaption: false,
            size: 'xs'
        }).on("rating.change", function (event, value, caption) {
            var currentAttractionYype = event.target.id.split(prefixId).join("");
            var result = $.grep(attractions, function (e) {
                return e.type == currentAttractionYype;
            });
            result[0].rating += value;
        });
    }


    // send data to server 
    $(".btn-senddata").on("click", function () {
        $(".step").hide();
        $(".loading").fadeIn();
        window.location.hash = "";
        sortAttractions();


        // show results
        var $attractionsResults = $("#attractions-results");
        $attractionsResults.html('<thead><tr><th>Attraction</th><th>Price</th><th>Day</th><th></th></tr></thead>');
        var arow = "";
        for (var i = 0; i < attractions.length; i++) {
            var places = attractions[i].places;

            for (var j = 0; j < places.length; j++) {
                var p = places[j];
                // generate a random date in range
                var sd = $startDate.datetimepicker("getDate").getTime();
                var ed = $endDate.datetimepicker("getDate").getTime();

                var D = new Date(getRandomInt(sd, ed));
                var dealDateStr = (D.getDate()) + "th of " + monthNames[D.getMonth()];
                arow +="<tr><td class='handwriting'>" + p + "</td><td>$" + getRandomInt(1, 20) + "</td><td>" + dealDateStr + "</td></td><td class='text-right'> <button class='btn btn-default'' type='submit'>Add to Schedule</button> <button class='btn btn-success' type='submit'>Buy</button> </td></tr>";
                
            }
        }
        $(arow).appendTo($attractionsResults);

        setTimeout(function () {
            $(".loading").hide();
            $(".results").fadeIn();
        }, 4000);

    });


    
    var step = $(".step").get(window.location.hash.split("#").join(""));

    if ($(step).length == 1) {
        $(step).fadeIn();
    } else {
        $(".step").first().fadeIn();
    }

});

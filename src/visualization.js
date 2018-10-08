var debug = false;

define(['qlik', 'jquery', './config', './../js/jQuery.slider.custom', "text!./../css/style.css"],
    function (qlik, $, config, slider, style) {
        'use strict';

        $("<style>").html(style).appendTo("head");

        return {
            definition: config.definition,
            initialProperties: config.initialProperties,
            about: config.about,
            paint: main
        };

        function main($element, layout) {

            var app = qlik.currApp(this);
            var visualizationThis = this;
            var values = [];
         
            if (typeof layout.axeed === 'undefined') {
                var visualization = {};
            } else {
                var visualization = layout.axeed;
            }

            $element.empty();

            setupState(visualizationThis, visualization, layout);
            setupProperties($element, visualization, layout, layout.qInfo.qId);
            getListFieldData(visualizationThis, layout, values);
            setUpEvents();

            function getListFieldData(visualizationThis, layout, values) {

                if ((layout.qListObject != undefined && layout.qListObject.qDimensionInfo.qFallbackTitle != visualizationThis.state.field) ||
                    (visualizationThis.state.field != "" && visualizationThis.state.values.length == 0)) {

                    visualizationThis.state.field = layout.qListObject.qDimensionInfo.qFallbackTitle;

                    if (layout.qListObject.qDataPages != undefined || layout.qListObject.qDataPage.length > 0) {

                        let data = layout.qListObject.qDataPages[0].qMatrix;
                        values = [];

                        for (let i = 0; i < data.length; i++) {
                            values.push(data[i][0]);
                        }

                        if (values.length > 0) {

                            values = values.sort(function (a, b) {
                                let aValue = a.qNum == "NaN" ? a.qNum : a.qText;
                                let bValue = b.qNum == "NaN" ? b.qNum : b.qText;
                                return aValue == bValue ? 0 : +(aValue > bValue) || -1;
                            });
                            visualizationThis.state.values = values;
                            visualizationThis.state.maxValue = values.length - 1;
                        }
                    }
                }
            }

            function setUpEvents() {


                let sliderTooltip = function (event, ui) {
                    let qsItem = visualizationThis.state.values[visualizationThis.state.iterator];
                    let curValue = qsItem.qText;
                    let tooltip = '<div class="tooltip"><div class="tooltip-inner">' + curValue + '</div><div class="tooltip-arrow"></div></div>';
                    $('.ui-slider-handle').html(tooltip);
                }

                $("#slider").slider({
                    value: visualizationThis.state.iterator == -1 ? 0 : visualizationThis.state.iterator,
                    min: visualizationThis.state.minValue,
                    max: visualizationThis.state.maxValue,
                    step: visualizationThis.state.step,
                    range: false,
                    create: sliderTooltip,
                    slide: sliderTooltip,
                    stop: function (event, ui) {

                        visualizationThis.state.iterator = ui.value > visualizationThis.state.values.length ? 0 : ui.value;
                        setSlide(visualizationThis.state.values[visualizationThis.state.iterator]);
                    }
                });

                $("#play").click(function () {
                    visualizationThis.state.play = visualizationThis.state.play ? false : true;
                    if (!visualizationThis.state.play) {
                        $("#play").text('Play');
                        if (visualizationThis.state.playInterval != undefined)
                            clearInterval(visualizationThis.state.playInterval);
                        return;
                    }
                    else {
                        $("#play").text('Stop');
                        visualizationThis.state.playInterval = setInterval(function () {
                            if (visualizationThis.state.iterator >= visualizationThis.state.values.length - 1) {
                                visualizationThis.state.iterator = -1;
                                return;
                            }
                            visualizationThis.state.iterator++;
                            let qItem = visualizationThis.state.values[visualizationThis.state.iterator];
                            setSlide(qItem, visualizationThis.state.iterator);


                        }, visualizationThis.state.interval);
                    }
                });
            }


            function setSlide(item, iterator) {
                let qValue = item.qNum == "NaN" ? item.qText : item.qNum;
                app.field(visualizationThis.state.field).clear();
                app.field(visualizationThis.state.field).selectValues([qValue], true, true);
                $("#slider").slider("value", iterator);
            }


            function setupProperties($element, visualization, layout, id) {

                let properties = visualization.properties;

                if (typeof properties === 'undefined') {
                    properties = visualization.properties = {};
                }

                properties.id = id;
                properties.rootDivId = 'viz_slider_' + id;
                properties.class = 'qlSlider';

                if (layout.props != undefined) {
                    properties.refVar = layout.props['refVar'];
                }

                let label = visualizationThis.state.play ? 'Stop' : 'Play';
                let htmlStr = '<div id="' + properties.rootDivId + ' style="width:100%;">' +
                    '<button id="play" class="play" style="margin-top:5px">' +
                    label +
                    '</button><div style="margin-left:2%;margin-top:17px;width:90%;float:left"> <div id="slider"></div></div><span id="sliderMsg"></span>' +
                    '</div>';

                $element.html(htmlStr);


            }

            function setupState(visualizationThis, visualization, layout) {

                let state = visualizationThis.state;

                if (typeof state === 'undefined') {
                    state = visualizationThis.state = {}
                    state.play = false;
                    state.playInterval = undefined;
                    state.values = [];
                    state.minValue = 0;
                    state.maxValue = 0;
                    state.field = "";
                    state.sliderValues = [];
                    state.iterator = 0;
                }

                state.interval = layout.qSlider.qInterval;
                state.step = layout.qSlider.qStaticStep;
            }
        }
    });

/*
 --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 PAM: Helper Section
 --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/
Array.prototype.max = function () {
    return Math.max.apply(null, this);
};

Array.prototype.min = function () {
    return Math.min.apply(null, this);
};

function addOrRemove(array, value) {

    let index = array.indexOf(value);
    if (index === -1) {
        array.push(value);
    } else {
        array.splice(index, 1);
    }
}

function isInArray(value, array) {
    return array.indexOf(value) > -1;
}
let map; //地图容器
let layerArray; //

window.onload = function () {
    let center = [12735697.59001188, 3573981.441510862];
    //最大级数
    let maxZoom = 30;
    //初始化地图图层
    let layer1 = new Zondy.Map.GoogleLayer({
        layerType: Zondy.Enum.Map.GoogleLayerType.VEC_IGS,
        ip: "develop.smaryun.com",
        port: "6163"
    });
    let layer2 = new Zondy.Map.GoogleLayer({
        layerType: Zondy.Enum.Map.GoogleLayerType.RASTER_IGS,
        ip: "develop.smaryun.com",
        port: "6163"
    });
    let layer3 = new Zondy.Map.GoogleLayer({
        layerType: Zondy.Enum.Map.GoogleLayerType.TERRAIN_IGS,
        ip: "develop.smaryun.com",
        port: "6163"
    });
    let layer4 = new Zondy.Map.GoogleLayer({
        layerType: Zondy.Enum.Map.GoogleLayerType.ROAD_IGS,
        ip: "develop.smaryun.com",
        port: "6163"
    });
    layerArray = [layer1, layer2, layer3, layer4];

    map = new ol.Map({
        //添加图层
        layers: [layer1],
        //目标DIV
        target: 'mapCon',
        view: new ol.View({
            center: center,
            maxZoom: maxZoom,
            minZoom: 4,
            zoom: 12
        })
    });
    //实例化鹰眼控件（OverviewMap）,自定义样式的鹰眼控件
    var overviewMapControl = new ol.control.OverviewMap({
        //鹰眼控件样式（see in overviewmap-custom.html to see the custom CSS used）
        className: 'ol-overviewmap ol-custom-overviewmap',
        //鹰眼中加载同坐标系下不同数据源的图层
        layers: [
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: "http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=" +
                        "b5cda9cb266f640b762cf41d3674e2c8", //parent.TiandituKey()为天地图密钥,
                    wrapX: false
                })
            }),
            new ol.layer.Tile({
                title: "天地图矢量注记图层",
                source: new ol.source.XYZ({
                    url: "http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=" +
                        "b5cda9cb266f640b762cf41d3674e2c8", //parent.TiandituKey()为天地图密钥
                })
            })
        ],
        //鹰眼控件展开时功能按钮上的标识（网页的JS的字符编码）
        collapseLabel: '\u00BB',
        //鹰眼控件折叠时功能按钮上的标识（网页的JS的字符编码）
        label: '\u00AB',
        //初始为展开显示方式
        collapsed: false
    });
    map.addControl(overviewMapControl);

    //实例化zoomToExtent控件并加载到地图容器中
    var zoomToExtent = new ol.control.ZoomToExtent({
        extent: [12733450, 3569910, 12735844, 3571692],
        tipLabel: "定位到当前位置",
        label: "O"

    });
    map.addControl(zoomToExtent);

    //实例化比例尺控件（ScaleLine）
    var scaleLineControl = new ol.control.ScaleLine({
        //设置比例尺单位，degrees、imperial、us、nautical、metric（度量单位）
        units: "metric"
    });
    map.addControl(scaleLineControl);

    //实例化鼠标位置控件（MousePosition）
    var mousePositionControl = new ol.control.MousePosition({
        //坐标格式
        coordinateFormat: ol.coordinate.createStringXY(4),
        //地图投影坐标系（若未设置则输出为默认投影坐标系下的坐标）
        projection: 'EPSG:4326',
        // projection: 'EPSG:3857',
        //坐标信息显示样式类名，默认是'ol-mouse-position'
        className: 'custom-mouse-position',
        //显示鼠标位置信息的目标容器
        target: document.getElementById('mouse-position'),
        //未定义坐标的标记
        undefinedHTML: '&nbsp;'
    });
    map.addControl(mousePositionControl);

    $('.ol-zoom-in').hide();
    $('.ol-zoom-out').hide();
    addLayer();
    addListener();
    init_case();
    // init_police();
    addPopup();
};
addLayer = function () {
    // let name = "addimg";
    // //地图文档名称
    // let docname = "images";
    // mapDocLayer = new Zondy.Map.Doc(name, docname, {
    //     //IP地址
    //     ip: "localhost",
    //     //端口号
    //     port: "6163"
    // });
    // map.addLayer(mapDocLayer);
    $.fn.RangeSlider = function (cfg) {
        this.sliderCfg = {
            min: cfg && !isNaN(parseFloat(cfg.min)) ? Number(cfg.min) : null,
            max: cfg && !isNaN(parseFloat(cfg.max)) ? Number(cfg.max) : null,
            step: cfg && Number(cfg.step) ? cfg.step : 1,
            callback: cfg && cfg.callback ? cfg.callback : null
        };

        let $input = $(this);
        let min = this.sliderCfg.min;
        let max = this.sliderCfg.max;
        let step = this.sliderCfg.step;
        let callback = this.sliderCfg.callback;

        $input.attr('min', min)
            .attr('max', max)
            .attr('step', step);

        $input.bind("input", function (e) {
            $input.attr('value', this.value);
            $input.css('background', 'linear-gradient(to right, #059CFA, white ' + this.value + '%, white)');

            if ($.isFunction(callback)) {
                callback(this);
            }
        });
    };
};

let nearDis; //r
let query;
showPointSeachRadius = function (query_) {
    query = query_;
    // document.getElementById("point-radius-box").style.display="block";
};
surePointRadius = function () {
    nearDis = document.getElementById("point-radius-input").value;
    if (isNaN(parseFloat(nearDis))) {
        nearDis = 0.5;
    }
    if (query === 'point') {
        queryVectorLayerPoint();
    } else {
        queryVectorLayerLine();
    }
};

let createCaseStyle = function (opacity = 0.75) {
    return new ol.style.Style({
        /**{olx.style.IconOptions}类型*/
        image: new ol.style.Icon(
            ({
                anchor: [0.5, 60],
                anchorOrigin: 'top-right',
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                offsetOrigin: 'top-right',
                // offset:[0,10],
                //图标缩放比例
                scale: 0.15,
                //透明度
                opacity: opacity,
                //图标的url
                src: './image/case2.png'
            })
        )
    });
};
let createPoliceStyle = function (opacity = 0.75) {
    return new ol.style.Style({
        /**{olx.style.IconOptions}类型*/
        image: new ol.style.Icon(
            ({
                anchor: [0.5, 60],
                anchorOrigin: 'top-right',
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                offsetOrigin: 'top-right',
                // offset:[0,10],
                //图标缩放比例
                scale: 0.15,
                //透明度
                opacity: opacity,
                //图标的url
                src: './image/police3.png'
            })
        )
    })
};
let createMedicalStyle = function (opacity = 0.75) {
    return new ol.style.Style({
        /**{olx.style.IconOptions}类型*/
        image: new ol.style.Icon(
            ({
                anchor: [0.5, 60],
                anchorOrigin: 'top-right',
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                offsetOrigin: 'top-right',
                // offset:[0,10],
                //图标缩放比例
                scale: 0.7,
                //透明度
                opacity: opacity,
                //图标的url
                src: './image/medical.png'
            })
        )
    })
};

let caseSource;
let caseVector;
let caseArray;
let policeArray;
let policeSource;
let policeVector;
init_case = function () {
    $.ajax({
        url: 'http://gis.ylsislove.com:4999/get_wuhan2',
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            caseArray = [];
            let len = data.length;
            for (let i = 0; i < len; ++i) {
                let point = new ol.Feature({
                    geometry: new ol.geom.Point([data[i].X, data[i].Y]),
                    case_id: data[i].case_id,
                    case_name: data[i].case_name,
                    position_type: data[i].position_type,
                    time: data[i].time,
                    case_position: data[i].case_address,
                    lng: data[i].lng,
                    lat: data[i].lat,
                    case_description: data[i].case_description,
                    area: data[i].case_area,
                    X: data[i].X,
                    Y: data[i].Y
                });
                point.setStyle(createCaseStyle(0));
                caseArray.push(point);
            }
            caseSource = new ol.source.Vector({
                features: caseArray
            });
            //创建一个图层
            caseVector = new ol.layer.Vector({
                source: caseSource
            });
            map.addLayer(caseVector);
        }
    })

};
init_police = function () {
    $.ajax({
        url: 'http://gis.ylsislove.com:4999/get_police',
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            policeArray = [];
            let len = data.length;
            for (let i = 0; i < len; ++i) {
                let point = new ol.Feature({
                    geometry: new ol.geom.Point([data[i].X, data[i].Y]),
                    police_station_id: data[i].police_station_id,
                    id: data[i].id,
                    lng: data[i].lng,
                    lat: data[i].lat,
                    X: data[i].X,
                    Y: data[i].Y,
                    address: data[i].address,
                    name: data[i].name,
                    photos: data[i].photos,
                    tel: data[i].tel,
                });
                point.setStyle(createPoliceStyle(0));
                policeArray.push(point);
            }
            policeSource = new ol.source.Vector({
                features: policeArray
            });
            //创建一个图层
            policeVector = new ol.layer.Vector({
                source: policeSource
            });
            map.addLayer(policeVector);
        }
    })
};
//--------------------------------------------------------------------
let flag = 0;
let DrawVector;
let draw;
let output;
let geom;
clearQuery = function () {
    // if (flag!==0){
    //     map.removeLayer(resultVector);
    // }
    // map.addLayer(caseVector);
    for (let item of queryResult) {
        item.setStyle(createCaseStyle(0));
    }
    if (contains(map, DrawVector)) {
        map.removeLayer(DrawVector);
    }
    if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
        measureTooltipElement = null;
    }
    // console.log('reset');
};
queryVectorLayerCircle = function () {
    // if (flag!==0){
    //     map.removeLayer(resultVector);
    // }
    clearQuery();
    flag = 1;
    let source = new ol.source.Vector({
        wrapX: false
    });
    DrawVector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
            //形状
            image: new ol.style.Circle({
                radius: 0
            })
        })
    });
    //将绘制层添加到地图容器中
    map.addLayer(DrawVector);
    //实例化交互绘制类对象并添加到地图容器中
    draw = new ol.interaction.Draw({
        type: 'Circle', //'Polygon' 'Circle' 'LineString' 'Point'
        //绘制层数据源
        source: source,
    });
    map.addInteraction(draw);
    //点击查询的回调函数
    draw.on('drawend', DrawControlback);
};
queryVectorLayerPolygon = function () {
    clearQuery();
    flag = 2;
    let source = new ol.source.Vector({
        wrapX: false
    });
    DrawVector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        })
    });
    //将绘制层添加到地图容器中
    map.addLayer(DrawVector);
    //实例化交互绘制类对象并添加到地图容器中
    draw = new ol.interaction.Draw({
        type: 'Polygon', //'Polygon' 'Circle' 'LineString' 'Point'
        //绘制层数据源
        source: source
    });
    map.addInteraction(draw);
    createMeasureTooltip(); //创建测量工具提示框
    createHelpTooltip(); //创建帮助提示框
    let listener;
    //绑定交互绘制工具开始绘制的事件
    draw.on('drawstart',
        function (evt) {
            // set sketch
            sketch = evt.feature; //绘制的要素

            /** @type {ol.Coordinate|undefined} */
            let tooltipCoord = evt.coordinate; // 绘制的坐标
            //绑定change事件，根据绘制几何类型得到测量长度值或面积值，并将其设置到测量工具提示框中显示
            listener = sketch.getGeometry().on('change', function (evt) {
                geom = evt.target; //绘制几何要素
                if (geom instanceof ol.geom.Polygon) {
                    output = formatArea( /** @type {ol.geom.Polygon} */ (geom)); //面积值
                    tooltipCoord = geom.getInteriorPoint().getCoordinates(); //坐标
                } else if (geom instanceof ol.geom.LineString) {
                    output = formatLength( /** @type {ol.geom.LineString} */ (geom)); //长度值
                    tooltipCoord = geom.getLastCoordinate(); //坐标
                }
                measureTooltipElement.innerHTML = output; //将测量值设置到测量工具提示框中显示
                measureTooltip.setPosition(tooltipCoord); //设置测量工具提示框的显示位置
            });
        }, this);
    draw.on('drawend',
        function (evt) {
            measureTooltipElement.className = 'tooltip tooltip-static'; //设置测量提示框的样式
            measureTooltip.setOffset([0, -7]);
            // unset sketch
            sketch = null; //置空当前绘制的要素对象
            // unset tooltip so that a new one can be created
            // measureTooltipElement = null; //置空测量工具提示框对象
            // createMeasureTooltip();//重新创建一个测试工具提示框显示结果
            ol.Observable.unByKey(listener);
            if (helpTooltipElement) {
                helpTooltipElement.parentNode.removeChild(helpTooltipElement);
                helpTooltipElement = null;
            }
        }, this);
    //点击查询的回调函数
    draw.on('drawend', DrawControlback);
};
queryVectorLayerRectangle = function () {
    // if (flag!==0){
    //     map.removeLayer(resultVector);
    // }
    clearQuery();
    flag = 3;
    let source = new ol.source.Vector({
        wrapX: false
    });
    DrawVector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
            //形状
            image: new ol.style.Circle({
                radius: 0
            })
        })
    });
    //将绘制层添加到地图容器中
    map.addLayer(DrawVector);
    //实例化交互绘制类对象并添加到地图容器中
    draw = new ol.interaction.Draw({
        type: 'Circle', //'Polygon' 'Circle' 'LineString' 'Point'
        //绘制层数据源
        source: source,
        geometryFunction: ol.interaction.Draw.createRegularPolygon(4)
    });
    map.addInteraction(draw);
    //点击查询的回调函数
    draw.on('drawend', DrawControlback);
};
queryVectorLayerPoint = function () {
    clearQuery();
    flag = 4;
    let source = new ol.source.Vector({
        wrapX: false
    });
    DrawVector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
            //形状
            image: new ol.style.Circle({
                radius: 0
            })
        })
    });
    //将绘制层添加到地图容器中
    map.addLayer(DrawVector);
    //实例化交互绘制类对象并添加到地图容器中
    draw = new ol.interaction.Draw({
        type: 'Point', //'Polygon' 'Circle' 'LineString' 'Point'
        //绘制层数据源
        source: source
    });
    map.addInteraction(draw);
    //点击查询的回调函数
    draw.on('drawend', DrawControlback);
};
queryVectorLayerLine = function () {
    clearQuery();
    flag = 5;
    let source = new ol.source.Vector({
        wrapX: false
    });
    DrawVector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        })
    });
    //将绘制层添加到地图容器中
    map.addLayer(DrawVector);
    //实例化交互绘制类对象并添加到地图容器中
    draw = new ol.interaction.Draw({
        type: 'LineString', //'Polygon' 'Circle' 'LineString' 'Point'
        //绘制层数据源
        source: source
    });
    map.addInteraction(draw);
    createMeasureTooltip(); //创建测量工具提示框
    createHelpTooltip(); //创建帮助提示框
    let listener;
    //绑定交互绘制工具开始绘制的事件
    draw.on('drawstart',
        function (evt) {
            // set sketch
            sketch = evt.feature; //绘制的要素

            /** @type {ol.Coordinate|undefined} */
            let tooltipCoord = evt.coordinate; // 绘制的坐标
            //绑定change事件，根据绘制几何类型得到测量长度值或面积值，并将其设置到测量工具提示框中显示
            listener = sketch.getGeometry().on('change', function (evt) {
                geom = evt.target; //绘制几何要素
                if (geom instanceof ol.geom.Polygon) {
                    output = formatArea( /** @type {ol.geom.Polygon} */ (geom)); //面积值
                    tooltipCoord = geom.getInteriorPoint().getCoordinates(); //坐标
                } else if (geom instanceof ol.geom.LineString) {
                    output = formatLength( /** @type {ol.geom.LineString} */ (geom)); //长度值
                    tooltipCoord = geom.getLastCoordinate(); //坐标
                }
                measureTooltipElement.innerHTML = output; //将测量值设置到测量工具提示框中显示
                measureTooltip.setPosition(tooltipCoord); //设置测量工具提示框的显示位置
            });
        }, this);
    draw.on('drawend',
        function (evt) {
            measureTooltipElement.className = 'tooltip tooltip-static'; //设置测量提示框的样式
            measureTooltip.setOffset([0, -7]);
            // unset sketch
            sketch = null; //置空当前绘制的要素对象
            // unset tooltip so that a new one can be created
            // measureTooltipElement = null; //置空测量工具提示框对象
            // createMeasureTooltip();//重新创建一个测试工具提示框显示结果
            ol.Observable.unByKey(listener);
            if (helpTooltipElement) {
                helpTooltipElement.parentNode.removeChild(helpTooltipElement);
                helpTooltipElement = null;
            }
        }, this);
    //点击查询的回调函数
    draw.on('drawend', DrawControlback);
};
//----------------------------------------------------
let queryResult = [];
let resultVector;
DrawControlback = function (features) {
    queryResult.length = 0;
    if (draw != null) {
        map.removeInteraction(draw);
    }
    if (flag === 4) {
        let bufferedExtent = new ol.extent.buffer(features.feature.getGeometry().getExtent(), nearDis * 950);
        // console.log('Point');
        let result = caseSource.forEachFeatureIntersectingExtent(bufferedExtent, success);
    } else if (flag === 5) {
        let bufferedExtent = new ol.extent.buffer(features.feature.getGeometry().getExtent(), nearDis * 60);
        // console.log('Point');
        let result = caseSource.forEachFeatureIntersectingExtent(bufferedExtent, success);
    } else {
        let result = caseSource.forEachFeatureIntersectingExtent(features.feature.getGeometry().getExtent(), success);
    }

    if (flag === 2 || flag === 5) {
        let coefficient = parseFloat(queryResult.length / parseFloat(output)).toFixed(4);
        level = function (c) {
            if (c <= 3) {
                return '可能有危险';
            } else if (c <= 5) {
                return '危险性较小';
            } else if (c <= 9) {
                return '危险性较大';
            } else if (c <= 18) {
                return '非常危险';
            } else {
                return '及其危险';
            }
        };
        console.log(output);
        //清空popup的内容容器
        content.innerHTML = '';
        //在popup中加载当前要素的具体信息
        let geo;
        let typeText;
        if (flag === 2) {
            geo = geom.getInteriorPoint().getCoordinates();
            typeText = '面积:';
        } else {
            geo = geom.getLastCoordinate();
            typeText = '长度:'
        }
        let table = '<table class="table table-hover table-striped"><tbody>' +
            '<tr><td><b>案件数量:</b></td><td>' + queryResult.length + '</td></tr>' +
            '<tr><td><b>' + typeText + '</b></td><td>' + output + '</td></tr>' +
            '<tr><td><b>危险系数:</b></td><td>' + coefficient + '</td></tr>' +
            '<tr><td><b>危险级别:</b></td><td>' + level(coefficient) + '</td></tr>' +
            '</tbody></table>';
        let info = {
            geo: geo,
            att: {
                title: '危险分析',
                text: table,
            }
        };
        addFeatrueInfo(info);
        if (popup.getPosition() === undefined) {
            //设置popup的位置
            console.log(info);
            popup.setPosition(info.geo);
        }
    }
    flag = 0;
};

success = function (data) {
    queryResult.push(data);
    data.setStyle(createCaseStyle());
};

//------------------------路径规划
let isPath = false;
let bicycling = false;
let walking = false;
let driving = false;
let origin = '';
let destination = '';
let drivingVectorLayer;
let drivingVectorSource;
let startMarker;
let endMarker;

$(function () {
    $('#undo').bind('click', function () {
        draw.removeLastPoint();
    });
    $('#driving').bind('click', function () {
        clearPath();
        isPath = true;
        driving = true;
    });
    $('#bicycling').click(function () {
        clearPath();
        isPath = true;
        bicycling = true;
    });
    $('#walking').click(function () {
        clearPath();
        isPath = true;
        walking = true;
    });
    $('#reset').click(function () {
        clearQuery();
        clearPath();
    });

    // $('#resultTbody').on( 'click', 'tr', function (e) {
    //     let index = $(this).parent().context._DT_RowIndex; //行号
    //     let rows = table.rows( index ).data();//获取行数据
    //     console.log(index);
    // });
    //-----------------------------------------------------------------移动
    let animating = false;
    let speed, now;
    let speedInput = document.getElementById('speed');
    let startButton = document.getElementById('start-animation');
    let vectorLayer;
    let geoMarker;
    $('#start-animation').bind('click', function () {
        // for (route of geomPolylines)
        let route = geomPolylines[0]; {
            let routeCoords = route.getCoordinates();
            let routeLength = routeCoords.length;
            let styles = {
                'route': new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        width: 6,
                        color: [237, 212, 0, 0.8]
                    })
                }),
                'icon': new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 1],
                        scale: 0.1,
                        src: "./image/red.png"
                    })
                }),
                'geoMarker': new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 7,
                        snapToPixel: false,
                        fill: new ol.style.Fill({
                            color: 'black'
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'white',
                            width: 2
                        })
                    })
                })
            };

            let moveFeature = function (event) {
                let vectorContext = event.vectorContext;
                let frameState = event.frameState;

                if (animating) {
                    let elapsedTime = frameState.time - now;
                    //通过增加速度，来获得lineString坐标
                    let index = Math.round(speed * elapsedTime / 1000);

                    if (index >= routeLength) {
                        stopAnimation(true);
                        return;
                    }

                    let currentPoint = new ol.geom.Point(routeCoords[index]);
                    let feature = new ol.Feature(currentPoint);
                    vectorContext.drawFeature(feature, styles.geoMarker);
                }
                //继续动画效果
                map.render();
            };
            startAnimation();

            function startAnimation() {
                if (animating) {
                    stopAnimation(false);
                } else {
                    {
                        // let routeCoords=route.getCoordinates();
                        // let routelength=routeCoords.length;
                        // let geoMarker = new ol.Feature({
                        //     type: 'geoMarker',
                        //     geometry: new ol.geom.Point(routeCoords[0])
                        // });
                        //将离散点构建成一条折线
                        // let route = new ol.geom.LineString(Coordinates);
                        //获取直线的坐标

                        let routeFeature = new ol.Feature({
                            type: 'route',
                            geometry: route
                        });
                        geoMarker = new ol.Feature({
                            type: 'geoMarker',
                            geometry: new ol.geom.Point(routeCoords[0])
                        });
                        // let startMarker = new ol.Feature({
                        //     type: 'icon',
                        //     geometry: new ol.geom.Point(routeCoords[0])
                        // });
                        // let endMarker = new ol.Feature({
                        //     type: 'icon',
                        //     geometry: new ol.geom.Point(routeCoords[routeLength - 1])
                        // });

                        // let animating = false;

                        vectorLayer = new ol.layer.Vector({
                            source: new ol.source.Vector({
                                features: [routeFeature, geoMarker, ] //startMarker, endMarker
                            }),
                            style: function (feature) {
                                //如果动画是激活的就隐藏geoMarker
                                if (animating && feature.get('type') === 'geoMarker') {
                                    return null;
                                }
                                return styles[feature.get('type')];
                            }
                        });
                    }
                    map.addLayer(vectorLayer);
                    animating = true;
                    now = new Date().getTime();
                    speed = speedInput.value;
                    startButton.textContent = '结束运动';
                    //隐藏geoMarker
                    geoMarker.setStyle(null);
                    //设置显示范围
                    map.on('postcompose', moveFeature);
                    map.render();
                }
            }


            /**
             * @param {boolean}结束动画
             */
            function stopAnimation(ended) {
                animating = false;
                startButton.textContent = '开始运动';
                map.removeLayer(vectorLayer);
                //如果动画取消就开始动画
                let coord = ended ? routeCoords[routeLength - 1] : routeCoords[0];
                /** @type {ol.geom.Point} */
                (geoMarker.getGeometry()).setCoordinates(coord);
                //移除监听
                map.un('postcompose', moveFeature);
            }

            // startButton.addEventListener('click', startAnimation, false);
        }
    });
    //-----------------------------------------------------------------/移动
});

addListener = function () {
    // map.on('singleclick',function (e) {
    //     console.log('on-click');
    // });

    container = document.getElementById('popup');
    content = document.getElementById('popup-content');
    closer = document.getElementById('popup-closer');

    /**
     * 添加关闭按钮的单击事件（隐藏popup）
     * @return {boolean} Don't follow the href.
     */
    closer.onclick = function () {
        //未定义popup位置
        popup.setPosition(undefined);
        //失去焦点
        closer.blur();
        return false;
    };

    /**
     * 在地图容器中创建一个Overlay
     */
    popup = new ol.Overlay(
        /** @type {olx.OverlayOptions} */
        ({
            //要转换成overlay的HTML元素
            element: container,
            //当前窗口可见
            autoPan: true,
            //Popup放置的位置
            positioning: 'bottom-center',
            //是否应该停止事件传播到地图窗口
            stopEvent: false,
            autoPanAnimation: {
                //当Popup超出地图边界时，为了Popup全部可见，地图移动的速度
                duration: 250
            }
        }));
    map.addOverlay(popup);

    /**
     * 为map添加点击事件监听，渲染弹出popup
     */
    map.on('click', function (evt) {
        //判断当前单击处是否有要素，捕获到要素时弹出popup
        let feature = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
            return feature;
        });
        if (feature) {
            // console.log(feature);
            // alert(feature.values_['x']+' '+feature.values_['y']);
            if (isPath) { //在路径规划
                if (origin.length === 0) {
                    origin += (feature.values_['lng'] + ',' + feature.values_['lat']);
                    startMarker = new ol.Feature({
                        geometry: new ol.geom.Point([feature.values_['X'], feature.values_['Y']])
                    });
                    startMarker.setStyle(new ol.style.Style({
                        image: new ol.style.Icon({
                            // anchor: [0.5, 60],
                            // anchorOrigin: 'top-right',
                            // anchorXUnits: 'fraction',
                            // anchorYUnits: 'pixels',
                            // offsetOrigin: 'top-right',
                            opacity: 0.75,
                            scale: 0.3,
                            src: "./image/origin2.png"
                        })
                    }));
                    // console.log(startMarker);
                    // drivingVectorSource.addFeatures([startMarker]);
                    drivingVectorSource = new ol.source.Vector({
                        features: [startMarker],
                    });
                    drivingVectorLayer = new ol.layer.Vector({
                        title: "线",
                        source: drivingVectorSource,
                        // renderMode:'image',
                        id: 'isPath'
                    });
                    map.addLayer(drivingVectorLayer);
                } else if (destination.length === 0) {
                    destination += (feature.values_['lng'] + ',' + feature.values_['lat']);
                    endMarker = new ol.Feature({
                        // style: new ol.style.Style({
                        //     image: new ol.style.Icon({
                        //         anchor: [0.5, 1],
                        //         scale:0.2,
                        //         src: "./image/red.png"
                        //     })
                        // }),
                        geometry: new ol.geom.Point([feature.values_['X'], feature.values_['Y']])
                    });
                    endMarker.setStyle(new ol.style.Style({
                        image: new ol.style.Icon({
                            // anchor: [0.5, 60],
                            // anchorOrigin: 'top-right',
                            // anchorXUnits: 'fraction',
                            // anchorYUnits: 'pixels',
                            // offsetOrigin: 'top-right',
                            opacity: 0.75,
                            scale: 0.3,
                            src: "./image/destination2.png"
                        })
                    }));
                    drivingVectorSource.addFeatures([endMarker]);
                    isPath = false;
                    getPath();
                }
            } else if (feature.values_.hasOwnProperty("police_station_id") || feature.values_.hasOwnProperty("case_id")) {
                createPopup(feature);
            }
        }
    });
    /**
     * 为map添加鼠标移动事件监听，当指向标注时改变鼠标光标状态
     */
    map.on('pointermove', function (e) {
        let pixel = map.getEventPixel(e.originalEvent);
        let hit = map.hasFeatureAtPixel(pixel);
        map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });
    map.on('pointermove', pointerMoveHandler); //地图容器绑定鼠标移动事件，动态显示帮助提示框内容
};
getPath = function () {
    let mode;
    if (driving) {
        mode = 'driving';
    } else if (walking) {
        mode = 'walking';
    } else {
        mode = 'bicycling';
    }
    data = {
        'origin': origin,
        'destination': destination, //"116.434446,39.90816"
        'mode': mode,
    };
    // console.log(data);
    $.ajax({
        url: "http://gis.ylsislove.com:4999/get_path",
        dataType: 'json',
        async: true,
        data: data,
        type: 'POST',
        success: function (data) {
            //请求成功时处理
            // console.log(data);
            if (data['status'] === 'N') {
                alert(data['message'])
            } else {
                drawPath(data);
            }
        },
        error: function () {
            //请求出错处理
            alert("Ajax Error")
        }
    });
};
let geomPolylines = []; //路径线集合
drawPath = function (data) {
    let featurePolylines = [];
    //---style
    let stroke = new ol.style.Stroke({
        color: '#8A02F9',
        width: 3
    });
    let stylePolyline = [
        new ol.style.Style({
            stroke: stroke
        })
    ];
    //--
    for (let i = 0; i < data.value.length; ++i) {
        let line_org = data.value[i]['roads'];
        // console.log(line_org);
        let geomPolyline = new ol.geom.LineString(line_org);
        let featurePolyline = new ol.Feature({
            geometry: geomPolyline,
            name: 'Polyline',
            // style:stylePolyline
        });
        featurePolyline.setStyle(stylePolyline);
        geomPolylines.push(geomPolyline);
        featurePolylines.push(featurePolyline);
        //-----添加文字标注
        let createLabelStyle = function (feature) {
            return new ol.style.Style({
                text: new ol.style.Text({
                    //位置
                    textAlign: 'center',
                    //基准线
                    textBaseline: 'middle',
                    //文字样式
                    font: 'normal 14px 微软雅黑',
                    //文本内容
                    text: feature.get('name'),
                    //文本填充样式（即文字颜色）
                    fill: new ol.style.Fill({
                        color: '#aa3300'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 2
                    })
                })
            });
        };
        let labelName;
        // if (driving){
        //     labelName=data.value[i]['strategy']
        // }else {
        labelName = parseFloat(data.value[i]['distance']) / 1000 + 'KM';
        // }
        let wordLabel = new ol.Feature({
            geometry: new ol.geom.Point(line_org[parseInt(line_org.length / 2)]),
            name: labelName,
        });
        wordLabel.setStyle(createLabelStyle(wordLabel));
        drivingVectorSource.addFeature(wordLabel);
    }
    drivingVectorSource.addFeatures(featurePolylines);
};
clearPath = function () {
    origin = '';
    destination = '';
    geomPolylines.length = 0;
    isPath = false;
    driving = false;
    walking = false;
    bicycling = false;
    if (contains(map, drivingVectorLayer)) {
        console.log(drivingVectorLayer);
        map.removeLayer(drivingVectorLayer);
    }
};

//-----------------------------------------------------------------Popup

/**
 * 获得feature的坐标
 * @param feature 聚合簇
 */
function getFeatureCoordinates(feature) {
    return feature.values_.geometry.flatCoordinates;
}

/**
 * 构造popLayer
 * @returns {ol.Overlay}
 */
function createPopupLayer() {
    return new ol.Overlay(
        /** @type {olx.OverlayOptions} */
        ({
            //要转换成overlay的HTML元素
            element: container,
            //当前窗口可见
            autoPan: true,
            //Popup放置的位置
            positioning: 'bottom-center',
            //是否应该停止事件传播到地图窗口
            stopEvent: false,
            autoPanAnimation: {
                //当Popup超出地图边界时，为了Popup全部可见，地图移动的速度
                duration: 250
            }
        }));
}

function createPopup(feature) {
    //初始化首页popup框中信息
    addFeatrueInfo_2(feature.values_);
    //刷新位置
    var position = getFeatureCoordinates(feature);
    //进行定位
    popup.setPosition(position);
}

/**
 * 为popUp动态添加内容
 * */
function addFeatrueInfo_2(info) {
    // console.log(info);
    if (info == undefined)
        return -1;
    content.innerHTML = "";

    if (info.hasOwnProperty("police_station_id")) {
        if (info.tel.toString() == "NULL") info.tel = "无";
        content.innerHTML =
            '<h4>公安机关</h4>' +
            '<div style="width: 500px; background-color: rgba(255,255,255,0.9)" class="table-responsive-md">\n' +
            '    <table class="table table-hover table-striped">\n' +
            '        <tr>\n' +
            '            <td>编号</td>\n' +
            '            <td>' + info.id + ' </td>\n' +
            '        </tr>\n' +
            '        <tr>\n' +
            '            <td>名称</td>\n' +
            '            <td>' + info.name + '</td>\n' +
            '        </tr>\n' +
            '        <tr>\n' +
            '            <td>地址</td>\n' +
            '            <td>' + info.address + '</td>\n' +
            '        </tr>\n' +
            '        <tr>\n' +
            '            <td>电话</td>\n' +
            '            <td>' + info.tel + '</td>\n' +
            '        </tr>\n' +
            '    </table>\n' +
            '</div>';
    } else if (info.hasOwnProperty("case_id")) {
        content.innerHTML =
            '<h4>案件</h4>' +
            '<div style="background-color: rgba(255,255,255,0.9)" class="table-responsive-md">\n' +
            '    <table class="table table-hover table-striped">\n' +
            '        <tr>\n' +
            '            <td>案件编号</td>\n' +
            '            <td>' + info.case_id + ' </td>\n' +
            '        </tr>\n' +
            '        <tr>\n' +
            '            <td>案件地址</td>\n' +
            '            <td>' + info.case_position + '</td>\n' +
            '        </tr>\n' +
            '        <tr>\n' +
            '            <td>案件时间</td>\n' +
            '            <td>' + info.time + '</td>\n' +
            '        </tr>\n' +
            '        <tr>\n' +
            '            <td>案件描述</td>\n' +
            '            <td>' + info.case_description + '</td>\n' +
            '        </tr>\n' +
            '        <tr>\n' +
            '            <td>照片</td>\n' +
            '            <td>' +
            '<div style="width: 200px;height: 200px;overflow: hidden;position: relative;">' +
            '<img src="../photo/' + parseInt(info.case_id) + '.png" style="max-width: 100%;margin: auto">' +
            '</div>' +
            '</td>\n' +
            '        </tr>\n' +
            '    </table>\n' +
            '</div>';
    }
}




//--------------------------------------------------------------------------------测量
/**
 * 当前绘制的要素（Currently drawn feature.）
 * @type {ol.Feature}
 */
let sketch;
/**
 * 帮助提示框对象（The help tooltip element.）
 * @type {Element}
 */
let helpTooltipElement;
/**
 *帮助提示框显示的信息（Overlay to show the help messages.）
 * @type {ol.Overlay}
 */
let helpTooltip;
/**
 * 测量工具提示框对象（The measure tooltip element. ）
 * @type {Element}
 */
let measureTooltipElement;
/**
 *测量工具中显示的测量值（Overlay to show the measurement.）
 * @type {ol.Overlay}
 */
let measureTooltip;

/**
 *  当用户正在绘制多边形时的提示信息文本
 * @type {string}
 */
let continuePolygonMsg = 'Click to continue drawing the polygon';

/**
 * 当用户正在绘制线时的提示信息文本
 * @type {string}
 */
let continueLineMsg = 'Click to continue drawing the line';

let pointerMoveHandler = function (evt) {
    if (flag === 2 || flag === 5) {
        if (evt.dragging) {
            return;
        }
        /** @type {string} */
        let helpMsg = 'Click to start drawing'; //当前默认提示信息
        //判断绘制几何类型设置相应的帮助提示信息
        if (sketch) {
            let geom = (sketch.getGeometry());
            if (geom instanceof ol.geom.Polygon) {
                helpMsg = continuePolygonMsg; //绘制多边形时提示相应内容
            } else if (geom instanceof ol.geom.LineString) {
                helpMsg = continueLineMsg; //绘制线时提示相应内容
            }
        }
        helpTooltipElement.innerHTML = helpMsg; //将提示信息设置到对话框中显示
        helpTooltip.setPosition(evt.coordinate); //设置帮助提示框的位置
        $(helpTooltipElement).removeClass('hidden'); //移除帮助提示框的隐藏样式进行显示
    }
};

/**
 *创建一个新的帮助提示框（tooltip）
 */
function createHelpTooltip() {
    if (helpTooltipElement) {
        console.log(helpTooltipElement);
        helpTooltipElement.parentNode.removeChild(helpTooltipElement);
    }
    helpTooltipElement = document.createElement('div');
    helpTooltipElement.className = 'tooltip hidden';
    helpTooltip = new ol.Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left'
    });
    map.addOverlay(helpTooltip);
}
/**
 *创建一个新的测量工具提示框（tooltip）
 */
function createMeasureTooltip() {
    if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'tooltip tooltip-measure';
    measureTooltip = new ol.Overlay({
        element: measureTooltipElement,
        offset: [0, -35],
        positioning: 'bottom-center'
    });
    map.addOverlay(measureTooltip);
}

/**
 * 测量长度输出
 * @param {ol.geom.LineString} line
 * @return {string}
 */
let formatLength = function (line) {
    let length;
    // if (geodesicCheckbox.checked) { //若使用测地学方法测量
    //     let sourceProj = map.getView().getProjection(); //地图数据源投影坐标系
    //     length = ol.sphere.getLength(line, { "projection": sourceProj, "radius": 6378137 });
    // } else {
    //     length = Math.round(line.getLength() * 100) / 100; //直接得到线的长度
    // }
    length = Math.round(line.getLength() * 100) / 100; //直接得到线的长度
    let output;
    if (length > 100) {
        output = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km'; //换算成KM单位
    } else {
        output = (Math.round(length * 100) / 100) + ' ' + 'm'; //m为单位
    }
    return output; //返回线的长度
};
/**
 * 测量面积输出
 * @param {ol.geom.Polygon} polygon
 * @return {string}
 */
let formatArea = function (polygon) {
    let area;
    // if (geodesicCheckbox.checked) {//若使用测地学方法测量
    //     let sourceProj = map.getView().getProjection();//地图数据源投影坐标系
    //     let geom = /** @type {ol.geom.Polygon} */(polygon.clone().transform(sourceProj, 'EPSG:4326')); //将多边形要素坐标系投影为EPSG:4326
    //     area = Math.abs(ol.sphere.getArea(geom, { "projection": sourceProj, "radius": 6378137 })); //获取面积
    // } else {
    //     area = polygon.getArea();//直接获取多边形的面积
    // }
    area = polygon.getArea(); //直接获取多边形的面积
    let output;
    if (area > 10000) {
        output = (Math.round(area / 1000000 * 100) / 100) + ' ' + 'km<sup>2</sup>'; //换算成KM单位
    } else {
        output = (Math.round(area * 100) / 100) + ' ' + 'm<sup>2</sup>'; //m为单位
    }
    return output; //返回多边形的面积
};

let container;
let content;
let closer;
let popup;
addPopup = function () {
    /**
     * 实现popup的html元素
     */
    container = document.getElementById('popup');
    content = document.getElementById('popup-content');
    content.setAttribute('style', 'width:300px !important');
    closer = document.getElementById('popup-closer');
    /**
     * 在地图容器中创建一个Overlay
     */
    popup = new ol.Overlay(
        /** @type {olx.OverlayOptions} */
        ({
            //要转换成overlay的HTML元素
            element: container,
            //当前窗口可见
            autoPan: true,
            //Popup放置的位置
            positioning: 'bottom-center',
            //是否应该停止事件传播到地图窗口
            stopEvent: false,
            autoPanAnimation: {
                //当Popup超出地图边界时，为了Popup全部可见，地图移动的速度
                duration: 250
            }
        }));
    map.addOverlay(popup);

    /**
     * 添加关闭按钮的单击事件（隐藏popup）
     * @return {boolean} Don't follow the href.
     */
    closer.onclick = function () {
        //未定义popup位置
        popup.setPosition(undefined);
        //失去焦点
        closer.blur();
        clearQuery();
        return false;
    };
};
/**
 * 动态创建popup的具体内容
 * @param {string} title
 */
function addFeatrueInfo(info) {
    //新增a元素
    let elementA = document.createElement('b');
    elementA.className = "markerInfo";
    // elementA.href = info.att.titleURL;
    //elementA.innerText = info.att.title;
    setInnerHtml(elementA, info.att.title);
    elementA.setAttribute('style', 'font-size:20px');
    // 新建的div元素添加a子节点
    content.appendChild(elementA);
    //新增div元素
    let elementDiv = document.createElement('div');
    elementDiv.className = "markerText";
    elementDiv.innerHTML = info.att.text;
    // setInnerHtml(elementDiv, info.att.text);
    // 为content添加div子节点
    content.appendChild(elementDiv);
    // //新增img元素
    // let elementImg = document.createElement('img');
    // elementImg.className = "markerImg";
    // elementImg.src = info.att.imgURL;
    // // 为content添加img子节点
    // content.appendChild(elementImg);
}
/**
 * 动态设置元素文本内容（兼容）
 */
function setInnerHtml(element, text) {
    element.innerHTML = text;
}
conditionStyle = function () {
    return new ol.style.Style({
        image: new ol.style.Icon(
            ({
                anchor: [0.5, 60],
                anchorOrigin: 'top-right',
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                offsetOrigin: 'top-right',
                // offset:[0,10],
                //图标缩放比例
                scale: 0.5,
                //透明度
                opacity: 0.75,
                //图标的url
                src: './image/icon.png'
            })
        )
    })
};
let conditionResult;
timeOk = function () {
    let startTime = $('#startTime').val();
    let endTime = $('#endTime').val();
    let startDate = new Date(startTime);
    let endDate = new Date(endTime);
    console.log(startDate, endDate);
    if (conditionResult && conditionResult.length !== 0) {
        for (let item of caseArray) {
            item.setStyle(createCaseStyle(0));
        }
    }
    conditionResult = [];
    for (let item of caseArray) {
        let itemDate = new Date(item.values_['time']);
        console.log(itemDate);
        if (itemDate > startDate && itemDate < endDate) {
            item.setStyle(createCaseStyle());
            conditionResult.push(item);
        }
    }
    updateConditionResult(conditionResult);
};
roadOk = function () {
    let roadNme = $('#roadCondition').val();
    if (conditionResult && conditionResult.length !== 0) {
        for (let item of caseArray) {
            item.setStyle(createCaseStyle(0));
        }
    }
    conditionResult = [];
    for (let item of caseArray) {
        if (item.values_['case_position'].search(roadNme) !== -1) {
            item.setStyle(createCaseStyle());
            conditionResult.push(item);
        }
    }
    updateConditionResult(conditionResult);
};
areaOk = function () {
    let areaName = $('#areaCondition').val();
    if (conditionResult && conditionResult.length !== 0) {
        for (let item of caseArray) {
            item.setStyle(createCaseStyle(0));
        }
    }
    conditionResult = [];
    for (let item of caseArray) {
        if (item.values_['area'] === areaName) {
            // item.setStyle(conditionStyle());
            item.setStyle(createCaseStyle());
            conditionResult.push(item);
        }
    }
    updateConditionResult(conditionResult);
};
updateConditionResult = function (result) {
    let resultTbody = $('#resultTbody');
    resultTbody.empty();
    let index = 0;
    for (let item of result) {
        resultTbody.append('<tr class="trItem" index=' + index + '><td style="width: 40%">' + item.values_['case_position'] + '</td><td>' + item.values_['case_description'] + '</td></tr>');
        index += 1;
    }
    $(".trItem").click(function () {
        let index = $(this).attr('index');
        let view = map.getView();
        var duration = 2000; //动画的持续时间（以毫秒为单位）
        var zoom = view.getZoom();
        var parts = 2;
        var called = false;
        //动画完成的回调函数
        function callback(complete) {
            --parts;
            if (called) {
                return;
            }
            if (parts === 0 || !complete) {
                called = true;
                done(complete);
            }
        }
        //第一个动画
        view.animate({
            center: [conditionResult[index].values_['X'], conditionResult[index].values_['Y']],
            duration: duration
        }, callback);
        //第二个动画
        view.animate({
            zoom: zoom - 0.5,
            duration: duration / 2
        }, {
            zoom: 20,
            duration: duration / 2
        }, callback);
        // view.setCenter([conditionResult[index].values_['X'],conditionResult[index].values_['Y']]);
        // view.setZoom(20);
        console.log(index);
    });
};

//-----------------------------------------------------------------辅助函数
/**
 * 经纬度转墨卡托
 * @param poi 经纬度
 * @returns {{}}
 * @private
 */
function _getMercator(poi) { //[114.32894, 30.585748]
    let mercator = {};
    let earthRad = 6378137.0;
    // console.log("mercator-poi",poi);
    mercator.x = poi.lng * Math.PI / 180 * earthRad;
    let a = poi.lat * Math.PI / 180;
    mercator.y = earthRad / 2 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
    // console.log("mercator",mercator);
    return mercator; //[12727039.383734727, 3579066.6894065146]
}
/**
 * 墨卡托转经纬度
 * @param poi 墨卡托
 * @returns {{}}
 * @private
 */
function _getLngLat(poi) {
    let lnglat = {};
    lnglat.lng = poi.x / 20037508.34 * 180;
    let mmy = poi.y / 20037508.34 * 180;
    lnglat.lat = 180 / Math.PI * (2 * Math.atan(Math.exp(mmy * Math.PI / 180)) - Math.PI / 2);
    return lnglat;
}

contains = function (map, layer) {
    for (item of map.getLayers().getArray()) {
        if (item === layer) {
            return true;
        }
        // if (item.values_['id']===layer.values_['id']){
        //     return true;
        // }
    }
    return false;
};
//-------------
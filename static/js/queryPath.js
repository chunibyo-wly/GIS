let map;//地图容器
let layerArray;//

window.onload=function () {
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
//         projection: 'EPSG:3857',
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
    init_police();
};
addLayer=function () {
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
    $.fn.RangeSlider = function(cfg){
        this.sliderCfg = {
            min: cfg && !isNaN(parseFloat(cfg.min)) ? Number(cfg.min) : null,
            max: cfg && !isNaN(parseFloat(cfg.max)) ? Number(cfg.max) : null,
            step: cfg && Number(cfg.step) ? cfg.step : 1,
            callback: cfg && cfg.callback ? cfg.callback : null
        };

        var $input = $(this);
        var min = this.sliderCfg.min;
        var max = this.sliderCfg.max;
        var step = this.sliderCfg.step;
        var callback = this.sliderCfg.callback;

        $input.attr('min', min)
            .attr('max', max)
            .attr('step', step);

        $input.bind("input", function(e){
            $input.attr('value', this.value);
            $input.css( 'background', 'linear-gradient(to right, #059CFA, white ' + this.value + '%, white)' );

            if ($.isFunction(callback)) {
                callback(this);
            }
        });
    };
};

let nearDis;//r
let query;
showPointSeachRadius=function (query_) {
    query=query_;
    // document.getElementById("point-radius-box").style.display="block";
};
surePointRadius=function () {
    nearDis = document.getElementById("point-radius-input").value;
    if (query==='point'){
        queryVectorLayerPoint();
    }else {
        queryVectorLayerLine();
    }
};

let createLabelStyle = function (feature) {
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
                scale:0.15,
                //透明度
                opacity: 0.75,
                //图标的url
                src: './image/case2.png'
            })
        )
    });
};

let caseSource;
let caseVector;
let caseArray;
let policeArray;
let policeSource;
let policeVector;
init_case=function(){
    // data=[
    //     [12730908.29,3568833.73],
    //     [12721783.55,3566432.55],
    //     [12734512.48,3565666.01]
    // ];
    // caseArray=[];
    // for (let i=0;i<data.length;++i){
    //     let point=new ol.Feature({
    //         geometry:new ol.geom.Point([data[i][0],data[i][1]]),
    //         id:i,
    //         X:data[i][0],
    //         Y:data[i][1],
    //     });
    //     point.setStyle(createLabelStyle());
    //     //     new ol.style.Style({
    //     //     //填充色
    //     //     fill: new ol.style.Fill({
    //     //         color: 'rgba(255, 255, 255, 0.2)'
    //     //     }),
    //     //     //边线颜色
    //     //     stroke: new ol.style.Stroke({
    //     //         color: '#ffcc33',
    //     //         width: 2
    //     //     }),
    //     //     //形状
    //     //     image: new ol.style.Circle({
    //     //         radius: 5,
    //     //         fill: new ol.style.Fill({
    //     //             color: '#1e1aff'
    //     //         })
    //     //     })
    //     // }));
    //     caseArray.push(point);
    // }
    // caseSource = new ol.source.Vector({
    //     features: caseArray
    // });
    // //创建一个图层
    // caseVector = new ol.layer.Vector({
    //     source: caseSource
    // });
    // map.addLayer(caseVector);

    $.ajax({
        url:'http://127.0.0.1:5000/get_wuhan',
        type:"GET",
        dataType: "json",
        async: false,
        success:function (data) {
            caseArray=[];
            let len=data.length;
            for (let i=0;i<len;++i){
                let point=new ol.Feature({
                    geometry:new ol.geom.Point([data[i].X,data[i].Y]),
                    case_id:data[i].case_id,
                    case_data:data[i].case_name,
                    case_type:data[i].case_type,
                    // informant_id:data.data[i].informant_id,
                    // suspects_id:data.data[i].suspects_id,
                    time:data[i].time,
                    case_position:data[i].case_position,
                    lng:data[i].lng,
                    lat:data[i].lat,
                    case_description:data[i].case_description,
                    case_status:data[i].case_status,
                    X:data[i].X,
                    Y:data[i].Y
                });
                point.setStyle(createLabelStyle());
                // point.setStyle(new ol.style.Style({
                //     //填充色
                //     fill: new ol.style.Fill({
                //         color: 'rgba(255, 255, 255, 0.2)'
                //     }),
                //     //边线颜色
                //     stroke: new ol.style.Stroke({
                //         color: '#ffcc33',
                //         width: 2
                //     }),
                //     //形状
                //     image: new ol.style.Circle({
                //         radius: 5,
                //         fill: new ol.style.Fill({
                //             color: '#ffcc33'
                //         })
                //     })
                // }));
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
init_police=function(){
    $.ajax({
        url:'http://127.0.0.1:5000/get_police',
        type:"GET",
        dataType: "json",
        async: false,
        success:function (data) {
            policeArray=[];
            let len=data.length;
            for (let i=0;i<len;++i){
                let point=new ol.Feature({
                    geometry:new ol.geom.Point([data[i].X,data[i].Y]),
                    police_station_id:data[i].police_station_id,
                    id:data[i].id,
                    lng:data[i].lng,
                    lat:data[i].lat,
                    X:data[i].X,
                    Y:data[i].Y,
                    address:data[i].address,
                    name:data[i].name,
                    photos:data[i].photos,
                    tel:data[i].tel,
                });
                point.setStyle(new ol.style.Style({
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
                            scale:0.15,
                            //透明度
                            opacity: 0.75,
                            //图标的url
                            src: './image/police3.png'
                        })
                    )
                }));
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
let flag=0;
let DrawVector;
let Draw;
clearQuery=function(){
    // if (flag!==0){
    //     map.removeLayer(resultVector);
    // }
    // map.addLayer(caseVector);
    caseSource.clear();
    caseSource.addFeatures(caseArray);
    // console.log('reset');
};
queryVectorLayerCircle=function () {
    // if (flag!==0){
    //     map.removeLayer(resultVector);
    // }
    clearQuery();
    flag=1;
    let source = new ol.source.Vector({ wrapX: false });
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
    Draw = new ol.interaction.Draw({
        type: 'Circle',//'Polygon' 'Circle' 'LineString' 'Point'
        //绘制层数据源
        source: source,
    });
    map.addInteraction(Draw);
    //点击查询的回调函数
    Draw.on('drawend', DrawControlback);
};
queryVectorLayerPolygon=function () {
    // if (flag!==0){
    //     map.removeLayer(resultVector);
    // }
    clearQuery();
    flag=2;
    let source = new ol.source.Vector({ wrapX: false });
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
    Draw = new ol.interaction.Draw({
        type: 'Polygon',//'Polygon' 'Circle' 'LineString' 'Point'
        //绘制层数据源
        source: source
    });
    map.addInteraction(Draw);
    //点击查询的回调函数
    Draw.on('drawend', DrawControlback);
};
queryVectorLayerRectangle=function () {
    // if (flag!==0){
    //     map.removeLayer(resultVector);
    // }
    clearQuery();
    flag=3;
    let source = new ol.source.Vector({ wrapX: false });
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
    Draw = new ol.interaction.Draw({
        type: 'Circle',//'Polygon' 'Circle' 'LineString' 'Point'
        //绘制层数据源
        source: source,
        geometryFunction: ol.interaction.Draw.createRegularPolygon(4)
    });
    map.addInteraction(Draw);
    //点击查询的回调函数
    Draw.on('drawend', DrawControlback);
};
queryVectorLayerPoint=function () {
    clearQuery();
    flag=4;
    let source = new ol.source.Vector({ wrapX: false });
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
    Draw = new ol.interaction.Draw({
        type: 'Point',//'Polygon' 'Circle' 'LineString' 'Point'
        //绘制层数据源
        source: source
    });
    map.addInteraction(Draw);
    //点击查询的回调函数
    Draw.on('drawend', DrawControlback);
};
queryVectorLayerLine=function () {
    clearQuery();
    flag=5;
    let source = new ol.source.Vector({ wrapX: false });
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
    Draw = new ol.interaction.Draw({
        type: 'LineString',//'Polygon' 'Circle' 'LineString' 'Point'
        //绘制层数据源
        source: source
    });
    map.addInteraction(Draw);
    //点击查询的回调函数
    Draw.on('drawend', DrawControlback);
};
//----------------------------------------------------
let queryResult=[];
let resultVector;
DrawControlback=function (features) {
    // console.log("drawend");
    queryResult.length=0;
    // map.removeLayer(caseVector);
    if (Draw!=null){
        map.removeInteraction(Draw);
    }
    map.removeLayer(DrawVector);
    if (flag===4||flag===5){
        let bufferedExtent=new ol.extent.buffer(features.feature.getGeometry().getExtent(),nearDis*800);
        // console.log('Point');
        let result=caseSource.forEachFeatureIntersectingExtent(bufferedExtent,success);
    }else {
        let result=caseSource.forEachFeatureIntersectingExtent(features.feature.getGeometry().getExtent(),success);
    }

    caseSource.clear();
    caseSource.addFeatures(queryResult);
    // map.addLayer(resultVector);
};

success=function (data) {
    queryResult.push(data);
};

//------------------------路径规划
let isPath=false;
let bicycling=false;
let walking=false;
let driving=false;
let origin='';
let destination='';
let drivingVectorLayer;
let drivingVectorSource;
let startMarker;
let endMarker;

$(function () {
    $('#undo').bind('click',function () {
        Draw.removeLastPoint();
    });
    $('#driving').bind('click',function(){
        clearPath();
        isPath=true;
        driving=true;
    });
    $('#bicycling').click(function () {
        clearPath();
        isPath=true;
        bicycling=true;
    });
    $('#walking').click(function () {
        clearPath();
        isPath=true;
        walking=true;
    });
    $('#reset').click(function () {
        clearQuery();
        clearPath();
    });
    //-----------------------------------------------------------------移动
    let animating = false;
    let speed, now;
    let speedInput = document.getElementById('speed');
    let startButton = document.getElementById('start-animation');
    let vectorLayer;
    let geoMarker;
    $('#start-animation').bind('click',function () {
        // for (route of geomPolylines)
        let route=geomPolylines[0];
        {
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
                        scale:0.1,
                        src: "./image/red.png"
                    })
                }),
                'geoMarker': new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 7,
                        snapToPixel: false,
                        fill: new ol.style.Fill({ color: 'black' }),
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
                                features: [routeFeature, geoMarker, ]//startMarker, endMarker
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

addListener=function () {
    // map.on('singleclick',function (e) {
    //     console.log('on-click');
    // });
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
            if (isPath){
                if (origin.length===0){
                    origin+=(feature.values_['lng']+','+feature.values_['lat']);
                    startMarker = new ol.Feature({
                        geometry: new ol.geom.Point([feature.values_['X'],feature.values_['Y']])
                    });
                    startMarker.setStyle(new ol.style.Style({
                        image: new ol.style.Icon({
                            // anchor: [0.5, 60],
                            // anchorOrigin: 'top-right',
                            // anchorXUnits: 'fraction',
                            // anchorYUnits: 'pixels',
                            // offsetOrigin: 'top-right',
                            opacity: 0.75,
                            scale:0.3,
                            src: "./image/origin2.png"
                        })
                    }));
                    // console.log(startMarker);
                    // drivingVectorSource.addFeatures([startMarker]);
                    drivingVectorSource = new ol.source.Vector({
                        features:[startMarker],
                    });
                    drivingVectorLayer = new ol.layer.Vector({
                        title:"线",
                        source: drivingVectorSource,
                        // renderMode:'image',
                        id:'isPath'
                    });
                    map.addLayer(drivingVectorLayer);
                }else if (destination.length===0){
                    destination+=(feature.values_['lng']+','+feature.values_['lat']);
                    endMarker = new ol.Feature({
                        // style: new ol.style.Style({
                        //     image: new ol.style.Icon({
                        //         anchor: [0.5, 1],
                        //         scale:0.2,
                        //         src: "./image/red.png"
                        //     })
                        // }),
                        geometry: new ol.geom.Point([feature.values_['X'],feature.values_['Y']])
                    });
                    endMarker.setStyle(new ol.style.Style({
                        image: new ol.style.Icon({
                            // anchor: [0.5, 60],
                            // anchorOrigin: 'top-right',
                            // anchorXUnits: 'fraction',
                            // anchorYUnits: 'pixels',
                            // offsetOrigin: 'top-right',
                            opacity: 0.75,
                            scale:0.3,
                            src: "./image/destination2.png"
                        })
                    }));
                    drivingVectorSource.addFeatures([endMarker]);
                    isPath=false;
                    getPath();
                }
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
};
getPath=function () {
    let mode;
    if (driving){
        mode='driving';
    }else if (walking){
        mode='walking';
    }else {
        mode='bicycling';
    }
    data={
        'origin':origin,
        'destination':destination,//"116.434446,39.90816"
        'mode':mode,
    };
    // console.log(data);
    $.ajax({
        url:"http://127.0.0.1:5000/get_path",
        dataType:'json',
        async:true,
        data:data,
        type:'POST',
        success: function (data) {
            //请求成功时处理
            // console.log(data);
            if (data['status']==='N'){
                alert(data['message'])
            }else {
                drawPath(data);
            }
        },
        error: function () {
            //请求出错处理
            alert("Ajax Error")
        }
    });
};
let geomPolylines=[];//路径线集合
drawPath=function (data) {
    let featurePolylines=[];
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
    for (let i=0;i<data.value.length;++i){
        let line_org=data.value[i]['roads'];
        // console.log(line_org);
        let geomPolyline= new ol.geom.LineString(line_org);
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
                    fill: new ol.style.Fill({ color: '#aa3300' }),
                    stroke: new ol.style.Stroke({ color: '#ffcc33', width: 2 })
                })
            });
        };
        let labelName;
        // if (driving){
        //     labelName=data.value[i]['strategy']
        // }else {
            labelName=parseFloat(data.value[i]['distance'])/1000+'KM';
        // }
        let wordLabel=new ol.Feature({
            geometry:new ol.geom.Point(line_org[parseInt(line_org.length/2)]),
            name:labelName,
        });
        wordLabel.setStyle(createLabelStyle(wordLabel));
        drivingVectorSource.addFeature(wordLabel);
    }
    drivingVectorSource.addFeatures(featurePolylines);
};
clearPath=function () {
    origin='';
    destination='';
    geomPolylines.length=0;
    isPath=false;
    driving=false;
    walking=false;
    bicycling=false;
    if (contains(map,drivingVectorLayer)){
        map.removeLayer(drivingVectorLayer);
    }
};


//-----------------------------------------------------------------辅助函数
/**
 * 经纬度转墨卡托
 * @param poi 经纬度
 * @returns {{}}
 * @private
 */
function _getMercator(poi) {//[114.32894, 30.585748]
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
function _getLngLat(poi){
    let lnglat = {};
    lnglat.lng = poi.x/20037508.34*180;
    let mmy = poi.y/20037508.34*180;
    lnglat.lat = 180/Math.PI*(2*Math.atan(Math.exp(mmy*Math.PI/180))-Math.PI/2);
    return lnglat;
}

contains=function (map,layer) {
    for (item of map.getLayers().getArray()){
        if (item.values_['id']==='isPath'){
            return true;
        }
    }
    return false;
};
//-------------
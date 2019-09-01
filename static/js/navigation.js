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
    // let layer2 = new Zondy.Map.GoogleLayer({
    //     layerType: Zondy.Enum.Map.GoogleLayerType.RASTER_IGS,
    //     ip: "develop.smaryun.com",
    //     port: "6163"
    // });
    // let layer3 = new Zondy.Map.GoogleLayer({
    //     layerType: Zondy.Enum.Map.GoogleLayerType.TERRAIN_IGS,
    //     ip: "develop.smaryun.com",
    //     port: "6163"
    // });
    // let layer4 = new Zondy.Map.GoogleLayer({
    //     layerType: Zondy.Enum.Map.GoogleLayerType.ROAD_IGS,
    //     ip: "develop.smaryun.com",
    //     port: "6163"
    // });
    // let gaodeMapLayer = new ol.layer.Tile({
    //     title: "高德地图",
    //     source: new ol.source.XYZ({
    //         url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
    //         wrapX: false
    //     })
    // });
    // layerArray = [layer1, layer2, layer3, layer4];

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
    init_medical();
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
showPointSeachRadius=function (query_,queryContent_) {
    query=query_;
    queryContent=queryContent_;
};
surePointRadius=function () {
    nearDis = document.getElementById("point-radius-input").value;
    if (query==='point'){
        queryVectorLayerPoint(queryContent);
    }else {
        queryVectorLayerLine(queryContent);
    }
};

let createCaseStyle = function (opacity=0.75) {
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
                opacity: opacity,
                //图标的url
                src: './image/case2.png'
            })
        )
    });
};
let createPoliceStyle=function(opacity=0.75){
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
                opacity: opacity,
                //图标的url
                src: './image/police3.png'
            })
        )
    })
};
let createMedicalStyle=function(opacity=0.75){
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
                scale:0.7,
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
let medicalArray;
let medicalSource;
let medicalVector;
init_case=function(){
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
init_medical=function(){
    $.ajax({
        url:'http://127.0.0.1:5000/get_medical',
        type:"GET",
        dataType: "json",
        async: false,
        success:function (data) {
            medicalArray=[];
            let len=data.length;
            for (let i=0;i<len;++i){
                let point=new ol.Feature({
                    geometry:new ol.geom.Point([data[i].X,data[i].Y]),
                    index:data[i].index,
                    id:data[i].ID,
                    name:data[i].name,
                    type:data[i].type,
                    address:data[i].address,
                    lng:data[i].lng,
                    lat:data[i].lat,
                    X:data[i].X,
                    Y:data[i].Y,
                    tel:data[i].tel,
                    area:data[i].area,
                });
                point.setStyle(createMedicalStyle(0));
                medicalArray.push(point);
            }
            medicalSource = new ol.source.Vector({
                features: medicalArray
            });
            //创建一个图层
            medicalVector = new ol.layer.Vector({
                source: medicalSource
            });
            map.addLayer(medicalVector);
        }
    })
};
//--------------------------------------------------------------------
let flag=0;
let queryContent=0;//1->case,2->police,3->medical
let DrawVector;
let Draw;
clearQuery=function(){
    flag=0;
    // queryContent=0;
    for (let item of queryResult){
        if (queryContent===1){
            item.setStyle(createCaseStyle(0));
        }else if (queryContent===2){
            item.setStyle(createPoliceStyle(0));
        }else {
            item.setStyle(createMedicalStyle(0));
        }
    }
};
queryVectorLayerCircle=function (queryContent_) {
    clearQuery();
    queryContent=queryContent_;
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
queryVectorLayerPolygon=function (queryContent_) {
    clearQuery();
    queryContent=queryContent_;
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
queryVectorLayerRectangle=function (queryContent_) {
    queryContent=queryContent_;
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
queryVectorLayerPoint=function (queryContent_) {
    queryContent=queryContent_;
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
queryVectorLayerLine=function (queryContent_) {
    queryContent=queryContent_;
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
let rad=function(d){
    return d*Math.PI/180;
};
let getDistance=function(item2){
    let earthRad=6378137;
    let lng1=currentLnglat.lng;
    let lat1=currentLnglat.lat;
    let lng2=item2.values_['lng'];
    let lat2=item2.values_['lat'];
    let radLat1=rad(lat1);
    let radLat2=rad(lat2);
    let a=radLat1-radLat2;
    let b=rad(lng1)-rad(lng2);
    let s=2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2)+Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s=s*earthRad;
    return s;
};

let queryResult=[];
DrawControlback=function (features) {
    queryResult.length=0;
    if (Draw!=null){
        map.removeInteraction(Draw);
    }
    map.removeLayer(DrawVector);
    let querySource;
    console.log(queryContent);
    if (queryContent===1){
        querySource=caseSource;
    }else if (queryContent===2){
        querySource=policeSource;
    }else if (queryContent===3){
        querySource=medicalSource;
    }else {
        querySource=0;
    }
    if (flag===4){
        let bufferedExtent=new ol.extent.buffer(features.feature.getGeometry().getExtent(),nearDis*950);
        // console.log('Point');
        let result=caseSource.forEachFeatureIntersectingExtent(bufferedExtent,success);
    }else if (flag===5){
        let bufferedExtent=new ol.extent.buffer(features.feature.getGeometry().getExtent(),nearDis*60);
        // console.log('Point');
        let result=caseSource.forEachFeatureIntersectingExtent(bufferedExtent,success);
    }
    else {
        let result=caseSource.forEachFeatureIntersectingExtent(features.feature.getGeometry().getExtent(),success);
    }
    if (origin!=='current'){
        let nearest=queryResult[0];
        for (let item of queryResult){
            if (getDistance(item)<getDistance(nearest)){
                nearest=item;
            }
        }
        //-----添加文字标注
        let createLabelStyle = function (feature) {
            return new ol.style.Style({
                text: new ol.style.Text({
                    //位置
                    textAlign: 'center',
                    //基准线
                    textBaseline: 'middle',
                    //文字样式
                    font: 'normal 20px 微软雅黑',
                    //文本内容
                    text: feature.get('name'),
                    //文本填充样式（即文字颜色）
                    fill: new ol.style.Fill({ color: '#aa3300' }),
                    stroke: new ol.style.Stroke({ color: '#ffcc33', width: 2 })
                })
            });
        };
        let labelName;
        labelName='最佳目的地';
        let wordLabel=new ol.Feature({
            geometry:new ol.geom.Point([nearest.values_['X'],nearest.values_['Y']]),
            name:labelName,
        });
        wordLabel.setStyle(createLabelStyle(wordLabel));
        drivingVectorSource.addFeature(wordLabel);
    }
};

success=function (data) {
    queryResult.push(data);
    if (queryContent===1){
        data.setStyle(createCaseStyle());
    }else if (queryContent===2){
        data.setStyle(createPoliceStyle());
    }else {
        data.setStyle(createMedicalStyle());
    }
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
        // clearPath();
        // setCurrentOrigin();
        if (origin==='current'){
            setCurrentOrigin();
        }
        isPath=true;
        driving=true;
    });
    $('#bicycling').click(function () {
        // clearPath();
        // setCurrentOrigin();
        if (origin==='current'){
            setCurrentOrigin();
        }
        isPath=true;
        bicycling=true;
    });
    $('#walking').click(function () {
        // clearPath();
        // setCurrentOrigin();
        if (origin==='current'){
            setCurrentOrigin();
        }
        isPath=true;
        walking=true;
    });
    $('#reset').click(function () {
        clearQuery();
        clearPath();
    });
    $('#currentPosition').click(function () {
        setCurrentOrigin();
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
        // console.log(evt);
        // if (feature) {
            if (isPath){
                let xy={
                    'x':evt.coordinate[0],
                    'y':evt.coordinate[1],
                };
                let lnglat=_getLngLat(xy);
                if (origin==='current'){
                    navigator.geolocation.getCurrentPosition(function (position) {
                        lnglat.lng=position.coords.longitude;
                        lnglat.lat=position.coords.latitude;
                    });
                    xy=_getMercator(lnglat);
                }
                if (origin.length===0||origin==='current'){
                    origin+=(lnglat.lng+','+lnglat.lat);
                    startMarker = new ol.Feature({
                        geometry: new ol.geom.Point([xy.x,xy.y])
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
                    destination+=(lnglat.lng+','+lnglat.lat);
                    endMarker = new ol.Feature({
                        geometry: new ol.geom.Point([xy.x,xy.y])
                    });
                    endMarker.setStyle(new ol.style.Style({
                        image: new ol.style.Icon({
                            opacity: 0.75,
                            scale:0.3,
                            src: "./image/destination2.png"
                        })
                    }));
                    drivingVectorSource.addFeatures([endMarker]);
                    isPath=false;
                    getPath();
                }
            // }
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
let currentLnglat;
setCurrentOrigin=function(){
    clearPath();
    navigator.geolocation.getCurrentPosition(function (position) {
        // console.log(position);
        currentLnglat={
            'lng':position.coords.longitude,
            'lat':position.coords.latitude,
        };
        let xy=_getMercator(currentLnglat);
        origin=(currentLnglat.lng+','+currentLnglat.lat);
        startMarker = new ol.Feature({
            geometry: new ol.geom.Point([xy.x,xy.y])
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
        let view=map.getView();
        let duration = 2000;//动画的持续时间（以毫秒为单位）
        let zoom = view.getZoom();
        let parts = 2;
        let called = false;
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
            center: [xy.x,xy.y],
            duration: duration
        }, callback);
        //第二个动画
        view.animate({
            zoom: zoom-0.3,
            duration: duration / 2
        }, {
            zoom: 15,
            duration: duration / 2
        }, callback);
        map.addLayer(drivingVectorLayer);
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
    let data={
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
    origin='current';
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
var map;//地图容器
var layerArray;//

window.onload=function () {
    var center = [12735697.59001188, 3573981.441510862];
    //最大级数
    var maxZoom = 30;
    //初始化地图图层
    var layer1 = new Zondy.Map.GoogleLayer({
        layerType: Zondy.Enum.Map.GoogleLayerType.VEC_IGS,
        ip: "develop.smaryun.com",
        port: "6163"
    });
    var layer2 = new Zondy.Map.GoogleLayer({
        layerType: Zondy.Enum.Map.GoogleLayerType.RASTER_IGS,
        ip: "develop.smaryun.com",
        port: "6163"
    });
    var layer3 = new Zondy.Map.GoogleLayer({
        layerType: Zondy.Enum.Map.GoogleLayerType.TERRAIN_IGS,
        ip: "develop.smaryun.com",
        port: "6163"
    });
    var layer4 = new Zondy.Map.GoogleLayer({
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
    addLayer();
    addListener();
    init_sourcep();
};
addLayer=function () {
    // var name = "addimg";
    // //地图文档名称
    // var docname = "images";
    // mapDocLayer = new Zondy.Map.Doc(name, docname, {
    //     //IP地址
    //     ip: "localhost",
    //     //端口号
    //     port: "6163"
    // });
    // map.addLayer(mapDocLayer);
};

var pointNearDis;//r
var query;
showPointSeachRadius=function (query_) {
    query=query_;
    document.getElementById("point-radius-box").style.display="block";
};
surePointRadius=function () {
    pointNearDis = document.getElementById("point-radius-input").value/100;
    document.getElementById("point-radius-box").style.display = "none";
    if (query=='point'){
        queryVectorLayerPoint();
    }else {
        queryVectorLayerLine();
    }
};

var createLabelStyle = function (feature) {
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
                scale:0.5,
                //透明度
                opacity: 0.75,
                //图标的url
                src: '../images/icon.png'
            })
        )
    });
};

var sourcep;
var allVector;
var array;
init_sourcep=function(){
    // data=[
    //     [12730908.29,3568833.73],
    //     [12721783.55,3566432.55],
    //     [12734512.48,3565666.01]
    // ];
    // array=[];
    // for (let i=0;i<data.length;++i){
    //     let point=new ol.Feature({
    //         geometry:new ol.geom.Point([data[i][0],data[i][1]]),
    //         id:i,
    //         x:data[i][0],
    //         y:data[i][1],
    //     });
    //     point.setStyle(new ol.style.Style({
    //         //填充色
    //         fill: new ol.style.Fill({
    //             color: 'rgba(255, 255, 255, 0.2)'
    //         }),
    //         //边线颜色
    //         stroke: new ol.style.Stroke({
    //             color: '#ffcc33',
    //             width: 2
    //         }),
    //         //形状
    //         image: new ol.style.Circle({
    //             radius: 5,
    //             fill: new ol.style.Fill({
    //                 color: '#1e1aff'
    //             })
    //         })
    //     }));
    //     array.push(point);
    // }
    // sourcep = new ol.source.Vector({
    //     features: array
    // });
    // //创建一个图层
    // allVector = new ol.layer.Vector({
    //     source: sourcep
    // });
    // map.addLayer(allVector);

    $.ajax({
        url:'http://172.26.247.156:5000/get_wuhan',
        type:"GET",
        dataType: "json",
        async: false,
        success:function (data) {
            array=[];
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
                    case_lon:data[i].lng,
                    case_lat:data[i].lat,
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
                array.push(point);
            }
            sourcep = new ol.source.Vector({
                features: array
            });
            //创建一个图层
            allVector = new ol.layer.Vector({
                source: sourcep
            });
            map.addLayer(allVector);
        }
    })

};
//--------------------------------------------------------------------
var flag=0;
var DrawVector;
var Draw;
clearQuery=function(){
    // if (flag!==0){
    //     map.removeLayer(resultVector);
    // }
    // map.addLayer(allVector);
    sourcep.clear();
    sourcep.addFeatures(array);
    // console.log('reset');
};
queryVectorLayerCircle=function () {
    // if (flag!==0){
    //     map.removeLayer(resultVector);
    // }
    clearQuery();
    flag=1;
    var source = new ol.source.Vector({ wrapX: false });
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
    var source = new ol.source.Vector({ wrapX: false });
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
    var source = new ol.source.Vector({ wrapX: false });
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
    var source = new ol.source.Vector({ wrapX: false });
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
    var source = new ol.source.Vector({ wrapX: false });
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
var queryResult=[];
var resultVector;
DrawControlback=function (features) {
    // console.log("drawend");
    queryResult.length=0;
    // map.removeLayer(allVector);
    if (Draw!=null){
        map.removeInteraction(Draw);
    }
    map.removeLayer(DrawVector);
    if (flag===4||flag===5){
        var bufferedExtent=new ol.extent.buffer(features.feature.getGeometry().getExtent(),pointNearDis*50000);
        // console.log('Point');
        let result=sourcep.forEachFeatureIntersectingExtent(bufferedExtent,success);
    }else {
        let result=sourcep.forEachFeatureIntersectingExtent(features.feature.getGeometry().getExtent(),success);
    }

    // resultVector=new ol.layer.Vector({
    //     source:new ol.source.Vector({
    //         features:queryResult,
    //     })
    // });
    sourcep.clear();
    sourcep.addFeatures(queryResult);
    // map.addLayer(resultVector);
};

success=function (data) {
    // console.log(data);
    queryResult.push(data);
};

//------------------------
let driving=false;
let origin='';
let destination='';
let drivingVectorLayer;

$(function () {
    $('#undo').bind('click',function () {
        Draw.removeLastPoint();
    });
    $('#driving').bind('click',function(){
        clearDriving();
        driving=true;
    });
    //-----------------------------------------------------------------移动
    $('#start-animation').bind('click',function () {
        for (route of geomPolylines){
            // let routeCoords=route.getCoordinates();
            // let routelength=routeCoords.length;
            // let geoMarker = new ol.Feature({
            //     type: 'geoMarker',
            //     geometry: new ol.geom.Point(routeCoords[0])
            // });
            //将离散点构建成一条折线
            // var route = new ol.geom.LineString(Coordinates);
            //获取直线的坐标
            var routeCoords = route.getCoordinates();
            var routeLength = routeCoords.length;

            var routeFeature = new ol.Feature({
                type: 'route',
                geometry: route
            });
            var geoMarker = new ol.Feature({
                type: 'geoMarker',
                geometry: new ol.geom.Point(routeCoords[0])
            });
            var startMarker = new ol.Feature({
                type: 'icon',
                geometry: new ol.geom.Point(routeCoords[0])
            });
            var endMarker = new ol.Feature({
                type: 'icon',
                geometry: new ol.geom.Point(routeCoords[routeLength - 1])
            });

            var styles = {
                'route': new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        width: 6,
                        color: [237, 212, 0, 0.8]
                    })
                }),
                'icon': new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 1],
                        scale:0.05,
                        src: "../images/red.png"
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

            var animating = false;
            var speed, now;
            var speedInput = document.getElementById('speed');
            var startButton = document.getElementById('start-animation');

            var vectorLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [routeFeature, geoMarker, startMarker, endMarker]
                }),
                style: function (feature) {
                    //如果动画是激活的就隐藏geoMarker
                    if (animating && feature.get('type') === 'geoMarker') {
                        return null;
                    }
                    return styles[feature.get('type')];
                }
            });
            var moveFeature = function (event) {
                var vectorContext = event.vectorContext;
                var frameState = event.frameState;

                if (animating) {
                    var elapsedTime = frameState.time - now;
                    //通过增加速度，来获得lineString坐标
                    var index = Math.round(speed * elapsedTime / 1000);

                    if (index >= routeLength) {
                        stopAnimation(true);
                        return;
                    }

                    var currentPoint = new ol.geom.Point(routeCoords[index]);
                    var feature = new ol.Feature(currentPoint);
                    vectorContext.drawFeature(feature, styles.geoMarker);
                }
                //继续动画效果
                map.render();
            };

            function startAnimation() {
                if (animating) {
                    stopAnimation(false);
                } else {
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
                var coord = ended ? routeCoords[routeLength - 1] : routeCoords[0];
                /** @type {ol.geom.Point} */
                (geoMarker.getGeometry()).setCoordinates(coord);
                //移除监听
                map.un('postcompose', moveFeature);
            }

            startButton.addEventListener('click', startAnimation, false);
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
        var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
            return feature;
        });
        if (feature) {
            // console.log(feature);
            // alert(feature.values_['x']+' '+feature.values_['y']);
            if (driving){
                if (origin.length===0){
                    origin+=(feature.values_['case_lon']+','+feature.values_['case_lat']);
                }else if (destination.length===0){
                    destination+=(feature.values_['case_lon']+','+feature.values_['case_lat']);
                    getPath();
                }
            }
        }
    });
    /**
     * 为map添加鼠标移动事件监听，当指向标注时改变鼠标光标状态
     */
    map.on('pointermove', function (e) {
        var pixel = map.getEventPixel(e.originalEvent);
        var hit = map.hasFeatureAtPixel(pixel);
        map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });
};
getPath=function () {
    data={
        'origin':origin,
        'destination':destination,//"116.434446,39.90816"
    };
    // console.log(data);
    $.ajax({
        url:"http://gis.hoxu.xyz:5000/driving",
        dataType:'json',
        async:true,
        data:data,
        type:'POST',
        success: function (data) {
            //请求成功时处理
            // console.log(data);
            drawPath(data);
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
    for (let i=0;i<data.value.length;++i){
        let line_org=data.value[0]['roads'];
        // console.log(line_org);
        let geomPolyline= new ol.geom.LineString(line_org);
        let featurePolyline = new ol.Feature({
            geometry: geomPolyline,
            name: 'Polyline'
        });
        geomPolylines.push(geomPolyline);
        featurePolylines.push(featurePolyline);
    }
    let polylineVectorSource = new ol.source.Vector({
        features:featurePolylines
    });
    //---style
    let stroke = new ol.style.Stroke({
        color: '#cc1000',
        width: 1.25
    });
    let stylePolyline = [
        new ol.style.Style({
            stroke: stroke
        })
    ];
    drivingVectorLayer = new ol.layer.Vector({
        title:"线",
        source: polylineVectorSource,
        style:stylePolyline,
        renderMode:'image',
        id:'driving'
    });
    map.addLayer(drivingVectorLayer);
};
clearDriving=function () {
    origin='';
    destination='';
    geomPolylines.length=0;
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
    var mercator = {};
    var earthRad = 6378137.0;
    // console.log("mercator-poi",poi);
    mercator.x = poi.lng * Math.PI / 180 * earthRad;
    var a = poi.lat * Math.PI / 180;
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
    var lnglat = {};
    lnglat.lng = poi.x/20037508.34*180;
    var mmy = poi.y/20037508.34*180;
    lnglat.lat = 180/Math.PI*(2*Math.atan(Math.exp(mmy*Math.PI/180))-Math.PI/2);
    return lnglat;
}

contains=function (map,layer) {
    for (item of map.getLayers().getArray()){
        if (item.values_['id']==='driving'){
            return true;
        }
    }
    return false;
};
//-------------
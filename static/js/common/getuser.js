get_uid = function () {
    let id = 0;
    $.ajax({
        url: "http://127.0.0.1:5000/get_usrid_ajax",    //请求的url地址
        dataType: "json",   //返回格式为json
        async: false,//请求是否异步，默认为异步，这也是ajax重要特性
        data: {},
        type: "get",   //请求方式,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            //请求成功时处理
            id = parseInt(data.id);
        }
    });
    return id;
};

get_user = function () {
    let data;
    $.ajax({
        url: "http://127.0.0.1:5000/get_user",    //请求的url地址
        dataType: "json",   //返回格式为json
        async: false,//请求是否异步，默认为异步，这也是ajax重要特性
        data: {},
        type: "get",   //请求方式,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (a) {
            //请求成功时处理
            data = a;
        }
    });
    return data;
};
$().ready(function () {
    $.ajax({
        url: "http://127.0.0.1:80/get_usrid_ajax",    //请求的url地址
        dataType: "json",   //返回格式为json
        async: true,//请求是否异步，默认为异步，这也是ajax重要特性
        data: {},
        type: "get",   //请求方式,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            //请求成功时处理
            $('h2 span').text(data.id);
        }
    });
});
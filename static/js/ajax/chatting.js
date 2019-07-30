let p1_id = 0;
let p2_id = 0;

$('.chatting').click(function () {
    // 获取两人的id
    p2_id = $(this).text();

    $.ajax({
        url: "http://127.0.0.1:5000/get_usrid_ajax",    //请求的url地址
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
            p1_id = data.id;
        }
    });



});

$('#send').click(function () {
    $('ul.chat').append("<li class=\"message right\">\n" +
        "                        <img class=\"logo\" src=\"../images/p1.jpg\" alt=\"\">\n" +
        "                        <p>" + p1_id + p2_id + "</p>\n" +
        "                    </li>");
});
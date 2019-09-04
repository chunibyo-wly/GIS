let p1_id = 0;
let p2_id = 0;

$('.chatting').click(function () {
    // 获取两人的id

    p2_id = $(this).text();

    $.ajax({
        url: "http://gis.hoxu.xyz:5000/get_usrid_ajax",    //请求的url地址
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
            p1_id = parseInt(data.id);
        }
    });

    if (p1_id === p2_id) return false;

    flush();
});

flush = function () {
    $('ul.chat').empty();

    $.ajax({
        url: "http://gis.hoxu.xyz:5000/get_messageRecords_ajax",    //请求的url地址
        dataType: "json",   //返回格式为json
        async: false,//请求是否异步，默认为异步，这也是ajax重要特性
        data: {
            "p1_id": p1_id,
            "p2_id": p2_id,
        },
        type: "post",   //请求方式,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            //请求成功时处理
            data.data.forEach(function (item, i) {
                if (item["message_from"].toString() === p1_id.toString()) {
                    $('ul.chat').append("<li class=\"message right\">\n" +
                        "                        <img class=\"logo\" src=\"../images/p1.jpg\" alt=\"\">\n" +
                        "                        <p>" + item["message_content"] + "</p>\n" +
                        "                    </li>");
                } else {
                    $('ul.chat').append("<li class=\"message left\">\n" +
                        "                        <img class=\"logo\" src=\"../images/p2.jpg\" alt=\"\">\n" +
                        "                        <p>" + item["message_content"] + "</p>\n" +
                        "                    </li>");
                }
            })
        }
    });
    if ($('.modal').css('display') !== 'none') {
        setTimeout("flush()", 5000);
    }
};

$('#send').click(function () {

    let content = $(":text").val();

    $(":text").val("");

    // $('ul.chat').append("<li class=\"message right\">\n" +
    //     "                        <img class=\"logo\" src=\"../images/p1.jpg\" alt=\"\">\n" +
    //     "                        <p>" + content + "</p>\n" +
    //     "                    </li>");

    $.ajax({
        url: "http://gis.hoxu.xyz:5000/send_message",    //请求的url地址
        dataType: "json",   //返回格式为json
        async: false,//请求是否异步，默认为异步，这也是ajax重要特性
        data: {
            "message_from": p1_id,
            "message_to": p2_id,
            "content": content,
        },
        type: "post",   //请求方式,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            //请求成功时处理
        }
    });

    flush();
});
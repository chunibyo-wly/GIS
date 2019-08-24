let p1_id = 0;
let p2_id = 0;

$('.internetName').text(get_user()['name']);

parent.$(window.parent.document).find('.chatting').click(function () {
    // 获取两人的id

    parent.$(window.parent.document).find('iframe').toggle();

    p1_id = get_uid().toString();
    p2_id = $(this).attr('uid');
    console.log(p1_id, p2_id);
    if (p1_id === p2_id) {
        parent.$(window.parent.document).find('iframe').toggle();
        return false;
    }

    $('.bg .intername').text(get_userByid(p2_id)['name']);
    $('.Righthead .headName').text(get_userByid(p2_id)['name']);

    flush();
});

flush = function () {
    $('.newsList').empty();

    $.ajax({
        url: "http://127.0.0.1:5000/get_messageRecords_ajax",    //请求的url地址
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
                    right_(item['message_content']);
                } else {
                    left_(item['message_content']);
                }
            })
        }
    });

    if (parent.$(window.parent.document).find('iframe').is(':hidden')) {
        return false;
    }

    if ($('.modal').css('display') !== 'none') {
        setTimeout("flush()", 5000);
    }
};

$('.conLeft li').on('click', function () {
    $(this).addClass('bg').siblings().removeClass('bg');
    var intername = $(this).children('.liRight').children('.intername').text();
    $('.headName').text(intername);
    $('.newsList').html('');
});

$('.sendBtn').on('click', function () {
    var news = $('#dope').val();
    if (news === '') {
        alert('不能为空');
    } else {
        right_(news);
        send_message(news);
    }
});

$('.fa-close').click(function () {
    parent.$(window.parent.document).find('iframe').hide();
});

$('.ExP').on('mouseenter', function () {
    $('.emjon').show();
});
$('.emjon').on('mouseleave', function () {
    $('.emjon').hide();
});

$('.emjon li').on('click', function () {
    var imgSrc = $(this).children('img').attr('src');
    var str = "";
    str += '<li>' +
        '<div class="nesHead"><img src="img/6.jpg"/></div>' +
        '<div class="news"><img class="Expr" src="' + imgSrc + '"></div>' +
        '</li>';
    $('.newsList').append(str);
    $('.emjon').hide();
    $('.RightCont').scrollTop($('.RightCont')[0].scrollHeight);

    send_message('<img class="Expr" src="' + imgSrc + '">');
});

send_message = function (content) {
    $.ajax({
        url: "http://127.0.0.1:5000/send_message",    //请求的url地址
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
};

right_ = function (news) {
    $('#dope').val('');
    var str = '';
    str += '<li>' +
        '<div class="nesHead"><img src="img/6.jpg"/></div>' +
        '<div class="news">' + news + '</div>' +
        '</li>';
    $('.newsList').append(str);
    $('.conLeft').find('li.bg').children('.liRight').children('.infor').text(news);
    $('.RightCont').scrollTop($('.RightCont')[0].scrollHeight);
};

left_ = function (content) {
    var answer = '';
    answer += '<li>' +
        '<div class="answerHead"><img src="img/tou.jpg"/></div>' +
        '<div class="answers">' + content + '</div>' +
        '</li>';
    $('.newsList').append(answer);
    $('.RightCont').scrollTop($('.RightCont')[0].scrollHeight);
    console.log(answer);
};
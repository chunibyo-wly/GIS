todayTask = data = [{
    'id': 15,
    'todo_list': [{
        "task": '巡逻鲁磨路',
        "progress": 0.7
    }, {
        "task": '审讯犯人',
        "progress": 0.2
    }, {
        "task": '处理许某偷窃案件',
        "progress": 0.3
    }],
},
    {
        'id': 16,
        'todo_list': [{
            "task": '登记雄楚大道市民户籍',
            "progress": 0.8
        }, {
            "task": '看监控',
            "progress": 0.5
        }, {
            "task": '建立吸毒人员流动档案',
            "progress": 0.1
        }, {
            "task": '查找赌博窝点',
            "progress": 0.9
        }],
    }, {
        'id': 17,
        'todo_list': [{
            "task": '定期走访',
            "progress": 0.4
        }, {
            "task": '按摩店里打个转',
            "progress": 0.2
        }],
    }
]


logout = function () {
    $.ajax({
        url: "http://127.0.0.1:80/logout", //请求的url地址
        dataType: "json", //返回格式为json
        async: true, //请求是否异步，默认为异步，这也是ajax重要特性
        data: {},
        type: "get", //请求方式,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (a) {
            //请求成功时处理
            window.location.href = "welcome.html";
        }
    });
};


let resulet_sidebar = get_user();
$('.sidebar-menu .name-caret').text(resulet_sidebar.name);

let role = resulet_sidebar.role.split('_')[1];
if(role === "police")
    $('.sidebar-menu p').text("警员");
else
    $('.sidebar-menu p').text("普通用户");

if (resulet_sidebar.role.split('_')[1] === "police") {
    $("#map_navigation").hide();
} else {
    $("#map_queryPath").hide();
    $("#TodayTask").hide();
}


$.ajax({
    url: "http://127.0.0.1:80/get_unread_message", //请求的url地址
    dataType: "json", //返回格式为json
    async: false, //请求是否异步，默认为异步，这也是ajax重要特性
    data: {},
    type: "get", //请求方式,
    xhrFields: {
        withCredentials: true
    },
    crossDomain: true,
    success: function (a) {
        //请求成功时处理
        // console.log(a);
        $("body > div.page-container > div > div.inner-content > div.header-section > div.top_menu > div.profile_details_left > ul > li:nth-child(3) > a > span").text(a.unread_number);
        $(".notification_header>h3").text("You have " + a.unread_number + " new notification");
        a.unread_content.forEach(function (content) {
            $("body > div.page-container > div > div.inner-content > div.header-section > div.top_menu > div.profile_details_left > ul > li:nth-child(3) > ul").append("                                    <li><a class='chatting' uid=" + content.message_from + " href=\"#\">\n" +
                "                                        <div class=\"user_img\"><img src=\"../images/in8.jpg\" alt=\"\"></div>\n" +
                "                                        <div class=\"notification_desc\">\n" +
                "                                            <p>" + content.message_content + "</p>\n" +
                "                                            <p><span>1 hour ago</span></p>\n" +
                "                                        </div>\n" +
                "                                        <div class=\"clearfix\"></div>\n" +
                "                                    </a></li>")
        });

        if (a.unread_number.toString() === "0") {
            $("body > div.page-container > div > div.inner-content > div.header-section > div.top_menu > div.profile_details_left > ul > li:nth-child(2) > a > span").hide();
            $("body > div.page-container > div > div.inner-content > div.header-section > div.top_menu > div.profile_details_left > ul > li:nth-child(3) > a > span").hide();
        }

        todayTask.forEach(function (i) {
            if (i.id.toString() === resulet_sidebar.id.toString()) {
                $("div.top_menu > div.profile_details_left > ul > li:nth-child(4) > a > span").text(i.todo_list.length);
                i.todo_list.forEach(function (j) {
                    $("body > div.page-container > div > div.inner-content > div.header-section > div.top_menu > div.profile_details_left > ul > li:nth-child(4) > ul").prepend('<li><a href="#">\n' +
                        '                                        <div class="task-info">\n' +
                        '                                            <span class="task-desc">' + j.task + '</span><span\n' +
                        '                                                class="percentage">' + j.progress * 100 + '%</span>\n' +
                        '                                            <div class="clearfix"></div>\n' +
                        '                                        </div>\n' +
                        '\n' +
                        '                                        <div class="progress progress-striped active">\n' +
                        '                                            <div class="bar blue" style="width:' + j.progress * 100 + '%;"></div>\n' +
                        '                                        </div>\n' +
                        '                                    </a></li>')
                });
            }
        })
    }
});

$(".lnr-power-switch").click(function () {
    logout();
});

$(".chatting").click(function () {
    $("div.inner-content > div.header-section > div.top_menu > div.profile_details_left > ul > li:nth-child(3) > a > span").text(0);
    $("div.inner-content > div.header-section > div.top_menu > div.profile_details_left > ul > li:nth-child(3) > a > span").hide();
});


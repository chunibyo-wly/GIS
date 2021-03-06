logout = function () {
    $.ajax({
        url: "http://gis.ylsislove.com:4999/logout",    //请求的url地址
        dataType: "json",   //返回格式为json
        async: true,//请求是否异步，默认为异步，这也是ajax重要特性
        data: {},
        type: "get",   //请求方式,
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
$('.sidebar-menu p').text(resulet_sidebar.role.split('_')[1]);

$.ajax({
    url: "http://gis.ylsislove.com:4999/get_unread_message",    //请求的url地址
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
        console.log(a);
        $("body > div.page-container > div > div.inner-content > div.header-section > div.top_menu > div.profile_details_left > ul > li:nth-child(3) > a > span").text(a.unread_number);
        $(".notification_header>h3").text("You have " + a.unread_number + " new notification");
        a.unread_content.forEach(function (content) {
            $("ul.dropdown-menu").append("                                    <li><a href=\"#\">\n" +
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

    }
});

$(".lnr-power-switch").click(function () {
    logout();
});
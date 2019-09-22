let result = get_user();
$('.profile-widget h2').text(result.name);

if (result.role.split('_')[1] === "police")
    $('.profile-widget p').text("警察");
else
    $('.profile-widget p').text("普通用户");


let information;
$.ajax({
    url: "http://gis.ylsislove.com:80/get_information",    //请求的url地址
    dataType: "json",   //返回格式为json
    async: false,//请求是否异步，默认为异步，这也是ajax重要特性
    data: {},
    type: "get",   //请求方式,
    // contentType: "application/json",
    xhrFields: {
        withCredentials: true
    },
    crossDomain: true,
    success: function (data) {
        //请求成功时处理
        // console.log(data);
        information = data;
    },
});

// if(result.role === "user_general") {
//
// }

$('#name').text(information.name);
$('#id-card').text(information.IDcard);
$('#city').text(information.city);
$('#address').text(information.address);

if (result.role === "user_police") {
    $('.p-20').append("                                <div class=\"about-info-p\">\n" +
        "                                    <strong>警察编号</strong>\n" +
        "                                    <br>\n" +
        "                                    <p class=\"text-muted\">" + information.police_id + "</p>\n" +
        "                                </div>");
    $('.p-20').append("                                <div class=\"about-info-p\">\n" +
        "                                    <strong>所属分县局</strong>\n" +
        "                                    <br>\n" +
        "                                    <p class=\"text-muted\">" + information.police_station + "</p>\n" +
        "                                </div>");
    $('.p-20').append("                                <div class=\"about-info-p\">\n" +
        "                                    <strong>派出所</strong>\n" +
        "                                    <br>\n" +
        "                                    <p class=\"text-muted\">" + information.police_stationName + "</p>\n" +
        "                                </div>");
}
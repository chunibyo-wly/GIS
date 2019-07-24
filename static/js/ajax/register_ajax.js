$("#register_submit").click(function () {
    let usr = $("#register_usr").val();
    let pwd = $("#register_pwd").val();
    let email = $("#register_email").val();

    let data = {
        "usr": usr,
        "pwd": pwd,
        "email": email,
    };

    $.ajax({
        url: "http://127.0.0.1:5000/register_ajax",    //请求的url地址
        dataType: "json",   //返回格式为json
        async: true,//请求是否异步，默认为异步，这也是ajax重要特性
        data: data,
        type: "post",   //请求方式,
        // contentType: "application/json",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        beforeSend: function () {
            //请求前的处理
        },
        success: function (data) {
            //请求成功时处理
            console.log(data);

            if (data.status === "Y") {
                self.location.href = "html/map.html"
            } else {
                alert("用户已存在!")
            }
        },
        error: function () {
            //请求出错处理
            console.log("Register Ajax Error")
        }
    });
});
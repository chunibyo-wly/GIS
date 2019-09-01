$("#login_submit").click(function () {
    let usr = $("#login_usr").val();
    let pwd = $("#login_pwd").val();

    if (usr === "" || pwd === "") {
        alert("账号密码不能为空");
        return false;
    }

    let data = {
        "usr": usr,
        "pwd": pwd,
    };

    $.ajax({
        url: "http://127.0.0.1:5000/login_ajax",    //请求的url地址
        dataType: "json",   //返回格式为json
        async: true,//请求是否异步，默认为异步，这也是ajax重要特性
        data: data,
        type: "post",   //请求方式,
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
                // self.location.href = "/html/blank.html";
                self.location.href = "/html/index.html";
            } else {
                alert(data.message)
            }
        },
        error: function () {
            //请求出错处理
            console.log("Login Ajax Error")
        }
    });
});
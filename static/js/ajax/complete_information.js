getUID = function () {
    let id = 0;
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
            id = parseInt(data.id);
        }
    });
    return id;
};

complete = function (data) {
    $.ajax({
        url: "http://gis.hoxu.xyz:5000/complete_information",    //请求的url地址
        dataType: "json",   //返回格式为json
        async: true,//请求是否异步，默认为异步，这也是ajax重要特性
        data: data,
        type: "post",   //请求方式,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            //请求成功时处理
            self.location.href = "index.html"
        }
    });
};

$('.btn-finish').click(function () {
    let id = getUID();
    let type = $('[data-toggle="wizard-radio"].active').find('[type="radio"]').val().toString();
    let name = $('#name').val();
    let city = $("#city option:selected").val();
    let date_time = $('#date-time').val();
    let id_card = $('#id-card').val();
    let address = $('#address').val();

    let data;
    if (type === "user_general") {
        data = {
            "id": id,
            "type": type,
            "name": name,
            "city": city,
            "date_time": date_time,
            "id_card": id_card,
            "address": address
        }
    } else if (type === "user_police") {
        data = {
            "id": id,
            "type": type,
            "name": name,
            "city": city,
            "date_time": date_time,
            "id_card": id_card,
            "address": address,
            "police_id": $('#police-id').val(),
            "police_station": $('#police-station').val(),
            "police_stationName": $('#police-stationName').val()
        }
    }
    complete(data);
});
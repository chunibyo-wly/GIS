# -*- coding: utf-8 -*-

from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from dao import dao

app = Flask(__name__, static_url_path='')
CORS(app, supports_credentials=True)

dao = dao('49.234.3.188', 3306, 'root', '123456', 'gis')


@app.route('/')
def index():
    return app.send_static_file('html/index.html')


@app.route("/html/<htmlName>", methods=['get'])
def html(htmlName):
    return app.send_static_file('html/' + htmlName)


@app.route('/register_ajax', methods=["post"])
def register_ajax():
    usr = str(request.form["usr"])
    pwd = str(request.form["pwd"])
    email = str(request.form["email"])
    isUsrIn = dao.execute(
        "SELECT	COUNT( * ) FROM	sys_accounts WHERE	user_name = '" + usr +
        "';")[0][0]
    if isUsrIn > 0:
        response = {
            "status": "N",
            "message": "用户已存在",
        }
        response = make_response(response)
    else:
        a = dao.execute(
            "INSERT INTO sys_accounts ( user_name, `password`, email ) VALUES ( '"
            + usr + "', '" + pwd + "', '" + email + "' );")
        response = {
            "status": "Y",
            "message": "注册成功",
        }
        response = make_response(response)
        id = str(
            dao.execute("SELECT id FROM `sys_accounts` WHERE user_name = '" +
                        usr + "'")[0][0])
        response.set_cookie('id', id)
    return response


@app.route('/login_ajax', methods=['post'])
def login_ajax():
    usr = str(request.form["usr"])
    pwd = str(request.form["pwd"])

    check = dao.execute(
        "SELECT COUNT(*) FROM `sys_accounts` WHERE user_name = '" + usr +
        "' AND `password` = '" + pwd + "'")[0][0]

    if check == 1:
        response = {
            "status": "Y",
            "message": "登陆成功",
        }
        response = make_response(response)
        id = str(
            dao.execute("SELECT id FROM `sys_accounts` WHERE user_name = '" +
                        usr + "'")[0][0])
        response.set_cookie('id', id)
    elif check == 0:
        response = {
            "status": "N",
            "message": "请检查用户名和密码",
        }
        response = make_response(response)
    return response


@app.route('/get_usrid_ajax', methods=['get'])
def get_usrid_ajax():
    id = request.cookies.get('id')
    return jsonify({"id": id}), 200


@app.route('/get_messageRecords_ajax', methods=['post'])
def get_messageRecords_ajax():
    p1_id = request.form["p1_id"]
    p2_id = request.form["p2_id"]
    result = dao.execute(
        "SELECT message_content, message_from from ( SELECT message_content, message_from, message_time FROM message_record WHERE (message_from = "
        + p1_id + " AND message_to = " + p2_id + ") OR (message_from = " +
        p2_id + " AND message_to = " + p1_id +
        ") ORDER BY message_time DESC LIMIT 10) temp ORDER BY temp.message_time;"
    )
    response = {"data": []}
    for i in range(len(result)):
        response["data"].append({
            "message_from": result[i][1],
            "message_content": result[i][0],
        })
    return make_response(response), 200


@app.route('/send_message', methods=['post'])
def send_message():
    content = request.form['content']
    message_from = request.form['message_from']
    message_to = request.form['message_to']
    dao.execute(
        "INSERT INTO message_record ( message_content, message_from, message_to ) VALUES ( '"
        + content + "', " + message_from + ", " + message_to + " );")
    return jsonify({"status": "Y"}), 200


@app.route('/complete_information', methods=['post'])
def complete_information():
    id = request.form['id']
    type = request.form['type']

    dao.execute("INSERT INTO identity (id, role) VALUES (" + id + ", '" +
                type + "');")

    name = request.form['name']
    city = request.form['city']
    date_time = request.form['date_time']
    id_card = request.form['id_card']
    address = request.form['address']

    dao.execute(
        "INSERT INTO user_basicInformation ( id, user_basicInformation.`name`, city, birthtime, IDcard, address ) VALUES ( "
        + id + ", '" + name + "', '" + city + "', '" + date_time + "', '" +
        id_card + "', '" + address + "' );")

    if type == "user_police":
        police_id = request.form['police_id']
        police_station = request.form['police_station']
        police_stationName = request.form['police_stationName']
        dao.execute(
            "INSERT INTO user_police ( id, police_id, police_station, police_stationName ) VALUES ( "
            + id + ", '" + police_id + "', '" + police_station + "', '" +
            police_stationName + "' );")

    return jsonify({
        "status": "Y",
    }), 200


@app.route('/get_user', methods=['get'])
def get_user():
    id = str(request.cookies.get('id'))
    result = dao.execute(
        "SELECT user_basicInformation.id, identity.role, user_basicInformation.`name` FROM identity, user_basicInformation WHERE identity.id = "
        + id + " AND identity.id = user_basicInformation.id;")
    return jsonify({
        "id": result[0][0],
        "role": result[0][1],
        "name": result[0][2],
    }), 200


@app.route('/get_information', methods=['get'])
def get_information():
    id = str(request.cookies.get('id'))
    result = dao.execute(
        "SELECT * FROM user_basicInformation a LEFT JOIN user_police b ON a.id = b.id LEFT JOIN identity c ON a.id = c.id WHERE a.id = "
        + id + ";")
    return jsonify({
        "id": result[0][0],
        "address": result[0][1],
        "name": result[0][2],
        "birthtime": result[0][3],
        "IDcard": result[0][4],
        "city": result[0][5],
        "police_id": result[0][6],
        "police_station": result[0][7],
        "police_stationName": result[0][8],
        "role": result[0][11],
    }), 200


# @app.route('/set_cookie', methods=['get'])
# def set_cookie():
#     response = {
#         "status": "Y",
#         "message": "登陆成功",
#     }
#     response = make_response(response)
#     response.set_cookie('Name', 'Hyman')
#     # print(response)
#     return response

# @app.route('/get_cookie')
# def get_cookie():
#     # print(request.cookies)
#     return name

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

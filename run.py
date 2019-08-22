#!./venv/bin/python
# -*- coding: utf-8 -*-

from flask import Flask, jsonify, request, make_response, json
from flask_cors import CORS
from tools.dao import dao
import random, requests, math

from tools.base64toimg import getImg
import tools.face as fa
import tools.map as m

app = Flask(__name__, static_url_path='')
CORS(app, supports_credentials=True)

dao = dao('49.234.3.188', 3306, 'root', '123456', 'gis')


@app.route('/')
def index():
    return app.send_static_file('html/welcome.html')


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
        dao.execute(
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


@app.route('/logout', methods=['get'])
def logout():
    response = make_response({
        "status": "Y",
        "message": "退出成功",
    })
    response.delete_cookie("id")
    return response, 200


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

    dao.execute("DELETE FROM unread_message_record WHERE message_to = " +
                p1_id + ";")

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
    dao.execute("CALL sp_insert_readmessage ( '" + content + "', " +
                message_from + ", " + message_to + " )")
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


@app.route('/get_unread_message', methods=['get'])
def get_unread_message():
    id = str(request.cookies.get('id'))
    unread_number = dao.execute(
        "SELECT COUNT(*) FROM unread_message_record WHERE message_to = " + id +
        ";")[0][0]

    # unread_preson_number = \
    #     dao.execute("SELECT count(DISTINCT message_from) FROM unread_message_record WHERE message_to = " + id + ";")[0][
    #         0]
    unread_content_result = dao.execute(
        "SELECT message_record.message_from, message_record.message_content FROM message_record WHERE message_record.message_id in (SELECT DISTINCT unread_message_record.message_id FROM unread_message_record  ) and message_to = "
        + id + " ORDER BY message_time DESC LIMIT 1")
    response = {
        "unread_number": unread_number,
        # "unread_preson_number": unread_preson_number,
        "unread_content": []
    }
    for i in unread_content_result:
        response["unread_content"].append({
            "message_from": i[0],
            "message_content": i[1]
        })
    return jsonify(response), 200


@app.route('/get_case', methods=['post'])
def get_case():
    number = int(request.form['num'])
    result = dao.execute(
        "SELECT case_id, case_name, DATE_FORMAT(inform_time, '%Y-%m') as inform_time, case_position, id FROM `case` ORDER BY  case_id DESC;"
    )
    response = {"data": []}
    begin = (number - 1) * 8
    end = number * 8 - 1
    for i in range(begin, min(end + 1, begin + len(result))):
        response["data"].append({
            "case_id": result[i][0],
            "case_name": result[i][1],
            "inform_time": result[i][2],
            "case_position": result[i][3],
            "uid": result[i][4]
        })
    return jsonify(response)


@app.route('/delete_case', methods=['post'])
def delete_case():
    case_id = request.form.getlist('case_id[]')
    for i in case_id:
        dao.execute("DELETE FROM `case` WHERE case_id = " + i + ";")
    return jsonify({"status": "Y"}), 200


@app.route('/insert_case', methods=['post'])
def insert_case():
    case_type = request.form['case_type']
    case_position = request.form['case_position']
    case_lat = request.form['case_lat']
    case_lon = request.form['case_lon']
    inform_time = request.form['inform_time']
    case_description = request.form['case_description']
    x, y = m.lonlat2Mercator(float(case_lon), float(case_lat))
    id = request.cookies.get("id")
    case_name = request.form['case_name']
    dao.execute(
        "INSERT INTO `case` (case_type, case_position, case_lon, case_lat,case_description,inform_time,X,Y,id,case_name) VALUES ('"
        + case_type + "', '" + case_position + "', " + case_lon + ", " +
        case_lat + ",'" + case_description + "','" + inform_time + "','" +
        str(x) + "','" + str(y) + "','" + str(id) + "','" + case_name + "')")
    return jsonify({"status": "Y"}), 200


@app.route('/get_wuhan', methods=['get'])
def get_wuhan():
    result = dao.execute(
        "SELECT * , DATE_FORMAT(inform_time, '%Y-%m-%d') as time FROM `case` LIMIT 500;"
    )
    response = []
    # random_list = list(range(6000))
    # random.shuffle(random_list)
    # for i in random_list[:499]:
    for i in range(len(result)):
        response.append({
            "case_id": result[i][0],
            "case_name": result[i][1],
            "case_type": result[i][2],
            "time": result[i][13],
            "case_position": result[i][6],
            "case_description": result[i][9],
            "case_status": result[i][10],
            "X": float(result[i][11]),
            "Y": float(result[i][12]),
            "lng": float(result[i][7]),
            "lat": float(result[i][8]),
        })
    return jsonify(response), 200


@app.route('/driving', methods=['POST'])
def driving():
    key = 'dddd10e80880227d5396a1cb3b23582c'
    api = 'https://restapi.amap.com/v3/direction/driving'
    origin = str(request.form["origin"])
    destination = str(request.form["destination"])
    extensions = 'all'
    data = {
        'key': key,
        'origin': origin,
        'destination': destination,
        'extensions': extensions,
        'strategy': 10
    }
    r = requests.get(api, params=data)
    data = json.loads(r.text)
    if data['status'] != '1':
        response = {'status': 'N', 'message': 'error'}
    else:
        path_count = int(data['count'])
        paths = data['route']['paths']
        values = []
        for i in range(path_count):
            roads = []
            path = paths[i]
            distance = path['distance']
            duration = path['duration']
            strategy = path['strategy']
            restriction = path['restriction']
            traffic_lights = path['traffic_lights']
            steps = path['steps']
            for step in steps:
                polyline = step['polyline']
                for ss in polyline.split(';'):
                    earth_rad = 6378137.0
                    sss = ss.split(',')
                    sss[0] = float(sss[0]) * math.pi / 180 * earth_rad
                    tmp = float(sss[1]) * math.pi / 180
                    sss[1] = earth_rad / 2 * math.log(
                        (1.0 + math.sin(tmp)) / (1.0 - math.sin(tmp)))
                    roads.append(sss)
            value = {
                'distance': distance,
                'duration': duration,
                'strategy': strategy,
                'restriction': restriction,
                'traffic_lights': traffic_lights,
                'roads': roads
            }
            values.append(value)
        response = {'status': 'Y', 'message': 'Success', 'value': values}
    response = make_response(response)
    return response, 200


@app.route('/face', methods=['post'])
def face():
    token2index = {}
    data = fa.getJSON("./tools/suspects.json")

    for i in range(len(data)):
        token2index[data[i]["token"]] = i

    base64_data = request.form['base64_data']
    getImg(base64_data, "tempFile.png")
    results = fa.search("./tempFile.png")["results"]
    response = []

    for i in results:
        response.append(data[token2index[i["face_token"]]])

    return jsonify(response), 200


@app.route('/get_police', methods=['GET'])
def get_police():
    result = dao.execute("select * from `police_station`;")
    response = []
    random_list = list(range(900))
    random.shuffle(random_list)
    earth_rad = 6378137.0
    for i in random_list[:300]:
        tmp = float(result[i][5]) * math.pi / 180
        response.append({
            'police_station_id':
            result[i][0],
            'id':
            result[i][1],
            'name':
            result[i][2],
            'address':
            result[i][3],
            'lng':
            float(result[i][4]),
            'lat':
            float(result[i][5]),
            'photos':
            result[i][6],
            'tel':
            result[i][7],
            'X':
            float(result[i][4]) * math.pi / 180 * earth_rad,
            'Y':
            earth_rad / 2 * math.log(
                (1.0 + math.sin(tmp)) / (1.0 - math.sin(tmp)))
        })
    return jsonify(response), 200


@app.route('/get_path', methods=['POST'])
def get_path():
    key = 'dddd10e80880227d5396a1cb3b23582c'
    api = 'https://restapi.amap.com/v3/direction/'
    origin = str(request.form["origin"])
    destination = str(request.form["destination"])
    mode = str(request.form['mode'])
    api += mode
    if mode == 'driving':
        extensions = 'all'
        data = {
            'key': key,
            'origin': origin,
            'destination': destination,
            'extensions': extensions,
            'strategy': 10
        }
    else:
        data = {
            'key': key,
            'origin': origin,
            'destination': destination,
        }
    if mode == 'bicycling':
        api = 'https://restapi.amap.com/v4/direction/bicycling'
    r = requests.get(api, params=data)
    data = json.loads(r.text)
    if mode != 'bicycling':
        if data['status'] != '1':
            response = {'status': 'N', 'message': data['info']}
            response = make_response(response)
            return response, 200
    else:
        if data['errcode'] != 0:
            response = {'status': 'N', 'message': data['errdetail']}
            response = make_response(response)
            return response, 200

    # path_count = int(data['count'])
    if mode == 'bicycling':
        paths = data['data']['paths']
    else:
        paths = data['route']['paths']
    values = []
    for i in range(len(paths)):
        roads = []
        path = paths[i]
        distance = path['distance']
        duration = path['duration']
        # strategy = path['strategy']
        # restriction = path['restriction']
        # traffic_lights = path['traffic_lights']
        steps = path['steps']
        for step in steps:
            polyline = step['polyline']
            for ss in polyline.split(';'):
                earth_rad = 6378137.0
                sss = ss.split(',')
                sss[0] = float(sss[0]) * math.pi / 180 * earth_rad
                tmp = float(sss[1]) * math.pi / 180
                sss[1] = earth_rad / 2 * math.log(
                    (1.0 + math.sin(tmp)) / (1.0 - math.sin(tmp)))
                roads.append(sss)
        if mode == 'driving':
            value = {
                'distance': distance,
                'duration': duration,
                'strategy': path['strategy'],
                'restriction': path['restriction'],
                'traffic_lights': path['traffic_lights'],
                'roads': roads
            }
        else:
            value = {
                'distance': distance,
                'duration': duration,
                'roads': roads
            }
        values.append(value)
    response = {'status': 'Y', 'message': 'Success', 'value': values}
    response = make_response(response)
    return response, 200


@app.route('/get_userByid', methods=['post'])
def get_userByid():
    id = str(request.form['id'])
    result = dao.execute(
        "SELECT user_basicInformation.id, identity.role, user_basicInformation.`name` FROM identity, user_basicInformation WHERE identity.id = "
        + id + " AND identity.id = user_basicInformation.id;")
    return jsonify({
        "id": result[0][0],
        "role": result[0][1],
        "name": result[0][2],
    }), 200


@app.route('/get_wuhan2', methods=['get'])
def get_wuhan2():
    result = dao.execute("SELECT * , DATE_FORMAT(time, '%Y-%m-%d %H:%i') as abcd FROM `wuhan_pois` ;")
    response = []
    for i in range(len(result)):
        response.append({
            "case_id": result[i][0],
            "position_name": result[i][1],
            # "position_type": result[i][2],
            'case_address':result[i][3],
            "lng": float(result[i][4]),
            "lat": float(result[i][5]),
            "X": float(result[i][6]),
            "Y": float(result[i][7]),
            'case_area':result[i][8],
            "time": result[i][12],
            "case_description": result[i][10],
            'case_name':result[i][11]
        })
    return jsonify(response), 200

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

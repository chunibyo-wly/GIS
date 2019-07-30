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
    isUsrIn = dao.execute("SELECT	COUNT( * ) FROM	sys_accounts WHERE	user_name = '" + usr + "';")[0][0]
    if isUsrIn > 0:
        response = {
            "status": "N",
            "message": "用户已存在",
        }
        response = make_response(response)
    else:
        a = dao.execute(
            "INSERT INTO sys_accounts ( user_name, `password`, email ) VALUES ( '" + usr + "', '" + pwd + "', '" + email + "' );")
        response = {
            "status": "Y",
            "message": "注册成功",
        }
        response = make_response(response)
        id = str(dao.execute(
            "SELECT id FROM `sys_accounts` WHERE user_name = '" + usr + "'"
        )[0][0])
        response.set_cookie('id', id)
    return response


@app.route('/login_ajax', methods=['post'])
def login_ajax():
    usr = str(request.form["usr"])
    pwd = str(request.form["pwd"])

    check = dao.execute(
        "SELECT COUNT(*) FROM `sys_accounts` WHERE user_name = '" + usr + "' AND `password` = '" + pwd + "'")[0][0]
    print("SELECT COUNT(*) FROM `sys_accounts` WHERE user_name = '" + usr + "' AND `password` = '" + pwd + "'")

    if check == 1:
        response = {
            "status": "Y",
            "message": "登陆成功",
        }
        response = make_response(response)
        id = str(dao.execute(
            "SELECT id FROM `sys_accounts` WHERE user_name = '" + usr + "'"
        )[0][0])
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
    return jsonify({
        "id": id
    }), 200


@app.route('/set_cookie', methods=['get'])
def set_cookie():
    response = {
        "status": "Y",
        "message": "登陆成功",
    }
    response = make_response(response)
    response.set_cookie('Name', 'Hyman')
    print(response)
    return response


@app.route('/get_cookie')
def get_cookie():
    print(request.cookies)
    return name


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

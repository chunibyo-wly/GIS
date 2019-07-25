# -*- coding: utf-8 -*-

from flask import Flask, jsonify, request
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
    else:
        a = dao.execute(
            "INSERT INTO sys_accounts ( user_name, `password`, email ) VALUES ( '" + usr + "', '" + pwd + "', '" + email + "' );")
        response = {
            "status": "Y",
            "message": "注册成功",
        }

    return jsonify(response), 200


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
    elif check == 0:
        response = {
            "status": "N",
            "message": "请检查用户名和密码",
        }
    return jsonify(response), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

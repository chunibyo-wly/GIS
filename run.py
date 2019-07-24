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


@app.route('/register_ajax', methods=["post"])
def register_ajax():
    usr = str(request.form["usr"])
    pwd = str(request.form["pwd"])
    email = str(request.form["email"])

    # usr = "1"
    # pwd = "1"
    # email = "1"
    # print("SELECT	COUNT( * ) FROM	sys_accounts WHERE	user_name = '" + usr + "';")

    isUsrIn = dao.execute("SELECT	COUNT( * ) FROM	sys_accounts WHERE	user_name = '" + usr + "';")[0][0]
    print(isUsrIn)
    if isUsrIn > 0:
        response = {
            "status": "N",
            "message": "用户已存在",
        }
    else:
        a = dao.execute(
            "INSERT INTO sys_accounts ( user_name, `password`, email ) VALUES ( '" + usr + "', '" + pwd + "', '" + email + "' );")
        print(
            "INSERT INTO sys_accounts ( user_name, `password`, email ) VALUES ( '" + usr + "', '" + pwd + "', '" + email + "' );")
        response = {
            "status": "Y",
            "message": "注册成功"
        }

    return jsonify(response), 200


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)

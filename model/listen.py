import os

import tornado.ioloop
import tornado.web
import json
from model.connect_sqlsever import *
from tornado.httpclient import AsyncHTTPClient

db_ip = '127.0.0.1'
db_name = 'admin'
db_pw = '123456'
db_username = 'admin'


class CORSMixin(object):
    def set_default_headers(self):
        origin_url = self.request.headers.get('Origin')
        self.set_header("Access-Control-Allow-Origin", 'http://localhost/')
        self.set_header("Access-Control-Allow-Credentials", "true")
        self.set_header("Access-Control-Allow-Headers", "x-requested-with,token")
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.set_header("Access-Control-Max-Age", 1000)
        self.set_header("Content-type", "application/json")


# 请求转发代理服务器
class proxy(tornado.web.RequestHandler, CORSMixin):
    async def post(self):
        target_url = "http://127.0.0.1:11451"  # Tornado 服务器的地址
        body = self.request.body
        try:
            # 发送 POST 请求到目标服务器
            http_client = AsyncHTTPClient()
            response = await http_client.fetch(target_url, method="POST", body=body)
            self.write(response.body)
        except Exception as e:
            self.set_status(500)
            self.write(f"Error: {e}")


class listen(tornado.web.RequestHandler, CORSMixin):

    def post(self):
        self.set_status(200)
        body = self.request.body.decode('utf-8')
        data = json.loads(body)
        print('post')
        print(data)

        self.set_header("Access-Control-Allow-Origin", "http://localhost")
        self.set_header("Access-Control-Allow-Credentials", "true")
        self.write(json.dumps({"message": "ok123"}))

    def get(self):
        # 尝试从查询参数中获取名为 'data' 的参数
        data_str = self.get_argument('data', None)  # 如果没有 'data' 参数，则返回 None
        if data_str is not None:
            try:
                # 尝试将字符串解析为JSON
                data = json.loads(data_str)
                print(data)
            except json.JSONDecodeError as e:
                # 处理JSON解析错误
                print(f"Error parsing JSON: {e}")
                self.write("Error parsing JSON")
                self.set_status(400)  # 设置HTTP状态码为400 Bad Request
                return
        else:
            # 'data' 参数不存在
            self.write("No 'data' parameter provided")
            self.set_status(400)  # 设置HTTP状态码为400 Bad Request

        # 如果一切正常，则返回 'ok'
        self.write("ok")

    def options(self):
        self.set_header("Access-Control-Allow-Origin", 'http://localhost')
        self.set_header("Access-Control-Allow-Credentials", "true")
        self.set_header("Access-Control-Allow-Headers", "x-requested-with,token")
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.set_header("Access-Control-Max-Age", 1000)
        self.set_header("Content-type", "application/json")
        print(self.request.headers)
        self.set_status(200)
        print("options")
        self.finish()


class getMessage(tornado.web.RequestHandler, CORSMixin):
    message = ''

    def post(self):
        self.set_status(200)
        body = self.request.body.decode('utf-8')
        data = json.loads(body)
        self.message = data['message']
        self.write(json.dumps({"root_msg": self.message}))
        print(self.message)


class getUserInfo(tornado.web.RequestHandler, CORSMixin):
    username = ''
    userAvatar = ''
    result = ''

    def get_userinfo(self):
        db_conn = connMysql
        sql = "SELECT username FROM users"
        result = db_conn.connect(self)
        print('连接成功')
        cursor = result.cursor()
        cursor.execute(sql)
        # 获取查询结果
        rows = cursor.fetchall()
        self.result = [row[0] for row in rows]  # 提取用户名

    def post(self):
        self.set_status(200)
        body = self.request.body.decode('utf-8')
        try:
            if body.strip():  # 检查请求体是否为空
                data = json.loads(body)
            else:
                data = 'none'  # 如果为空，则设置 data 为 None
            self.get_userinfo()
            if self.result:
                self.write(json.dumps({"username": self.result}))
                print(self.result)
            else:
                self.write(json.dumps({"error": "No user found"}))
        except Exception as e:
            self.write(json.dumps({"error": "Invalid request", "details": str(e)}))
            print("Invalid request:", str(e))

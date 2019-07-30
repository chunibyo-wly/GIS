# -*- coding: utf-8 -*-

import pymysql


class dao(object):
    def __init__(self, host, port, user, passwd, db, charset='utf8'):
        self.conn = pymysql.connect(
            host=host,
            port=port,
            user=user,
            passwd=passwd,
            db=db,
            charset=charset
        )

    def get_cursor(self):
        return self.conn.cursor()

    def execute(self, sql):
        self.conn.ping(reconnect=True)
        cursor = self.get_cursor()
        try:
            cursor.execute(sql, None)
            self.conn.commit()
            result = cursor.fetchall()
        finally:
            cursor.close()
        return result

    def close(self):
        try:
            self.conn.close()
        except:
            pass

    def __del__(self):
        self.close()


if __name__ == '__main__':
    dao = dao('49.234.3.188', 3306, 'root', '123456', 'gis')

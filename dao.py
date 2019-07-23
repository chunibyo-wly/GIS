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
            # cursorclass=pymysql.cursors.DictCursor
        )

    def get_cursor(self):
        return self.conn.cursor()

    def query(self, sql):
        cursor = self.get_cursor()
        try:
            cursor.execute(sql, None)
            result = cursor.fetchall()
        finally:
            cursor.close()
        return result

    # def execute(self, sql, param=None):
    #     cursor = self.get_cursor()
    #     try:
    #         cursor.execute(sql, param)
    #         self.conn.commit()
    #         affected_row = cursor.rowcount
    #     except Exception, e:
    #         print e
    #         return 0
    #     finally:
    #         cursor.close()
    #     return affected_row

    def close(self):
        try:
            self.conn.close()
        except:
            pass

    def __del__(self):
        self.close()


if __name__ == '__main__':
    dao = dao('49.234.3.188', 3306, 'root', '123456', 'gis')

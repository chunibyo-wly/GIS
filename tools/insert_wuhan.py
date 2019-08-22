from dao import dao
import csv, random
dao = dao('49.234.3.188', 3306, 'root', '123456', 'gis')


def insert(a, b, c, d):
    dao.execute(
        "INSERT INTO `case` (case_type, case_position, case_lon, case_lat) VALUES ('"
        + a + "', '" + b + "', " + str(c) + ", " + str(d) + ")")
    pass


def update(i, a):
    # dao.execute("UPDATE wuhan_pois SET time = '" + a + "' WHERE ID = " +
    #             str(i) + "")
    # dao.execute("UPDATE wuhan_pois SET case_name = '" + a + "' WHERE ID = " +
    #             str(i) + "")
    dao.execute("UPDATE `case` SET case_description = '" + a +
                "' WHERE `case_id` = " + str(i) + "")
    pass


r = [[
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
],
     [
         'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
         'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
     ], ['1', '2', '3', '4', '5', '6', '7', '8', '9']]

# 作案手段
a = [
    '入室盗窃', '街头扒窃', '盗窃三车', '盗窃保险柜', '盗窃（破坏）电力电信设施', '扒车盗窃', '盗油', '盗电',
    '盗窃电缆、电线、U形线夹', '飞车抢夺', '入室抢劫', '网络诈骗', '街头诈骗', '电信诈骗', '肇事逃逸', '虚假诉讼',
    '醉酒驾驶', '酒后驾驶', '醉酒驾驶', '肇事逃逸', '肇事逃逸', '肇事逃逸'
]

b = [
    '赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫', '蒋', '沉', '韩',
    '杨', '朱', '秦', '尤', '许', '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏',
    '陶', '姜', '戚', '谢', '邹', '喻', '柏', '水', '窦', '章', '云', '苏', '潘', '葛', '奚',
    '范', '彭', '郎', '赵', '钱', '孙', '李', '周', '吴', '郑', '赵', '钱', '孙', '李', '周',
    '吴', '郑', '王', '冯', '陈', '褚', '卫', '蒋', '沉', '韩', '杨', '朱', '秦', '尤'
]

c = ['被捕', '在逃', '审讯']

if __name__ == "__main__":
    for i in range(7922):
        u = random.choice(b) + "某某" + random.choice(a) + random.choice(c)
        update(i + 1, u)

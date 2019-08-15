import openpyxl
from tools.dao import dao

dao = dao('49.234.3.188', 3306, 'root', '123456', 'gis')


def insert(a, b, c, d1, d2, e, f):
    dao.execute(
        "INSERT INTO police_station (police_station_id, name, address, lng, lat, photos,tel) VALUES ('" + a + "', '" + b + "', '" + c + "', " + d1 + ", " + d2 + ", '" + e + "', '" + f + "')")


book = openpyxl.load_workbook('police.xlsx')
sheet = book.active
cols = ["A", "B", "C", "D", "E", "F"]

# for i in range(2, 3):
for i in range(2, sheet.max_row + 1):
    a = sheet["A" + str(i)].value
    b = sheet["B" + str(i)].value
    c = sheet["C" + str(i)].value
    d = sheet["D" + str(i)].value
    e = sheet["E" + str(i)].value
    f = "NULL"
    # f = sheet["F" + str(i)].value
    # print(d.split(","))
    if c is None:
        c = "无地点信息"
    if d is None:
        d = "NULL"
    if e is None:
        e = "NULL"
    if f is None:
        f = "NULL"
    d1 = d.split(",")[0]
    d2 = d.split(",")[1]
    insert(a, b, c, d1, d2, f, e)
    # print((a, b, c, d1, d2, f, e))

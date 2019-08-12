from tools.dao import dao
import csv, random
dao = dao('49.234.3.188', 3306, 'root', '123456', 'gis')


def insert(a, b, c, d):
    dao.execute(
        "INSERT INTO `case` (case_type, case_position, case_lon, case_lat) VALUES ('"
        + a + "', '" + b + "', " + str(c) + ", " + str(d) + ")")
    pass


if __name__ == "__main__":
    with open('../hubei_wuhan_hongshan_POIs.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        line_count = 0
        for row in csv_reader:
            line_count += 1
            if line_count == 100:
                break

            c = row[0].encode('utf-8').decode('utf-8-sig')
            d = row[0].encode('utf-8').decode('utf-8-sig')

            dice = random.random()

            if dice < 0.4:
                a = '民事'
            elif dice < 0.8:
                a = '行政'
            else:
                a = '刑事'

            b = row[6].encode('utf-8').decode('utf-8-sig').strip(
            ) + row[7].encode('utf-8').decode('utf-8-sig').strip(
            ) + row[8].encode('utf-8').decode('utf-8-sig').strip(
            ) + row[5].encode('utf-8').decode('utf-8-sig').strip()
            # print(b)
            insert(a, b, c, d)

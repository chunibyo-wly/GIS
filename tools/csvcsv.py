import csv
import codecs, random

csvFile = open('case.csv', encoding='utf-8')
reader = csv.reader(csvFile)

fileHeader = [
    'case_id', 'case_name', 'case_type', 'id', 'bbb', 'inform_time',
    'case_position', 'case_lon', 'case_lat', 'case_description', 'case_status',
    'X', 'Y'
]

# file1 = codecs.open('./Resources/in.csv', 'w', 'utf_8_sig')
file2 = codecs.open('./out.csv', 'w', 'utf_8_sig')
# writer1 = csv.writer(file1)
writer2 = csv.writer(file2)
# writer1.writerow(fileHeader)
writer2.writerow(fileHeader)

reader = list(reader)

random_list = list(range(len(reader)))
random.shuffle(random_list)

# print(list(reader)[0])

for i in random_list[:500]:
    writer2.writerow(reader[i])

csvFile.close()
# file1.close()
file2.close()

import random
import numpy as np

# for i in range(7):
#     print(str(23 + random.randint(-20, 10)) + ",", end="")

# a = [33, 12, 21, 21, 15, 31, 37]
# b = [21, 34, 32, 44, 28, 30, 47]
# c = [15, 15, 7, 16, 3, 26, 19]
# for i in range(len(a)):
#     print(a[i] + b[i] + c[i], end=", ")
from flask import jsonify

a = []
b = ['江岸', '江汉', '硚口', '汉阳', '武昌', '青山', '洪山', '蔡甸', '江夏', '黄陂', '新洲', '东西湖', '江南']

for i in range(7):
    a.append(90 + random.randint(-10, 50))
for i in range(6):
    a.append(50 + random.randint(-20, 20))

# a = np.array(a)

a = sorted(a, reverse=True)
# print(a.sum())
# a = sorted(a / a.sum() * 100, reverse=True)
for i in ["{value: " + str(a[i]) + ", name: '" + b[i] + "'}" for i in range(len(a))]:
    print(i, end=",\n")

#!../venv/bin/python

import os

path = '/home/chunibyo/Documents/Code/GIS/static/photo/'
# 获取该目录下所有文件，存入列表中
f = os.listdir(path)
n = 0
for i in f:
    try:
        # 设置旧文件名（就是路径+文件名）
        oldname = path + f[n]
        # 设置新文件名
        newname = path + str(n + 1) + "backpack.png"
        print(newname)
        # 用os模块中的rename方法对文件改名
        os.rename(oldname, newname)
        n += 1
    except Exception:
        print(n)
        continue

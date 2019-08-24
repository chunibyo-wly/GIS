#!../venv/bin/python

#提取目录下所有图片,更改尺寸后保存到另一目录
from PIL import Image
import os

basewidth = 300


def resize(imgFile):
    img = Image.open(imgFile)
    wpercent = (basewidth / float(img.size[0]))
    hsize = int((float(img.size[1]) * float(wpercent)))
    img = img.resize((basewidth, hsize), Image.ANTIALIAS)
    img.save(imgFile)


if __name__ == "__main__":
    path = '/home/chunibyo/Documents/Code/GIS/static/photo/'
    # 获取该目录下所有文件，存入列表中
    f = os.listdir(path)
    n = 0
    for i in f:
        resize(path + i)
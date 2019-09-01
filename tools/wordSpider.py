#!../venv/bin/python
import requests
from bs4 import BeautifulSoup
import os, sys

target_url = "http://www.zhuatongji.com/tongjinews/list_4_"
domain = "http://www.zhuatongji.com"
srcSet = []

if __name__ == "__main__":
    os.remove('word_cloud.txt')
    f = open("word_cloud.txt", "w+")
    for i in range(2, 150):
        r = requests.get(target_url + str(i) + ".html")
        r.encoding = 'gb18030'
        soup = BeautifulSoup(r.text, 'html.parser')
        for a in soup.select("#col1 > div:nth-child(1) > ul span a"):
            f.write(a['title'] + "\n")

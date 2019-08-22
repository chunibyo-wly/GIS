#!../venv/bin/python
import requests
from bs4 import BeautifulSoup
import os, sys

target_url = "http://www.zhuatongji.com/wszttjf/list_3_"

image_url = "http://supcache.airbdata.cn/data/www.zhuatongji.com/"


def download(file_name, Photo_URL):
    Picture_request = requests.get(image_url + Photo_URL)
    if Picture_request.status_code == 200:
        with open('./photo/' + file_name, 'wb') as f:
            f.write(Picture_request.content)


if __name__ == "__main__":
    i = 1
    page = 1
    try:
        for page in range(1, 30):
            soup = BeautifulSoup(
                requests.get(target_url + str(page) + ".html", timeout=5).text,
                'html.parser')
            for img in soup.select('#col1 > div:nth-child(1) > ul img'):
                download(str(i) + ".png", img.get("src"))
                # print(img.get("src"))
                i = i + 1
    except Exception:
        print("page", page, "i", i)

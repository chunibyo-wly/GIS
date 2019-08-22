#!../venv/bin/python
import requests
from bs4 import BeautifulSoup
import os, sys

target_url = "http://www.zhuatongji.com/wszttjf/list_3_"

image_url = "http://supcache.airbdata.cn/data/www.zhuatongji.com/"

srcSet = []


def download(file_name, Photo_URL):
    Picture_request = requests.get(image_url + Photo_URL)
    if Picture_request.status_code == 200:
        with open('../static/photo/' + file_name, 'wb') as f:
            f.write(Picture_request.content)


if __name__ == "__main__":
    i = 1
    page = 1

    for page in range(0, 75):
        try:
            soup = BeautifulSoup(
                requests.get(target_url + str(page) + ".html", timeout=5).text,
                'html.parser')
            for img in soup.select('#col1 > div:nth-child(1) > ul img'):
                src = img.get("src")
                if src in srcSet:
                    pass
                else:
                    download(str(i) + ".png", src)
                    srcSet.append(src)
                    i = i + 1
        except Exception:
            print(Exception.__traceback__)
            print("page", page, "i", i)
            continue

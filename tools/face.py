import requests
import base64, json


def getBase64(img_url):
    with open(img_url, 'rb') as f:  # 以二进制读取图片
        data = f.read()
        encodestr = base64.b64encode(data)  # 得到 byte 编码的数据
        return str(encodestr, 'utf-8')


def post(url, data):
    return json.loads(requests.post(url=url, data=data).text)


def get_facetoken(img_url):
    url = "https://api-cn.faceplusplus.com/facepp/v3/detect"
    data = {
        "api_key": "GWqaAqG0MfSfEfTiVKu0taglGeaXWasF",
        "api_secret": "QCIdvQUzMN1ElGJVxDjH96Qgws7rgK4o",
        "image_base64": getBase64(img_url)
    }
    return post(url, data)["faces"][0]["face_token"]


def search():
    url = "https://api-cn.faceplusplus.com/facepp/v3/search"
    data = {
        "api_key": "GWqaAqG0MfSfEfTiVKu0taglGeaXWasF",
        "api_secret": "QCIdvQUzMN1ElGJVxDjH96Qgws7rgK4o",
        # "image_base64": getBase64("faceset/5.png"),
    }


def getfacesets():
    url = "https://api-cn.faceplusplus.com/facepp/v3/faceset/getfacesets"
    data = {
        "api_key": "GWqaAqG0MfSfEfTiVKu0taglGeaXWasF",
        "api_secret": "QCIdvQUzMN1ElGJVxDjH96Qgws7rgK4o",
    }
    r = post(url, data)
    print(r)


def createfacesets():
    url = "https://api-cn.faceplusplus.com/facepp/v3/faceset/create"
    data = {
        "api_key": "GWqaAqG0MfSfEfTiVKu0taglGeaXWasF",
        "api_secret": "QCIdvQUzMN1ElGJVxDjH96Qgws7rgK4o",
        "display_name": "antu",
        "outer_id": "antu",
        "force_merge": 1
    }
    print(post(url, data))


def addface(img_url):
    url = " https://api-cn.faceplusplus.com/facepp/v3/faceset/addface"
    data = {
        "api_key": "GWqaAqG0MfSfEfTiVKu0taglGeaXWasF",
        "api_secret": "QCIdvQUzMN1ElGJVxDjH96Qgws7rgK4o",
        "outer_id": "antu",
        "face_tokens": get_facetoken(img_url)
    }
    print(post(url, data))


if __name__ == "__main__":
    # createfacesets()
    getfacesets()
    # get_facetoken("./faceset/5.png")
    # addface("./faceset/5.png")

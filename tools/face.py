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


def getJSON(url):
    with open(url) as f:
        return json.load(f)


def updateJSON(data):
    with open("./suspects.json", "r+") as f:
        f.seek(0)  # rewind
        json.dump(data, f)
        f.truncate()


def search(img_url):
    url = "https://api-cn.faceplusplus.com/facepp/v3/search"
    data = {
        "api_key": "GWqaAqG0MfSfEfTiVKu0taglGeaXWasF",
        "api_secret": "QCIdvQUzMN1ElGJVxDjH96Qgws7rgK4o",
        "image_base64": getBase64(img_url),
        "outer_id": "antu",
        "return_result_count": 4
    }
    return post(url, data)


def getfacesets():
    url = "https://api-cn.faceplusplus.com/facepp/v3/faceset/getfacesets"
    data = {
        "api_key": "GWqaAqG0MfSfEfTiVKu0taglGeaXWasF",
        "api_secret": "QCIdvQUzMN1ElGJVxDjH96Qgws7rgK4o",
        "start": 1
    }
    r = post(url, data)
    print(r)


def getfaceset():
    url = "https://api-cn.faceplusplus.com/facepp/v3/faceset/getdetail"
    data = {
        "api_key": "GWqaAqG0MfSfEfTiVKu0taglGeaXWasF",
        "api_secret": "QCIdvQUzMN1ElGJVxDjH96Qgws7rgK4o",
        "outer_id": "antu"
    }
    r = post(url, data)
    print(r["face_count"])


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


def addface(face_token):
    url = " https://api-cn.faceplusplus.com/facepp/v3/faceset/addface"
    data = {
        "api_key": "GWqaAqG0MfSfEfTiVKu0taglGeaXWasF",
        "api_secret": "QCIdvQUzMN1ElGJVxDjH96Qgws7rgK4o",
        "outer_id": "antu",
        "face_tokens": face_token
    }
    r = post(url, data)
    if "error_message" in r:
        print(r["error_message"])
    else:
        print(r["face_count"])


def removeAllFace():
    url = "https://api-cn.faceplusplus.com/facepp/v3/faceset/removeface"
    data = {
        "api_key": "GWqaAqG0MfSfEfTiVKu0taglGeaXWasF",
        "api_secret": "QCIdvQUzMN1ElGJVxDjH96Qgws7rgK4o",
        "outer_id": "antu",
        "face_tokens": "RemoveAllFaceTokens"
    }
    post(url, data)


if __name__ == "__main__":
    # removeAllFace()
    # getfaceset()

    data = getJSON("./suspects.json")
    for i in range(len(data)):
        token = get_facetoken(data[i]["img_url"])
        data[i]["token"] = token
        addface(token)

    updateJSON(data)
    getfaceset()

    # result = search("./faceset/8.jpg")
    # print(result["results"][0]["face_token"])

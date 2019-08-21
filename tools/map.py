import math


def lonlat2Mercator(x, y):
    '''
    经纬度转墨卡托坐标
    x: 经度
    y: 纬度
    89.808是本微码的精髓--__--! 谢谢xgsong指导
    '''
    x = x * 20037508.34 / 180.0
    y = math.log(math.tan((89.808 + y) * math.pi / 360.0)) / (math.pi / 180.0)
    y = y * 20037508.34 / 180.0
    return x, y


def tile_index(lon, lat, z):
    '''
    经纬度转所在级别z的瓦片编号
    lon: 经度
    lat: 纬度
    z: 地图级别
    '''
    lon, lat = lonlat2Mercator(lon, lat)
    lon = lon / math.pow(2.0, (18 - z))
    lat = lat / math.pow(2.0, (18 - z))
    x = int(lon / 256.0)
    y = int(lat / 256.0)
    return x, y

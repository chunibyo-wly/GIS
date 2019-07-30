# GIS
mapgis

### API
1. register_ajax
```angular2
request
{
    "usr": "123",
    "pwd": "123",
    "email": "XXXXXX@XXX",
}
```

```
response
{
    "status": "Y",
    "message": "注册成功"
}
```

2. login_ajax
```
request
{
    "usr": "123",
    "pwd": "123",
}
```

```
response
{
    "status": "N",
    "message": "请检查用户名和密码",
}
```

3. get_usrid_ajax
```angular2
request
{
    
}
```

```
response
{
    "id": "15",
}
```

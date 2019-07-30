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

4. get_messageRecords_ajax
```angular2
request
{
    "p1_id": "15",
    "p2_id": "16",
}
```

```
response(ordered by message_time)
{
   "data":  [
        {
            "message_from": "15",
            "message_content": "我是15",
        } ,
         {
            "message_from": "16",
            "message_content": "我是16",
        } ,
        {
            "message_from": "15",
            "message_content": "我是15",
        } 
    ]
}
```

5. send_message
```angular2
request
{
    "message_from": 15,
    "message_to": 16,
    "content": "你好"
}
```

```
response
{
    "status": "Y",
}
```
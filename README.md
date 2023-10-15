# Notes Backend  
CRUD backend for Notes application. It uses `Nodejs` and `express` for HTTP API and `Mongodb` as storage.  
It uses port 3000 upon start.

# Environment variables

|name|description|  
|:---------:|:------------------------------------------------------:|  
MONGO_URL|Mongodb URL
CORS_ALLOWED_ORIGINS|Allow CORS origins for browsers

# API

Endpoints  

|method|path|description|    
|:----:|:--:|:---------:|
|POST|/notes|create note|
|GET|/notes/:id|get note|
|GET|/notes|list notes|
|DELETE|/notes/:id|delete note|
|PUT|/notes/:id|update note|

## Create note

Example request  
```http
POST /notes HTTP/1.1
Content-Type: application/json
Authorization: Bearer <token>

{
  "author": "test_user",
  "title": "Test topic",
  "text": "Some long content. Can be more than one sentence.",
  "tags": ["test", "documentation"]
}
```

Example response    
TBD

## Get note  

Example request  
```http
GET /notes/62b0a024c3151f3937ec92a7 HTTP/1.1
Authorization: Bearer <token>
```

Example response  
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "62b0a024c3151f3937ec92a7",
  "author": "test_user",
  "createdAt": 1655742500032,
  "updatedAt": 1655742500042,
  "title": "Test topic",
  "text": "Some long content. Can be more than one sentence.",
  "tags": ["test", "documentation"]
}
```

## Delete note  

Example request  
```http
DELETE /notes/62b0a024c3151f3937ec92a7 HTTP/1.1
Authorization: Bearer <token>
```

Example response  
```http
HTTP/1.1 200 OK
```

## Update note  

Example request  
```http
PUT /notes/62b0a024c3151f3937ec92a7 HTTP/1.1
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Updated test topic",
}
```

Example response  
```http
HTTP/1.1 200 OK
```

## List notes  

Example request  
```http
GET /notes HTTP/1.1
Authorization: Bearer <token>
```

Example response  
```http
HTTP/1.1 200 OK
Content-Type: application/json

[{
  "id": "62b0a024c3151f3937ec92a7",
  "author": "test_user",
  "createdAt": 1655742500032,
  "updatedAt": 1655742500052,
  "title": "Updated test topic",
  "text": "Some long content. Can be more than one sentence.",
  "tags": ["test", "documentation"]
},
{
  "id": "62b0a024c3151f3937ec92a8",
  "author": "test_user",
  "createdAt": 1655742500072,
  "updatedAt": 1655742500092,
  "title": "Another test topic",
  "text": "Another content.",
  "tags": ["test", "documentation"]
}]
```

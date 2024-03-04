# Notes Backend

CRUD backend for Notes application. It uses `Nodejs` and `express` for HTTP API and `Mongodb` as storage.  
It uses port 3000 upon start.

# Environment variables

| Name                 | Description                     |
| -------------------- | ------------------------------- |
| MONGO_URL            | Mongodb URL                     |
| CORS_ALLOWED_ORIGINS | Allow CORS origins for browsers |

# API

Endpoints

| Method | Path       | Description                                                                             | Protected |
| ------ | ---------- | --------------------------------------------------------------------------------------- | --------- |
| GET    | /ping      | health check                                                                            | no        |
| POST   | /notes     | [create note](https://github.com/tayapro/notes-backend/blob/main/README.md#create-note) | yes       |
| GET    | /notes/:id | [get note](https://github.com/tayapro/notes-backend/blob/main/README.md#get-note)       | yes       |
| DELETE | /notes/:id | [delete note](https://github.com/tayapro/notes-backend/blob/main/README.md#delete-note) | yes       |
| PUT    | /notes/:id | [update note](https://github.com/tayapro/notes-backend/blob/main/README.md#update-note) | yes       |
| GET    | /notes     | [list notes](https://github.com/tayapro/notes-backend/blob/main/README.md#list-notes)   | yes       |

## Create note

Example request

```http
POST /notes HTTP/1.1
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Test topic",
  "text": "Some long content. Can be more than one sentence.",
  "tags": ["test", "documentation"]
}
```

Example response

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "65e5fb4cb353e5f69dfd231b",
  "createdAt": 1709570892538,
  "updatedAt": 1709570892538,
  "title": "Test topic",
  "text": "Some long content. Can be more than one sentence.",
  "tags": ["test", "documentation"]
}
```

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
HTTP/1.1 204 OK
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
Content-Type: application/json

{
  "id": "65e5fb4cb353e5f69dfd231b",
  "createdAt": 1709570892538,
  "updatedAt": 1709571310597,
  "title": "Updated test topic",
  "text": "Some long content. Can be more than one sentence.",
  "tags": ["test", "documentation"]
}
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
  "createdAt": 1655742500032,
  "updatedAt": 1655742500052,
  "title": "Updated test topic",
  "text": "Some long content. Can be more than one sentence.",
  "tags": ["test", "documentation"]
},
{
  "id": "62b0a024c3151f3937ec92a8",
  "createdAt": 1655742500072,
  "updatedAt": 1655742500092,
  "title": "Another test topic",
  "text": "Another content.",
  "tags": ["test", "documentation"]
}]
```

# CHANGELOG

## v0.0.1-alpha

-   [x] No changes, compatibility tag

## v0.0.2-alpha

-   [x] APIs which do not have any content in response should return `HTTP 204` upon success
-   [x] Fix documentation: create note API returns JSON, not plain text
-   [x] Change axios `then` promise handling to top-level `await` when requesting public key from `notes-id`
-   [x] Migrate to `ES6` modules

# Known issues

-   [ ] Currently request public JWKS once upon start. It must do it periodically.

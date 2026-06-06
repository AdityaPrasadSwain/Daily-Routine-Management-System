# DRMS API Documentation

Base URL: `http://localhost:8080/api`

## Authentication
| Method | Endpoint | Description | Request Body | Response |
|SQ|---|---|---|---|
| POST | `/auth/register` | Register new user | `{ "email": "...", "password": "..." }` | `{ "token": "...", "type": "Bearer", ... }` |
| POST | `/auth/login` | Login user | `{ "email": "...", "password": "..." }` | `{ "token": "...", "type": "Bearer", ... }` |
| POST | `/auth/forgot-password` | Request password reset | `{ "email": "..." }` | String message |
| POST | `/auth/reset-password` | Reset password | `{ "email": "...", "newPassword": "..." }` | String message |

## Tasks
**Headers**: `Authorization: Bearer <token>`

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| GET | `/tasks` | Get all tasks for user | - | `[ { "id": 1, "title": "...", ... } ]` |
| POST | `/tasks` | Create new task | `{ "title": "...", "dueDate": "..." }` | Created Task object |
| PUT | `/tasks/{id}` | Update task | `{ "title": "...", "status": "..." }` | Updated Task object |
| DELETE | `/tasks/{id}` | Delete task | - | 204 No Content |
| GET | `/tasks/history` | Get task history | - | List of tasks |
| POST | `/tasks/{id}/reschedule` | Reschedule task | `{ "dueDate": "..." }` | Updated Task object |
| PATCH | `/tasks/{id}/focus` | Update focus stats | - | Updated Task object |

## Routines
**Headers**: `Authorization: Bearer <token>`

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| GET | `/routines` | Get all routines | - | List of routines |
| POST | `/routines` | Create routine | `{ "title": "...", "description": "..." }` | Created Routine |

## Reviews
**Headers**: `Authorization: Bearer <token>`

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| GET | `/reviews/task/{taskId}` | Get review for task | - | Review object |
| POST | `/reviews` | Submit review | `{ "taskId": 1, "rating": 5, "notes": "..." }` | String message |

## Analytics & AI
**Headers**: `Authorization: Bearer <token>`

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| GET | `/analytics/dashboard` | Get dashboard stats | - | `{ "totalTasks": 15, ... }` |
| GET | `/ai/suggestions` | Get AI suggestions | - | `{ "suggestions": "..." }` |
| GET | `/ai/insight` | Get AI insights | - | `{ "insight": "..." }` |

## Alarms
**Headers**: `Authorization: Bearer <token>`

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| POST | `/alarms/upload` | Upload alarm sound | `MultipartFile` | Success message |

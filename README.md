# **Test Task application!!!**

---

## Welcome route

- [Website Link](https://task-manager-js-encoder.vercel.app)

---

## Common routes

### Registration (post route)

- /v1/common/registration [Link](https://task-manager-js-encoder.vercel.app/api/v1/common/registration)
- Need **name, email, phonNumber, password** from **req.body**

### Login (get route)

- /v1/common/login [Link](https://task-manager-js-encoder.vercel.app/api/v1/common/login)
- Need **email, password** from **req.body**

---

## Public routes

#### Need (must be a user) **jwt** from **req.headers.authorization. You can get jwt token by login**

### Create task (post route)

- /v1/public/create-task [Link](https://task-manager-js-encoder.vercel.app/api/v1/public/create-task)
- Need **title, description, dueDate, status, assignUsersId** from **req.body**
- **status** must be **progress** or **completed** or **pending**
- **assignUsersId** must be a valid User \_id.

### Update task by task creator (patch route)

- /v1/public/update-task [Link](https://task-manager-js-encoder.vercel.app/api/v1/public/update-task)

- Need **taskId** from **req.query**
- Need **title, description, dueDate, status, assignUsersId** from **req.body**
- **status** must be **progress** or **completed** or **pending**

### Delete task (delete route)

- /v1/public/delete-task [Link](https://task-manager-js-encoder.vercel.app/api/v1/public/delete-task)

- Need **taskId** from **req.query**

### Filter task (get route)

- /v1/public/filter-task [Link](https://task-manager-js-encoder.vercel.app/api/v1/public/filter-task)

- Need **dueDate, status, assignUsersId** from **req.query**

### Sort task (get route)

- /v1/public/sort-task [Link](https://task-manager-js-encoder.vercel.app/api/v1/public/sort-task)

- Need **sortby, order** from **req.query**
- **order = desc** (if you want to sort in reverse order)

### Notification for task (get route)

- /v1/public/notification [Link](https://task-manager-js-encoder.vercel.app/api/v1/public/notification)

### Update task status by assigned user (patch route)

- /v1/public/update-task-status [Link](https://task-manager-js-encoder.vercel.app/api/v1/public/update-task-status)

- Need **status, taskId** from **req.query**
- **status** must be **progress** or **completed** or **pending**

# COP290-ASSIGNMENT 2

A robust backend service for managing projects, Kanban boards, tasks, and real-time notifications. This API features JWT-based authentication, role-based access control (Admin/Viewer), and task tracking.

### Prerequisites
* **MongoDB** (Local instance or Atlas Cluster)
* **npm** 

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/lakshit001-cell/COP290ass2.git
   ```

2. **Install dependencies: for server and frontend**
   ```bash
   npm install
   cd server-side
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the `server-side` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/kanban_db
   ACCESS_TOKEN_SECRET=access_secret
   REFRESH_TOKEN_SECRET=refresh_secret
   ```

4. **Run the Project:**
   ```bash
   //in /root
   npm run dev
   //in another terminal(in /server-side )
   npm run dev
   ```

---

## API Documentation

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| POST | `/register` | Register a new user | No |
| POST | `/login` | Login and receive tokens | No |
| POST | `/refresh` | Refresh expired access token | No |
| POST | `/profile-save` | Update user profile | JWT |
| POST | `/logout` | Invalidate session | No |

### 2. Projects (`/api/projects`)
| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| POST | `/new-project` | Create a new project | Admin |
| GET | `/user-projects` | Get all projects for current user | JWT |
| GET | `/completed` | Get archived/completed projects | JWT |
| GET | `/:id` | Get specific project details | JWT |
| PUT | `/:id` | Update project settings | JWT |
| POST | `/:id/members/add` | Add member to project | JWT |
| DELETE | `/:id/members/remove`| Remove member from project | JWT |

### 3. Boards & Columns (`/api/boards`)
| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| POST | `/create` | Create a new board in a project | JWT |
| GET | `/project/:id` | Get all boards for a project | JWT |
| PUT | `/:boardId/columns` | Update column names/WIP limits | JWT |

### 4. Tasks (`/api/tasks`)
| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| GET | `/tasks/my` | Get tasks assigned to me | JWT |
| POST | `/create/:boardId` | Create task in specific board | JWT |
| GET | `/board/:boardId` | Get all tasks for a board | JWT |
| GET | `/:taskId` | Get specific task details | JWT |
| PATCH| `/update/:taskId` | Edit task (Priority, Story, etc) | JWT |
| PATCH| `/:taskId/move` | Move task between columns | JWT |

### 5. Comments (`/api/comments`)
| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| POST | `/:taskId` | Post a comment (supports @mentions) | JWT |
| GET | `/:taskId` | Get all comments for a task | JWT |
| DELETE | `/:commentId` | Delete a specific comment | JWT |

### 6. Notifications (`/api/notifications`)
| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| GET | `/` | Fetch user notifications | JWT |
| DELETE | `/clear` | Clear all notifications | JWT |
| DELETE | `/:notiId` | Delete a specific notification | JWT |

---

## Security & Middleware
* **TokenAuthenticate:** Verifies the `Authorization: Bearer <token>` header.
* **CORS:** To connect frontend to backend `server.js`.




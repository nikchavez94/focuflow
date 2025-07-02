# FocusFlow – A Visual Task Manager

![FocusFlow Banner](https://via.placeholder.com/1200x400/3D4059/FFFFFF?text=FocusFlow)
_(Replace this placeholder with a screenshot of your app later!)_

> A modern, visually-driven task manager designed to boost productivity and bring clarity to personal and team-based workflows.

---

## 📌 About The Project

FocusFlow is more than just a to-do list; it's a comprehensive visual workspace designed to bring clarity, motivation, and seamless collaboration to your personal and professional projects. In a world of digital distractions, FocusFlow helps users regain control by combining an intuitive Kanban-style workflow with powerful planning tools and motivational features.

This application is built as a modern Single-Page Application (SPA) to ensure a fast, responsive, and seamless user experience. The frontend is powered by React, while the backend is a robust REST API built with Flask (Python), creating a full-stack solution that is both powerful and scalable.

The core purpose of FocusFlow is to make productivity feel less like a chore and more like an engaging, rewarding process.

### ✨ Key Features

🧩 **Dynamic Task & Project Management**

- **Kanban Board:** A fully interactive board with smooth drag-and-drop functionality for managing tasks between columns (e.g., To-Do, In Progress, Done).
- **Detailed Task Cards:** Each task can include a title, rich-text description, due date, priority level, and color-coded labels.
- **Sub-task Checklists:** Break down complex tasks into smaller, manageable steps to better track progress.
- **Task Dependencies & Recurring Tasks:** Plan complex workflows by setting prerequisites and automate routine tasks. _(Future Goal)_

🗂️ **Seamless Organization**

- **Project Boards:** Isolate and manage tasks for different projects, clients, or areas of life.
- **Tags & Filters:** Use tags and powerful saved filters (e.g., "Due Today," "High Priority") to instantly find the tasks that need your attention.

📅 **Integrated Calendar View**

- **Visual Planning:** View all your tasks with due dates on a clean monthly or weekly calendar.
- **Drag-to-Reschedule:** Easily adjust deadlines by simply dragging a task to a new date on the calendar.

📈 **Productivity & Motivation**

- **Progress Tracking:** Visualize your success with project-level and task-level progress bars.
- **Daily Check-in & Streak Tracking:** Start your day with intention using a "Goals for Today" modal and build momentum by tracking your daily task completion streak.
- **Personalization:** Tailor your workspace with light/dark modes and custom board themes.

👥 **Collaboration (Phase 2)**

- **Shared Boards:** Invite team members to collaborate on projects with specific permissions.
- **Task Assignments & Comments:** Assign tasks to others, leave comments, and use @mentions to communicate directly within the context of a task.

### 🛠️ Built With

This project showcases a modern full-stack architecture:

- **Frontend:**
  - [React (with TypeScript)](https://reactjs.org/)
  - [React Router](https://reactrouter.com/) for client-side routing
  - State Management: Context API / Redux
  - Styling: (e.g., Styled Components, Tailwind CSS)
- **Backend:**
  - [Flask (Python)](https://flask.palletsprojects.com/)
  - RESTful API architecture
- **Database:**
  - [Firestore (Google Cloud)](https://firebase.google.com/docs/firestore) or [MongoDB](https://www.mongodb.com/)
- **Deployment:**
  - Frontend: [Vercel](https://vercel.com/)
  - Backend: [Render](https://render.com/) / [Railway](https://railway.app/)
- **Version Control:**

  - [Git](https://git-scm.com/) & [GitHub](https://github.com/)


  #### 🧩 User Story: Creating & Managing Tasks on the Kanban Board

**As a** logged-in user,  
**I want to** create, edit, and manage tasks within a drag-and-drop Kanban board,  
**So that** I can visually organize and track progress across my projects.

---

**Scenario Example:**

Angela logs into FocusFlow and sees her Projects Dashboard. She selects a project called “Client Website Redesign,” which opens a Kanban board with columns labeled To Do, In Progress, and Done.

She clicks “+ Add Task” in the “To Do” column and enters:

- Title: “Create wireframes”
- Description: “Use Figma to mock homepage layout”
- Due Date: In 3 days
- Priority: High
- Subtasks:
  - Draft homepage wireframe
  - Get feedback from client
  - Revise design

Angela drags the task between columns as she makes progress, and a progress bar updates as subtasks are completed.

---

**✅ Acceptance Criteria:**

- User can create, update, and delete tasks.
- Tasks are organized into Kanban columns based on status.
- Tasks display title, due date, and priority tag.
- Tasks are draggable between columns (via react-beautiful-dnd).
- Subtasks are checkable and reflected in a progress indicator.
- Project progress updates based on completed tasks.

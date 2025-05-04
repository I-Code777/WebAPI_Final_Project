# WebAPI_Final_Project
This repository is used for my Web API final project. Parts of this project has taken code segments of previous assignments to base on, and online resources in my research to build this project.

## Outline of Project
Project Name: Task Management Tool
Members: Jessica Nguyen

### Tools Used
-MongoDB Atlas (web browser based platform)
-Render
-GitHub
-CodeSandbox REACT app template (web browswer based platform)
-Postman
Notice: Most of the tools I use are mainly web browser based since my laptop struggles with any downloaded applications.

### High-Level Concept:
A task management application that allows users to create, categorize, and track their tasks efficiently. The tool will provide user authentication, task prioritization, and notifications for overdue tasks, ensuring better productivity and organization. This project base has been taken from Chapter 22 of the provided textbook.

To enhance the functionality, I will be adding a task-sharing feature. Users will be able to share tasks with other users, allowing them to view, edit, and update shared tasks collaboratively.

### API:
The API will handle user authentication and task management functionalities. Users will be able to perform CRUD (Create, Read, Update, Delete) operations on tasks, assign categories or labels, and set due dates. The API will include:

-User authentication (registration and login)
-Task creation and management (including updating task details)
-Due date tracking with notifications for overdue tasks
-Task sharing: Users can share tasks with other registered users, granting them permission to view and edit tasks. Shared users will be stored in the database, and access can be revoked by the task owner.
-API endpoints for retrieving user-specific tasks, including tasks shared with them

### Front End:
The front end will feature a Kanban-style board using libraries like react-beautiful-dnd to allow users to organize their tasks by dragging and dropping them into different categories (e.g., To-Do, In Progress, Completed). The interface will include:

-A task creation form with fields for name, description, due date, and priority
-A drag-and-drop task organization system for intuitive task management
-A notification system to alert users of overdue tasks
-A user authentication system (login/logout)
-A task-sharing interface, allowing users to share tasks with others and view/edit tasks that have been shared with them

### Database:
The database will consist of two main collections:

-Users Collection – Stores user authentication details, including email, hashed password, and profile information.
-Tasks Collection – Stores user-specific and shared tasks with attributes such as:
-Task title and description
-Due date and priority level
-Task status (To-Do, In Progress, Completed)
-Labels or categories assigned to tasks
-Notifications for overdue tasks
-Shared users – A list of user IDs that have access to the task


## Links to Eternal Sources
REACT App (powered by CodeSandBox): https://codesandbox.io/p/sandbox/stoic-sound-5kn7fk?file=%2Fsrc%2Findex.js%3A10%2C46

REACT App GitHub Repository: https://github.com/I-Code777/WebAPI_Final_REACT

Postman: [<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/41738051-7a7f71fd-afcb-44c9-9173-5518a9ad0d00?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D41738051-7a7f71fd-afcb-44c9-9173-5518a9ad0d00%26entityType%3Dcollection%26workspaceId%3Da4250de4-ab16-4e10-864c-e1bf56c53dd0)

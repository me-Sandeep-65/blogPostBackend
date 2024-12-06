# **RBAC Authentication & Authorization System with Google OAuth**

This project is a comprehensive implementation of **Authentication**, **Authorization**, and **Role-Based Access Control (RBAC)** mechanisms, created as part of an internship assignment for **VRV Security**. The goal of this system is to provide secure access control based on user roles and integrate **Google OAuth** for authentication, ensuring a seamless and secure experience for users while protecting sensitive resources.

# Application Overview

This project is a web application built to manage user roles and permissions using Role-Based Access Control (RBAC). The application allows users to register, log in, and perform different actions based on their assigned roles (Member, Moderator, Admin). Each role has specific permissions for interacting with posts and managing other users. 

#### Demo Link:
You can try the live demo of the application here:

[Demo Link](https://blog-post-frontend-theta.vercel.app/)


Table of Contents
-----------------

*   [Features](#features)
    - [Authentication](#authentication)
    - [Authorizarion (RBAC)](#authorization)
    - [Security Best Practices](#security-best-practices)
    - [API Endpoints](#api-endpoints)
    
*   [Technologies Used](#technologies-used)

*   [Frontend Overview](#frontend-overview)
    
*   [Installation and Setup](#installation-and-setup)
    - [Prerequisites](#prerequisites)
    - [Setup Instructructions](#setup-instructions)
    - [Test and Setup](#test-and-setup)
    
*   [Future Enhancements](#future-enhancement)
    
## **Features**

### 1. **Authentication**
   - **User Registration**: Users can register with their credentials, including a secure password.
   - **Google OAuth Authentication**: Users can log in using their Google account, simplifying authentication with OAuth.
   - **Password Hashing**: User passwords are securely stored using bcrypt for hashing.
   - **JWT Token-based Authentication**: After successful login, the system generates a **JWT token** for session management, ensuring secure, stateless user sessions.
   - **Logout**: Secure logout functionality to terminate user sessions.

### 2. **Authorization & RBAC (Role-Based Access Control)**
   - **User Roles**: Implemented roles such as **Admin**, **User**, and **Moderator**. 
     - **Admin**: Full access to all resources, including user management.
     - **Member**: Restricted access, mainly for viewing and interacting with their own data.
     - **Moderator**: Can moderate and manage specific content and resources.
   - **Role-based Permissions**: Each role has defined access to specific routes or actions based on their permissions.
   - **Protected Routes**: Routes are protected using role-based access control, ensuring that only authorized users can access them.
   - **More Precise access control**: Here is the more prices access control Table that gives the whole idea of the project and its flow.
   
        | **Permission**                          | **Member** | **Moderator** | **Admin** |
        |-----------------------------------------|------------|---------------|-----------|
        | **View all posts**                      | ✅         | ✅            | ✅        |
        | **Create a post**                       | ✅         | ✅            | ✅        |
        | **Delete their own post**               | ✅         | ✅            | ✅        |
        | **Report a post**                       | ✅         | ✅            | ✅        |
        | **See reported posts**                  | ❌         | ✅            | ✅        |
        | **Review and unreport a post**          | ❌         | ✅            | ✅        |
        | **Block a member from creating posts**  | ❌         | ✅            | ✅        |
        | **Delete a member's post content**      | ❌         | ✅            | ✅        |
        | **Unblock a blocked member**            | ❌         | ✅            | ✅        |
        | **Make a moderator**                    | ❌         | ❌            | ✅        |
        | **Remove a moderator**                  | ❌         | ❌            | ✅        |


### 3. **Security Best Practices**
   - **OAuth Authentication**: Google OAuth integration to provide a more secure and easier login process.
   - **Password Security**: User passwords are securely hashed and not stored in plaintext.
   - **JWT Tokens**: JWT tokens are used to manage user authentication and authorization without relying on sessions.
   - **Environment Variables**: Sensitive information such as OAuth credentials and JWT secrets are securely stored in environment variables.

### 4. **API Endpoints**
- **Member Routes**

    | **HTTP Method** | **Route**             | **Description**                                                       |
    |-----------------|-----------------------|-----------------------------------------------------------------------|
    | GET             | `/getuserdata`         | Retrieve the user data.                                               |
    | GET             | `/posts`               | Get all posts, populating the user information (name, image).         |
    | GET             | `/my-posts`            | Get posts created by the logged-in user.                              |
    | POST            | `/new-post`            | Create a new post for the logged-in user.                             |
    | POST            | `/delete-post`         | Delete a post created by the logged-in user.                          |
    | POST            | `/report-post`         | Report a post as inappropriate.                                       |

- **Moderator Routes**

    | **HTTP Method** | **Route**               | **Description**                                                                 |
    |-----------------|-------------------------|---------------------------------------------------------------------------------|
    | GET             | `/reported-posts`        | Retrieve all posts that have been reported for violations.                      |
    | POST            | `/unreport-post`         | Unreport a post, marking it as not reported anymore.                            |
    | GET             | `/blocked-users`         | Get a list of all users who have been blocked.                                  |
    | POST            | `/block-user`            | Block a user, changing their role to `blocked`.                                 |
    | POST            | `/unblock-user`          | Unblock a user, reverting their role to `member`.                               |
    | POST            | `/delete-post`           | Delete a post either by the user who created it or by a moderator (or admin).    |


- **Admin Routes**

    | **HTTP Method** | **Route**                | **Description**                                                            |
    |-----------------|--------------------------|----------------------------------------------------------------------------|
    | GET             | `/moderators`             | Retrieve a list of all users with the role `moderator`.                    |
    | POST            | `/add-moderator`          | Add a user as a moderator by updating their role to `moderator`.            |
    | POST            | `/remove-moderator`       | Remove a user from the `moderator` role, reverting their role to `member`.  |


## Technologies Used

- **Backend**: 
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - JWT (JSON Web Tokens) for Authentication
  - Bcrypt for Password Hashing
- **Authentication**: 
  - Passport.js (for local and OAuth Authentication)
  - Google OAuth 2.0
- **Role-Based Access Control**:
  - Custom RBAC System based on user roles (Admin, Moderator, Member)
- **Development Tools**:
  - Nodemon (for automatic server restarts in development)
  - Postman (for API testing)
  - Git & GitHub (for version control)

  
## Frontend Overview

The frontend of the application is built using **React** with a focus on a modern, responsive, and state-of-the-art user interface. It utilizes a variety of tools and libraries to ensure an optimal user experience and efficient state management. The key technologies and libraries used include:

- **React**: The core library used to build the user interface.
- **Tailwind CSS**: A utility-first CSS framework to create custom, responsive designs quickly.
- **Recoil**: A state management library for React to manage global state in a simpler and more efficient way.
- **React Router**: Used for navigating between different views and components in the application.
- **Axios**: For making HTTP requests to the backend API.
- **JWT**: JSON Web Token for authenticating users and managing sessions.
- **React Hook Form**: For handling forms and validation easily.

The frontend communicates with the backend through RESTful API calls, providing seamless user interaction.



## Installation and Setup

This section outlines the prerequisites and the steps required to set up and run the project locally.


### **Prerequisites**

Before setting up the project, make sure you have the following installed on your system:

- **Node.js**
- **npm**
- **MongoDB**
- **Git** (optional)
- **Google Cloud Project** (optional, for OAuth integration)


### **Setup Instructions**

##### Step 1: Backend Setup
```
https://github.com/me-Sandeep-65/blogPostBackend.git
cd blogPostBackend
npm install

# Setup environment Variables

npm run dev
```
##### Step 2: Frontend Setup
```
https://github.com/me-Sandeep-65/blogPostFrontend.git
cd blogPostFrontend
npm install

# Setup environment Variables

npm run dev
```
### Test the Setup
- Open your browser and visit http://localhost:5173/ (frontend) to ensure the frontend loads properly.
- Check the backend at http://localhost:8000/ to confirm the server is running.




## Future Enhancements

- **Improved Role Management**: Implement more granular roles (e.g., Super Moderator, Content Creator).
- **Advanced Search Functionality**: Implement search and filtering for posts.
- **Email Notifications**: Send email notifications when certain actions occur, such as new posts, comments, or reports.
- **Rate Limiting**: Implement rate limiting to prevent abuse of the API.

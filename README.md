# Full-Stack E-Commerce Platform

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

A complete, end-to-end e-commerce application built from the ground up, featuring a modern technology stack and a full suite of user and product management features.

**Live Demo:** [**https://storied-rolypoly-c9f33c.netlify.app/**](https://storied-rolypoly-c9f33c.netlify.app/)

## Project Overview

This project is a comprehensive demonstration of full-stack web development principles. It includes a secure RESTful API backend, a dynamic and interactive React frontend, and a robust PostgreSQL database. The entire application is designed to be scalable, secure, and ready for production, with a full deployment pipeline configured on Supabase, Render, and Netlify.

## Features

-   **User Authentication:** Secure user registration and login with password hashing (`bcrypt`) and JSON Web Token (JWT) authorization.
-   **Product Catalog:** Users can browse a complete list of products fetched from the database.
-   **Shopping Cart:** A fully functional, client-side shopping cart with global state management via React Context.
-   **Secure Checkout:** A protected checkout process that creates permanent order records in the database using safe transactions.
-   **Order History:** Logged-in users can view a complete history of their past orders.
-   **Protected Routes:** User-specific pages like Profile and Order History are protected and only accessible to authenticated users.
-   **RESTful API:** A well-structured backend API for managing products, users, and orders.

## Technology Stack

### Frontend
-   **React 18:** A modern library for building user interfaces.
-   **Vite:** A lightning-fast frontend build tool.
-   **React Router:** For client-side routing and navigation between pages.
-   **React Context:** For global state management (Authentication and Shopping Cart).
-   **`fetch` API:** For communicating with the backend REST API.

### Backend
-   **Node.js:** A JavaScript runtime for the server.
-   **Express.js:** A minimal and flexible web application framework for Node.js.
-   **PostgreSQL:** The world's most advanced open-source relational database.
-   **`node-postgres` (pg):** The official PostgreSQL client for Node.js.
-   **`jsonwebtoken` (JWT):** For creating and verifying authentication tokens.
-   **`bcrypt`:** For securely hashing user passwords.
-   **`cors`:** For enabling Cross-Origin Resource Sharing.

### Database & Deployment
-   **Database:** Hosted on **Supabase**.
-   **Backend:** Deployed as a Web Service on **Render**.
-   **Frontend:** Deployed as a static site on **Netlify**.
-   **Version Control:** **Git** and **GitHub**.

## Getting Started (Local Setup)

To get a local copy of this project up and running, follow these simple steps.

### Prerequisites

You will need the following software installed on your machine:
-   [Node.js](https://nodejs.org/) (which includes npm)
-   [PostgreSQL](https://www.postgresql.org/download/)
-   [Git](https://git-scm.com/downloads)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/[YOUR_GITHUB_USERNAME]/[YOUR_REPO_NAME].git
    cd [YOUR_REPO_NAME]
    ```

2.  **Setup the Backend:**
    -   Navigate to the backend directory:
        ```sh
        cd backend
        ```
    -   Install NPM packages:
        ```sh
        npm install
        ```
    -   Create a local `.env` file in the `backend` directory and add the following variables:
        ```env
        # .env (backend)
        DATABASE_URL=postgresql://[YOUR_DB_USER]:[YOUR_DB_PASSWORD]@localhost:5432/[YOUR_DB_NAME]
        JWT_SECRET=your_super_secret_key_that_is_long_and_random
        ```
        *(Make sure to create a local PostgreSQL database and user to match these credentials.)*

3.  **Setup the Frontend:**
    -   Navigate to the frontend directory from the root folder:
        ```sh
        cd frontend
        ```
    -   Install NPM packages:
        ```sh
        npm install
        ```
    -   Create a local `.env` file in the `frontend` directory and add the following variable:
        ```env
        # .env (frontend)
        VITE_API_BASE_URL=http://localhost:5000
        ```

4.  **Run the Application:**
    -   **Start the Backend Server:** In the `backend` directory, run:
        ```sh
        npm run dev
        ```
        *The API will be running on `http://localhost:5000`.*
    -   **Start the Frontend Server:** In a separate terminal, in the `frontend` directory, run:
        ```sh
        npm run dev
        ```
        *The React app will be accessible at `http://localhost:5173`.*

## API Endpoints

| Method | Endpoint                  | Description                     | Protected |
|--------|---------------------------|---------------------------------|-----------|
| `GET`    | `/api/products`           | Get all products                | No        |
| `GET`    | `/api/products/:id`       | Get a single product by ID      | No        |
| `POST`   | `/api/users/register`     | Register a new user             | No        |
| `POST`   | `/api/users/login`        | Log in a user                   | No        |
| `GET`    | `/api/profile`            | Get logged-in user's profile    | Yes       |
| `POST`   | `/api/orders`             | Create a new order              | Yes       |
| `GET`    | `/api/orders/my-orders`   | Get logged-in user's orders     | Yes       |

---

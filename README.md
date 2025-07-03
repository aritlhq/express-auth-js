# Express.js Authentication with JWT & Prisma

A robust starter template for building secure web applications with Node.js, Express.js, and Prisma. This project provides a complete, ready-to-use authentication system including user registration, login, logout, and protected routes using JSON Web Tokens (JWT) stored in httpOnly cookies.

## ✨ Features

- Secure User Authentication: Full-featured register, login, and logout functionality.
- JWT in Cookies: Uses JSON Web Tokens (JWT) stored in secure, httpOnly cookies for session management.
- Password Hashing: Protects user passwords using bcrypt.
- Input Validation: Employs Joi for server-side validation to ensure data integrity.
- Protected Routes: Includes middleware to restrict access to authenticated users only.
- Database ORM: Leverages Prisma for type-safe database access with a MySQL backend.
- Server-Side Rendering: Uses EJS for dynamic HTML rendering.
- MVC-like Structure: Organized code with controllers, routes, middleware, and views for maintainability.

I also added a few additional branches with different features according to their names:
- [with-roles](https://github.com/aritlhq/express-auth-js/tree/with-roles)
- [todo-list](https://github.com/aritlhq/express-auth-js/tree/todo-list)
- [pw-reset-link](https://github.com/aritlhq/express-auth-js/tree/pw-reset-link)

## 🛠️ Tech Stack

- Backend: Node.js, Express.js
- Database: MySQL, Prisma (ORM)
- Authentication: jsonwebtoken, bcrypt
- Templating: EJS
- Validation: Joi
- Development: Nodemon

## 📂 Project Structure
```shell
# Branch: master

express-auth-js/
├── .env-example
├── package.json
├── server.js
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│       └── ...
└── src/
    ├── controllers/
    │   ├── authController.js
    │   └── pageController.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── routes/
    │   ├── authRoutes.js
    │   └── pageRoutes.js
    └── views/
        ├── dashboard.ejs
        ├── index.ejs
        ├── login.ejs
        ├── register.ejs
        └── partials/
            ├── footer.ejs
            └── header.ejs
```

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

Prerequisites

- Node.js (v16 or higher)
- npm
- A running MySQL database instance

Installation & Setup

Clone the repository:
```shell
Generated bash
git clone https://github.com/aritlhq/express-auth-js.git
cd express-auth-js
```

Install dependencies:
```shell
npm install
```

Set up environment variables:
Create a `.env` file by copying the example file:

```bash
cp .env-example .env
```

Now, open the `.env` file and update the variables:

```dotenv
# Your MySQL database connection string
DATABASE_URL="mysql://user:password@localhost:3306/express_auth"

# Port for the server to run on
PORT=3032

# A long, random, and secret string for signing JWTs
JWT_SECRET="your-super-secret-key-that-is-long-and-random"
```

Set up the database:

- Run the Prisma migration command to create the User table in your database based on the schema defined in `prisma/schema.prisma`.

```shell
npx prisma migrate dev
```

Run the application:
- Start the server in development mode with Nodemon.

```shell
npm run dev
```

The server will be running at http://localhost:3032 (or the port you configured).

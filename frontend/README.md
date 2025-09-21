## 🔖 Project Title & Description

**Title:** AI-Powered Habit Tracker

**Description:** This application is a full-stack habit tracking system that helps users build and maintain healthy routines.  It allows users to set daily habits (e.g., "Drink 8 glasses of water," "Read 30 minutes"), log their progress, and visualize their consistency. The unique value of this app lies in its **AI integration**: it analyzes a user's logged data over time to provide personalized insights, motivational messages, and intelligent suggestions for improving habit streaks.

**Target Audience:** Individuals looking to improve their daily routines, fitness enthusiasts, and students.

**Why it Matters:** This project demonstrates practical AI integration beyond a simple chat bot. It showcases a modern tech stack and the ability to build a data-driven, user-centric application that solves a real-world problem.

---

## 🛠️ Tech Stack

* **Frontend:** **Next.js** or **React**
* **Backend:** **Python** with **FastAPI** 🚀 (for a high-performance, asynchronous API)
* **Database:** **PostgreSQL** (a robust relational database)
* **Database ORM:** **SQLAlchemy** (to interact with the database using Python objects)
* **Data Validation:** **Pydantic** (integrated with FastAPI for automatic data validation)
* **AI Integration:** **Vercel AI SDK** or a similar library to call a language model.
* **Styling:** **Tailwind CSS** or a similar utility-first CSS framework.

---

## 🧠 AI Integration Strategy

AI will be a core part of the development and functionality of this project.

### Code Generation
We will use AI to scaffold key parts of the application.
* **Backend:** Prompt the AI to generate the **FastAPI application instance**, **Pydantic models** for request/response validation, and **SQLAlchemy models** for the database schema.
* **Frontend:** Ask the AI to create **React components** for habit logging and data visualization.

### Testing
AI will assist in ensuring the application is robust and bug-free.
* **Unit Tests:** We will prompt the AI to write unit tests for FastAPI endpoints using the **TestClient** from `fastapi.testclient` and **pytest**. For example, testing that a habit is successfully created or that a user receives a 401 Unauthorized response for a protected endpoint.
* **AI Function Test:** A specific test will be written to verify that the AI insight function returns a structured, non-empty response for valid user data.

### Documentation
AI will help us maintain clear and consistent documentation.
* **Inline Comments:** We will use AI to generate **docstrings** for all Python functions, explaining their purpose, parameters, and return values.
* **README:** The AI will be prompted to generate the initial project setup instructions and API endpoint documentation for the final `README.md`.

### Context-Aware Techniques
To ensure the AI provides accurate and relevant code, we will feed it specific context.
* **Schema Context:** When requesting API route logic, we will provide the AI with the **exact Pydantic models** and **SQLAlchemy schemas** to ensure it uses the correct field names and data types.
* **File Context:** Using in-IDE commands, we will feed the AI the content of an entire file (e.g., `#file src/pages/HabitDashboard.tsx`) to ask for a new feature or refactoring within that file's specific context.
* **API Specification:** We will maintain a simple API specification (e.g., in a text file) and provide it to the AI when generating new API route handlers, ensuring consistency across all endpoints.
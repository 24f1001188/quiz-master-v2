# Quiz Master v2 — Online Quiz Management System

A full-stack web application for managing and conducting online quizzes, featuring role-based access, quiz scheduling, RESTful APIs, and asynchronous background task processing.

## Overview

**Quiz Master v2** is a multi-user online examination platform developed to simplify quiz creation, management, and participation. The application provides separate workflows for administrators and regular users, enabling efficient quiz administration and an organized examination experience.

Built using Flask, Vue.js, SQLAlchemy, and SQLite, the application follows a client-server architecture in which REST APIs connect the frontend with backend services. Celery is integrated to support asynchronous background tasks.

The project demonstrates practical implementation of full-stack web development concepts, database management, authentication, API integration, and background job processing.

## Key Features

### Authentication and Authorization
- User authentication and account management.
- Role-based access control for administrators and regular users.
- Protected application routes and role-specific functionality.
- Password hashing and authentication support.

### Quiz Management
- Create and manage subjects and chapters.
- Organize quizzes by subject and chapter.
- Manage quiz questions, marks, duration, and scheduling.
- Maintain quiz-related information in a relational database.

### Online Quiz Attempt
- View available and upcoming quizzes.
- Attempt quizzes through an interactive user interface.
- Navigate through questions and save responses.
- Track quiz progress while attempting an examination.
- Use a countdown timer for timed quizzes.
- Submit answers and record quiz results.

### Performance Tracking
- Store quiz attempts and scores.
- View previous quiz attempts and results.
- Review individual quiz performance.
- Visualize performance information through summary charts.

### RESTful Backend
- Expose backend functionality through Flask REST APIs.
- Separate frontend presentation from backend business logic.
- Support communication between the Vue.js frontend and Flask backend.
- Validate API functionality using Postman.

### Asynchronous Background Processing
- Integrate Celery for background task execution.
- Support asynchronous tasks such as report generation and scheduled notifications.
- Separate background workloads from normal request-response processing.

### Interactive User Interface
- Build frontend components using Vue.js.
- Use HTML, CSS, and JavaScript to create an interactive interface.
- Provide separate user experiences for administrative and quiz-taking workflows.

## Technology Stack

| Category | Technologies |
|---|---|
| Programming Language | Python, JavaScript |
| Backend Framework | Flask |
| API Development | Flask-RESTful, REST APIs |
| Frontend | Vue.js, HTML5, CSS3, JavaScript |
| Database | SQLite, SQLAlchemy ORM |
| Authentication | Flask-Security, bcrypt |
| Background Processing | Celery, Redis |
| API Testing | Postman |
| Version Control | Git |

## System Architecture

Quiz Master v2 follows a **client-server architecture** with a dedicated frontend, backend API layer, relational database, and asynchronous task-processing component.

```text
                 ┌─────────────────────────┐
                 │       User Interface    │
                 │     Vue.js, HTML, CSS   │
                 └────────────┬────────────┘
                              │
                       HTTP / REST APIs
                              │
                 ┌────────────▼────────────┐
                 │     Flask Backend       │
                 │  Business Logic & APIs  │
                 │ Authentication & Roles  │
                 └────────┬─────────┬──────┘
                          │         │
                ┌─────────▼───┐  ┌──▼────────────────┐
                │   SQLite    │  │  Celery Tasks     │
                │  Database   │  │ Background Jobs   │
                └─────────────┘  └────────┬──────────┘
                                          │
                                  ┌───────▼────────┐
                                  │ Redis Broker / │
                                  │ Task Processing│
                                  └────────────────┘
```

### Component Responsibilities

- **Frontend:** Provides the interface for authentication, quiz management, quiz attempts, and performance review.
- **Flask backend:** Implements application logic, access control, and REST API endpoints.
- **SQLite database:** Stores application data, including users, roles, quizzes, questions, and quiz results.
- **SQLAlchemy ORM:** Facilitates database interaction through Python models.
- **Celery:** Executes supported background jobs asynchronously.
- **Redis:** Acts as the message broker for background task processing.

## Database Design

The application uses a relational database structure to organize its core entities and maintain relationships between them.

The primary entities include:

- **Users:** Stores user account information and authentication-related attributes.
- **Roles:** Defines access levels for administrators and regular users.
- **Subjects:** Organizes quizzes into subject categories.
- **Chapters:** Groups related content within subjects.
- **Quizzes:** Stores quiz details, scheduling information, duration, and marks.
- **Questions:** Stores the questions associated with quizzes.
- **Scores:** Records quiz attempts, results, and performance information.

SQLAlchemy models and relationships support structured data access and interaction between the application and the database.

## Implementation Highlights

- Designed a Flask-based backend with RESTful API endpoints.
- Implemented authentication and role-based authorization.
- Developed relational database models and ORM-based data access.
- Integrated a Vue.js frontend with backend API services.
- Implemented quiz scheduling, timed attempts, answer submission, and score recording.
- Added historical result tracking and performance visualizations.
- Integrated Celery and Redis for asynchronous background processing.
- Used Postman to test and validate backend API behavior.
- Organized the application into distinct frontend, backend, database, and background-processing components.

## Learning Outcomes

This project provided practical experience in:

- Full-stack web application development.
- REST API design and frontend-backend integration.
- Authentication and role-based access control.
- Relational database design and ORM-based operations.
- Stateful workflows such as timed examinations and quiz submissions.
- Asynchronous task processing using Celery and Redis.
- API testing and debugging.
- Designing applications with separate responsibilities across system components.

## Future Enhancements

Potential improvements include:

- More detailed quiz analytics and performance reports.
- Automated unit, integration, and API tests.
- Enhanced accessibility and responsive UI/UX.
- Deployment to a cloud platform.
- CI/CD integration for automated testing and deployment.
- Improved monitoring and reliability for background tasks.

## Author

**Hemalatha Baskar**

- B.Tech in Computer Science and Engineering — IIITDM Kancheepuram
- BS in Data Science and Applications — IIT Madras

Interested in full-stack development, machine learning, artificial intelligence, and building practical software applications.

---

*Quiz Master v2 is a full-stack academic project demonstrating the integration of web technologies, database systems, authentication, REST APIs, and asynchronous task processing.*

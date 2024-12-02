# Piazza - Social Media Platform

**Piazza** is a **Node.js-based** social media platform built with a **microservices architecture** to ensure scalability, modularity, and easy deployment. The platform provides essential social media features such as user verification, content posting, and automated content expiration, all implemented as separate services for efficient management and performance.

## Key Features
- **User Verification**: Validates user credentials securely using dedicated microservices.
- **Content Posting**: Enables users to create, manage, and interact with posts for a dynamic content-sharing experience.
- **Scheduled Tasks**: Automates actions like expiring old posts using background jobs, reducing manual intervention.

## Project Structure
- **`models/`**: Database schemas for structured data storage.
- **`piazza/`**: Core microservices and APIs powering the platform.
- **`routes/`**: REST API endpoints for managing posts and user-related actions.
- **`tasks/`**: Background jobs for automated scheduled tasks.
- **`validations/`**: Logic for user input validation and authentication.

## Highlights
- Built with **scalable microservices** for modular development and deployment.
- Optimized for performance and automation, minimizing manual upkeep.
- Provides a secure, user-friendly interface for modern social media needs.

---

Contributions are welcome! Explore, extend, and enhance this project to build a robust social media platform.

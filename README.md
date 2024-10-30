Piazza - Social Media Platform
Piazza is a Node.js-based social media platform built with a microservices architecture to enable scalability, modularity, and easy deployment. It offers essential social media functionalities such as user verification, content posting, and scheduled content expiration, all developed as individual services for better management and performance.

Key Features
User Verification: Ensures secure access by validating user credentials through dedicated microservices.
Content Posting: Allows users to create, manage, and interact with posts, providing a dynamic content-sharing experience.
Scheduled Tasks: Automates actions like expiring old posts using scheduled jobs, optimizing platform upkeep without manual intervention.
Project Structure
models/: Database schemas.
piazza/: Core microservices and APIs.
routes/: REST API endpoints for managing posts and user actions.
tasks/: Background jobs for scheduled tasks.
validations/: User input and authentication logic.

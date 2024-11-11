# Kanpla Backend Developer Challenge

Welcome to the Backend Developer Challenge! 👋

This exercise is designed to give you a taste of working on a production codebase as part of our team (we promise that our codebase looks better). 

We’re excited to see how you tackle the tasks! Happy coding 🚀

## Getting Started
When you're ready to start the challenge:

1. **Clone** (not fork) this repository.

2. Implement each task as a separate **pull request (PR)** against your version of the repository.
   * Each PR should be prepared as if you were contributing to a live team project.
   * Provide a brief description of your solution and your reasoning in each PR.

3. **Merge each PR** upon completion of a task, so we can review your approach to each challenge individually.

4. When you’re ready to submit your solution, share the link to your repo with us. If you prefer to keep it private, let us know so we can provide emails for repo access.

>**Questions?** If you have questions or need clarification, feel free to reach out to. We’re here to help!

### Approach and Notes

We’d love to understand your approach. Feel free to include notes on your decision-making process and anything you prioritized or deprioritized. 

>**Note**: Timebox this challenge to 2-3 hours. Don’t worry if some parts are incomplete — just be prepared to discuss your approach for any unfinished sections.

## Challenge Overview

This challenge involves extending and optimizing the very-much in progress backend for our POS (Point of Sale) system. You’ll be working on the basket service for our application, with a focus on persistence, error handling, and performance improvements.

## Tasks

#### Task 1: Basket Persistence
- Implement persistence for the basket using any relational database.
- There’s no need to deploy this database; local setup is sufficient.

#### Task 2: Error Handling
- Ensure robust error handling for order creation and payment processing.

#### Task 3: Performance Optimization
- Optimize the ordering endpoint to reduce request duration while maintaining error handling.

#### Task 4 (Bonus): Unit Testing
- Add unit tests where you see fit to ensure the reliability of the basket service.
- This is a bonus task, so a full suite isn’t necessary, but please showcase your testing approach.

## Development Environment

### Backend POS Service

The service is built with Node.js and Express. 

Here’s how to set it up:

How to run the app:

1. Install dependencies: `npm install`

2. Start the app in development mode: `npm start`

### Database
Use any relational database of your choice (e.g., PostgreSQL, MySQL, SQLite). Ensure that your code includes setup instructions for easy review and testing.

### Mock API
The app uses a mock API server for data fetching and order creation. Please use the token provided in the email to authenticate with the API.

>**Note**: The API is intentionally sometimes slow and a bit flaky to simulate real-world conditions.

You can find the API documentation [here](https://kanpla-code-challenge.up.railway.app/docs).

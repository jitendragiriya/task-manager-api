const ERRORS = {
  // User Errors
  USER_REQUIRED: "Name, email and password are required",
  USER_EXISTS: "User already exists",
  USER_NOT_FOUND: "User not found",
  INVALID_CREDENTIALS: "Invalid credentials",

  // Validation Errors
  PASSWORD_NOT_MATCH: "Password does not match",
  INVALID_EMAIL: "Invalid email format",
  INVALID_PASSWORD:
    "Password must be at least 6 chars long, include uppercase, lowercase, number & special char",

  // Auth Errors
  UNAUTHORIZED: "Not authorized, token failed",
  TOKEN_MISSING: "No token, authorization denied",

  // General Errors
  SERVER_ERROR: "Something went wrong, please try again later",
  // Task Errors
  TASK_REQUIRED: "Title and description are required",
  TASK_NOT_FOUND: "Task not found",
  INVALID_STATUS: "Invalid task status",

}

const MESSAGES = {
  // User Success
  USER_REGISTERED: "User registered successfully",
  USER_LOGGED_IN: "Login successful",
  USER_UPDATED: "User updated successfully",
  USER_DELETED: "User deleted successfully",

  // Task Success
  TASK_CREATED: "Task created successfully",
  TASK_UPDATED: "Task updated successfully",
  TASK_DELETED: "Task deleted successfully",

  // General
  REQUEST_SUCCESS: "Request completed successfully",
  // Task Success
  TASK_CREATED: "Task created successfully",
  TASK_UPDATED: "Task updated successfully",
  TASK_DELETED: "Task deleted successfully",

};

const TOKEN_EXPIRY_TIME = '1d'

const TASK_STATUS = ["pending", "in_progress", "completed"]

module.exports = {
  ERRORS,
  MESSAGES,
  TOKEN_EXPIRY_TIME,
  TASK_STATUS
};

// index.js
const jsonServer = require("json-server");
const rateLimit = require("express-rate-limit");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// Configure rate limiting: allow 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes.",
});

const port = process.env.PORT || 8080;

// Use default middlewares (logging, static, etc.)
server.use(middlewares);

// Apply rate limiter to all requests
server.use(limiter);

// Use the JSON Server router to serve routes based on db.json
server.use(router);

// Start the server
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});

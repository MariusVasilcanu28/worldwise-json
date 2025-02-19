// const jsonServer = require("json-server");
// const server = jsonServer.create();
// const router = jsonServer.router("db.json");
// const middlewares = jsonServer.defaults();
// const port = process.env.PORT || 8080; //  chose port from here like 8080, 3001

// server.use(middlewares);
// server.use(router);

// server.listen(port);

const jsonServer = require("json-server");
const { RateLimiterMemory } = require("rate-limiter-flexible");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 8080;

// Configure rate limiter: 100 requests per 15 minutes per IP
const rateLimiter = new RateLimiterMemory({
  points: 100, // 100 requests
  duration: 15 * 60, // per 15 minutes
});

// Create a middleware function for rate limiting
const rateLimiterMiddleware = (req, res, next) => {
  // Use the request IP as the key
  const ip = req.ip;
  rateLimiter
    .consume(ip)
    .then(() => {
      // Allowed: continue to the next middleware
      next();
    })
    .catch(() => {
      // Not allowed: too many requests
      res
        .status(429)
        .send(
          "Too many requests from this IP, please try again after 15 minutes."
        );
    });
};

server.use(middlewares);
server.use(rateLimiterMiddleware); // Apply rate limiting middleware
server.use(router);

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});

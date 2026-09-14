// Custom entry point for Hostinger's Node.js App Manager (Passenger), which
// expects a plain startup file rather than running `npm start` directly.
// It boots the built Next.js production server programmatically.
const { createServer } = require("http");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`Ready on port ${port}`);
  });
});

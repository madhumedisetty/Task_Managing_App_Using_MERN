const express = require("express");
const cors = require("cors");

//mongoDB connection
require("./config/db");

// importing routes
const tasks = require("./routes/api/task");

const app = express();
app.use(express.json());
app.get("/", (req, res) => res.send("hello"));

// use route
app.use("/api/tasks", tasks);

//change the port number to react server port then it will work fine
app.use(cors());
const { createProxyMiddleware } = require("http-proxy-middleware");
app.use(
  "/api",
  createProxyMiddleware({
    target: "http://localhost:3008/", //original url
    changeOrigin: true,
    //secure: false,
    onProxyRes: function (proxyRes, req, res) {
      proxyRes.headers["Access-Control-Allow-Origin"] = "*";
    },
  })
);
const port = process.env.PORT || 3008;

app.listen(port, () =>
  console.log(`server is running at http://localhost:${port}`)
);


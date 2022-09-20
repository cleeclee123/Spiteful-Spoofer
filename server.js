const express = require("express");

const APP = express();
const PORT = process.env.PORT || 8080;

// identifies the permitted origin of the request
APP.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  next();
});

// api entry endpoint : "Hello, World!"
APP.get("/", (request, response) => {
  response.send("Hello, World!");
});

// route error handling: route doesn't exist
APP.use((request, response, next) => {
  response.status(404).send("404 Error, Endpoint Doesn't Exist");
});

// start at port
APP.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});

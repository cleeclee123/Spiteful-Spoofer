const express = require("express");
const spoofer = require("spoofer");

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

// basic spoofer api route  
APP.get("/genrequestheader", async (request, response) => {
  const requestHeader = await spoofer.buildRequestHeader();
  response.send(requestHeader);
});

// route error handling: route doesn't exist
APP.use((request, response, next) => {
  response.status(404).send("404 Error, Endpoint Doesn't Exist");
});

// start at port
APP.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});

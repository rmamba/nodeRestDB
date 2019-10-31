"use strict";

import compression from "compression";
import express from "express";
import project from "./version";

const app: express.Application = express();
// const bodyParser = require('body-parser');
// app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.json());

if (process.env.NodeDB_COMPRESSION === "true") {
  function shouldCompress(req, res) {
    if (req.headers["x-no-compression"]) {
      // don't compress responses with this request header
      return false;
    }

    // fallback to standard filter function
    return compression.filter(req, res);
  }
  app.use(compression({
    filter: shouldCompress
  }));
}
app.set("json spaces", 2);

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json({
    build: project.build,
    develop: process.env.NODE_ENV === "test",
    endpoints: [
      "/v1"
    ],
    title: "Node.JS REST DB",
    version: project.version,
  });
});

app.get("/v1", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json({
    build: project.build,
    develop: process.env.NODE_ENV === "test",
    endpoints: [
      "/db"
    ],
    title: "Node.JS REST DB",
    version: project.version,
  });
});

import db_v1 = require("./API/v1/db");
app.use("/v1/db", db_v1);

const PORT = process.env.PORT || 3000;
export = app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

const express = require("express");
const { createServer: createHTTPServer } = require("http");
const translate = require("google-translate-api-x");
const cors = require("cors");
const app = express();
const server = createHTTPServer(app);

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send(translate.languages);
});

app.post("/", (req, res) => {
  const { q: text, from, to } = req.body;
  
  translate(text, { from, to }).then((response) => {
    res.send(response);
  });
});

server.listen(8000);

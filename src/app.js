const express = require('express');

const app = express();

app.use("/test", (req, res) => {
  res.send('Test from the server!');
});

app.use("/hello", (req, res) => {
  res.send('Hello World from the server...');
});

app.listen(9999, () => {
  console.log('Server is running on port 9999');
});
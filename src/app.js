const express = require('express');

const app = express();

app.get("/test", (req, res) => {
  res.send({ firstName: 'John', lastName: 'Doe' });
});

app.post("/test", (req, res) => {
  res.send('Data stored successfully in Database!');
});

app.use("/hello", (req, res) => {
  res.send('Hello World from the server...');
});

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

app.listen(9999, () => {
  console.log('Server is running on port 9999');
});
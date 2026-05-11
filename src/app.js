const express = require('express');

const app = express();

app.get("/test", (req, res) => {
  res.send({ firstName: 'John', lastName: 'Doe' });
});

app.post("/test", (req, res) => {
  res.send('Data stored successfully in Database!');
});


// Multiple Route Handlers app.use("/route", rH, [rH2, rH3]);
app.get("/user/:id", (req, res, next) => {
  const userId = req.params.id;
  console.log(req.params);
//   res.send(`User ID: ${userId}`);
  next();
}, (req, res, next) => {
  console.log('This is the second callback function for the /user/:id route');
  next();
}, (req, res, next) => {
    console.log('This is the third callback function for the /user/:id route');
    next();
}, (req, res) => {
    res.send('User ID processed successfully!');
});

app.get("/user/:id/:name", (req, res) => {
  const userId = req.params.id;
  const userName = req.params.name;
  console.log(req.params);
  res.send(`User ID: ${userId}, User Name: ${userName}`);
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
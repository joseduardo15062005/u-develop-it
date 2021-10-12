const express = require("express");

const PORT = process.env.PORT || 3001;
const app = express();

//Express middleware for data parse
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Hello you",
  });
});

//Default response for any other request (Not Found)
app.get((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Express listening on port ${PORT}`);
});

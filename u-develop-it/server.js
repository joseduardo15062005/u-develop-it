const express = require("express");
const mysql = require("mysql2");
const inputCheck = require("./utils/inputCheck");
require("dotenv").config();

const PORT = process.env.PORT || 3001;
const app = express();

//Express middleware for data parse
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Connect to the database
const db = mysql.createConnection(
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "election",
  },
  console.log("Connectedt to the elction database")
);

app.get("/", (req, res) => {
  res.json({
    message: "Hello you",
  });
});

app.get("/api/candidates", (req, res) => {
  const sql = "SELECT * FROM candidates";

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      message: "success",
      data: rows,
    });
  });
});

//Get a Candidate using Candidate Id
app.get("/api/candidates/:id", (req, res) => {
  const sql = "SELECT * FROM candidates WHERE id=?";
  const params = [req.params.id];
  db.query(sql, params, (err, row) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({
      message: "success",
      data: row,
    });
  });
});

//Delete a Candidate Using the Id
app.delete("/api/candidates/:id", (req, res) => {
  const sql = "DELETE FROM candidates WHERE id=?";
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({
      message: "deleted",
      changes: result.affectedRows,
      id: req.params.id,
    });
  });
});

//Create a Candidate
// Create a candidate
app.post("/api/candidate", ({ body }, res) => {
  const errors = inputCheck(
    body,
    "first_name",
    "last_name",
    "industry_connected"
  );
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
  VALUES (?,?,?)`;
  const params = [body.first_name, body.last_name, body.industry_connected];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: body,
    });
  });
});

//Default response for any other request (Not Found)
app.get((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Express listening on port ${PORT}`);
});

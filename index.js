const express = require("express");
require('dotenv').config();
const app = express();

const bodyParser = require("body-parser");
const helmet = require("helmet");
const port = 8000;

// request = input
// response = output
app.use(helmet());

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// GET USERS
app.get("/users", (req, res) => {
  db.query(
    `SELECT * FROM users ORDER BY id ASC`, (error, result) => {
      if (error) {
        res.status(400).send("ada yang error");
      } else {
        res.send({ data: result.rows, jumlahData: result.rowCount });
      }
    }
  );
});

// FIND USERS
app.get("/users/find", (req, res) => {
  const { id } = req.body;
  db.query(
    `SELECT * FROM users WHERE id = $1`, [id], 
    (error, result) => {
    if (error) {
      res.status(400).send("ada yang error");
    } else {
      res.send({ data: result.rows, jumlahData: result.rowCount });
    }
  });
});

// POST USERS
app.post("/users/add", (req,res) => {
  const { id, name, email, password, photo, phone } = req.body;
  db.query(
    `INSERT INTO users(id, name, email, password, photo, phone ) VALUES ($1, $2, $3, $4, $5, $6)`,
    [id, name, email, password, photo, phone],
    (error,result) => {
      if (error) {
        console.log("error", error)
        res.status(400).send("ada yang error");
      } else {
        res.send("data berhasil ditambah");
      }
    }
  );
});

// EDIT USERS
app.patch("/users/edit", (req, res) => {
  const { id, name, email, password, photo, phone } = req.body;
  db.query(`SELECT * FROM users WHERE id = $1`, [id], (error, result) => {
    if (error) {
      res.status(400).send("ada yang error");
    } else {
      if (result.rowCount > 0) {
        let inputNama = name || result?.rows[0]?.name;
        let inputEmail = email || result?.rows[0]?.email;
        let inputPassword = password || result?.rows[0]?.password;
        let inputPhoto = photo || result?.rows[0]?.photo;
        let inputPhone = phone || result?.rows[0]?.phone;

        let message = "";

        if (name) message += "nama,";
        if (email) message += "email,";
        if (password) message += "password,";
        if (photo) message += "photo,";
        if (phone) message += "phone,";

        db.query(
          `UPDATE users SET name = $1, email = $2, password = $3, photo = $4, phone = $5 WHERE id = $6`,
          [inputNama, inputEmail, inputPassword, inputPhoto,inputPhone, id],
          (error, result) => {
            if (error) {
              console.log("error", error);
              res.status(400).send("ada yang error");
            } else {
              res.send(`${message} berhasil di ubah`);
            }
          }
        );
      } else {
        res.status(400).send("data tidak di temukan");
      }
    }
  });
});

// DELETE PROFILE
app.delete("/users/delete", (req, res) => {
  const { id } = req.body;

  db.query(`SELECT * FROM users WHERE id = $1`, [id], (error, result) => {
    if (error) {
      res.status(400).send("ada yang error");
    } else {
      if (result.rowCount > 0) {
        db.query(`DELETE FROM users WHERE id = $1`, [id], (error, result) => {
          if (error) {
            res.status(400).send("ada yang error");
          } else {
            res.send("data berhasil di hapus");
          }
        });
      } else {
        res.status(400).send("data tidak di temukan");
      }
    }
  });
});

// end of bottom code
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
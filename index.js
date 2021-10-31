const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
require("dotenv").config();

const api_key = process.env.ApiKeyMailgun;
const domain = process.env.domainMAILGUN;
const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

const app = express();
app.use(formidable());
app.use(cors());

app.post("/form", (req, res) => {
  console.log("Route /form");

  const { firstname, lastname, email, message } = req.fields;
  /* CREATION DE L'OBJET DATA */
  const data = {
    from: `${req.fields.firstname} ${req.fields.lastname}  <${req.fields.email}>`,
    to: "marinecorbel@yahoo.fr",
    subject: "Formulaire rempli",
    text: `${req.fields.message}`,
  };
  console.log(data);
  mailgun.messages().send(data, (error, body) => {
    console.log(body);
    console.log(error);

    if (error === undefined) {
      res.json({ message: "Données du form bien reçues, mail envoyé." });
    } else {
      res.json(error);
    }
  });
});

app.all("*", (req, res) => {
  res.json({ message: "All routes" });
});

app.listen(3000, () => {
  console.log("Server started");
});

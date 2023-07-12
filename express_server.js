const express = require("express");
const app = express();
const PORT = 8000; // default port 8080

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.use(express.urlencoded({ extended: true }));

//Says hello to the client
app.get("/", (req, res) => {
  res.send("Hello!");
});

//Sends request data 
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

//Renders the urls_new view
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  console.log(urlDatabase);

  res.redirect('/urls');
});

app.post("/urls", (req, res) => {
  // Saves a shortURL 
  const longURL = req.body.longURL;
  const id = generateRandomString(6);
  //Adds the key value pair shortURL : longURL to the urlDatabase object
  urlDatabase[id] = longURL;
  console.log(id);
  console.log(urlDatabase);
  // res.send("Nice addition")
  res.redirect(`urls/${id}`);
});

//Id request
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  console.log(longURL);
  const templateVars = { id, longURL };
  res.render("urls_show", templateVars);
});


//will send the ulrDatabase object to the client
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//Can use HTML
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


//I spent way to long on this assignment, this was taken from slingacademy.com
const generateRandomString = (length) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};



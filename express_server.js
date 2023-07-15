const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
// const morgan = require('morgan')
// const cookieParser = require('cookie-parser')
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
//Imported modules
app.use(express.urlencoded({ extended: true }));
// app.use(morgan('dev'));


//Says hello to the client
app.get("/", (req, res) => {
  res.send("Hello!");
});

//Can send HTML
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//Renders the urls_new view
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// will send the ulrDatabase object to the client
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//This POST Route is used to create new Short and Long URL in the 
//url database
app.post("/urls", (req, res) => {
  const longURL = req.body["longURL"];
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`)
});

// Id request
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//Goes to the id page 
//Goes to edit page
app.get("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  const templateVars = { id: shortURL, longURL: longURL };
  res.render("urls_show", templateVars);
});

//Edit long url returned from edit button
app.post("/urls/:id/edit", (req, res) => {
  const shortURL = req.params.id;
  console.log(shortURL)
  urlDatabase[shortURL]= req.body.longURL
  res.redirect("/urls");
});

//Will the request to delete a url from the server
app.post("/urls/:id/delete", (req, res) => {
  const shortURL = req.params.id;
  delete urlDatabase[shortURL]
  res.redirect("/urls");
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id]
  if(!longURL){
    res.send("That URL was not found")
  }
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port 8080!`);
});


// //I spent way to long on this assignment, this was taken from slingacademy.com
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



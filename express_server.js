const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

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
  // console.log(req.params.id)
  // console.log(res)
  // console.log(id)
  // console.log(res)
  console.log(req)
  // console.log(urlDatabase)
  // delete urlDatabase[shortURL]
  // for(const short in urlDatabase){
  //   console.log(short)
  // }

  // console.log(typeof(urlDatabase))
  // console.log(urlDatabase)
  res.render('urls_index')
})

app.post("/urls", (req, res) => {
  // Saves a shortURL 
  const shortURL = generateRandomString(6);
  //Adds the key value pair shortURL : longURL to the urlDatabase object
  urlDatabase[shortURL] = req.body.longURL;
  console.log(urlDatabase)
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

//Id request
app.get("/urls/:id", (req, res, urlDatabase) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase.id };
  console.log(req.params);
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




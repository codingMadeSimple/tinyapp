const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
// const morgan = require('morgan')
const cookieParser = require('cookie-parser');
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//New user database
const users = {
  abc: {
    id: "abc",
    email: "a@a.ca",
    password: "1234",
  },
  def: {
    id: "def",
    email: "b@b.ca",
    password: "5678",
  },
};

//This is based off of cookies
const userDatabase = {
};



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
  res.redirect(`/urls/${shortURL}`);
});

// Id request
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  if (users["user"]) {
    templateVars["user"] = users.user;
    console.log(templateVars);
    res.render("protected", templateVars);
  } else {
    res.render("urls_index", templateVars);
  }
});

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
  // console.log(shortURL)
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls");
});

//Will the request to delete a url from the server
app.post("/urls/:id/delete", (req, res) => {
  const shortURL = req.params.id;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});



//If they input a url that is not in the database
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  if (!longURL) {
    res.send("That URL was not found");
  }
  res.redirect(longURL);
});


app.get("/login", (req, res) => {

  res.render("login");
});

app.post("/login", (req, res) => {
  const email = req.body["email"];
  const password = req.body["password"];
  console.log(email, password);
  emailFound = null;
  //Check if email or password were empty
  if (email === "" || password === "") {
    res.status(400);
    return res.send('Please input both email and password.');
  }

  for (const user in users) {
    //Checks if user inputted email is the same as any in the users database
    if (users[user]["email"] !== email) {
      return res.status(403);
    } else if (users[user]["email"] === email && users[user]["password"] !== password) {
      return res.status(403);
    } else if (users[user]["email"] === email && users[user]["password"] === password) {
      res.cookie("user_id", users[user]["id"]);
      const templateVars = { urls: urlDatabase };
      templateVars["user"] = users[user];
      res.render("protected", templateVars)
    }
  }
  res.redirect("/login");
});

app.get("/protected", (req, res) => {

  res.render("protected")
})

//Logout post from protected
app.post("/logout", (req, res) => {
  console.log(users["user"])
  delete users["user"];
  res.clearCookie("user_id");
  res.redirect("/login");
});

app.get("/register", (req, res) => {
  res.render("register");
});


//Creates a newUser Object
app.post("/register", (req, res) => {

  const email = req.body["email"];
  const password = req.body["password"];
  const id = generateRandomString(6);

  if (email === "" || password === "") {
    res.status(400);
    return res.send('Please input both email and password.');
  }

  //Loop through users to see if exist
  for (const user in users) {
    //Checks if user inputted email is the same as any in the users database
    if (users[user]["email"] === email) {
      res.status(400);
      return res.send("Unfortunately that email is already in our database plase input a new one.");
    }
  }
  //New user object
  const newUser = {
    id: id,
    email: email,
    password: password,
  };
  // Set user_id cookie from value based on newUser.id
  res.cookie("user_id", newUser.id);
  //This will add the newUser to the users database
  users["user"] = newUser;
  res.redirect("/urls");
});

//Server is listening
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
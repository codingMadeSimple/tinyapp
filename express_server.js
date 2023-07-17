const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
// const morgan = require('morgan')
const cookieParser = require('cookie-parser');
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

//New user database
const users = {
  abc: {
    id: "abc",
    email: "a@a.ca",
    password: "1234",
    loggedIn: false
  },
  def: {
    id: "def",
    email: "b@b.ca",
    password: "5678",
    loggedIn: false
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
  for(const user in users){
    console.log(user)
    console.log(users[user]["loggedIn"])
    if(req.cookies.user_id === user && users[user]["loggedIn"] === true){
      res.render("urls_new");
    }
  }
  // console.log(urlDatabase)
  res.redirect("/register")
});

// will send the ulrDatabase object to the client
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//This POST Route is used to create new Short and Long URL in the 
//url database
app.post("/urls", (req, res) => {
  for(const user in users){
    if(req.cookies.user_id !== user){
      res.send("It doens't seem that you are logged in. Only registered members can shorten a URL")
    }
  }
  console.log(req)
  const longURL = req.body["longURL"];
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

// Id request
app.get("/urls", (req, res) => {
  for(const key in urlDatabase){
    console.log(urlDatabase[key].longURL)
  }

  const templateVars = { urls: urlDatabase["shortURL"] };
  console.log(templateVars)
  if (users["user"]) {
    users.user[loggedIn]= true
    templateVars["user"] = users.user;
    res.render("protected", templateVars);
  } else {
    res.render("urls_index", templateVars);
  }
});

//Goes to edit page
app.get("/urls/:id", (req, res) => {
// const { b6UTxQ, i3BoGr } = urlDatabase;
  const shortURL = req.params.id;

  const longURL = urlDatabase[shortURL].longURL
console.log(longURL)
  console.log(urlDatabase[shortURL].longURL)
  const templateVars = { id: shortURL, longURL: longURL };
  console.log(templateVars)
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
app.get(`/u/:id`, (req, res) => {
  const longURL = urlDatabase[req.params.id];
  if (!longURL) {
    res.send("That URL was not found");
  }
  res.redirect(longURL);
});

//Change this into a function call so get rid of extra code
app.get("/login", (req, res) => {
  //Checks to see if the value in cookies is equal to the userID
  for(const user in users){
    if(req.cookies.user_id === user){
      res.redirect("/urls")
    }
  }
  res.render("login");
});

app.post("/login", (req, res) => {
  const email = req.body["email"];
  const password = req.body["password"];
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
      users[user]["loggedIn"] = true
      res.cookie("user_id", users[user]["id"]);
      // const templateVars = { urls: urlDatabase };
      const templateVars[users] = users[user];
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
  for(const user in users){
    if(req.cookies.user_id === user){
      res.redirect("/urls")
    }
  }
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
    loggedIn: true
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


const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require("bcryptjs");
const password = "purple-monkey-dinosaur"; // found in the req.body object
const hashedPassword = bcrypt.hashSync(password, 10);
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
    userID: "101010",
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
  },
  def: {
    id: "def",
    email: "b@b.ca",
    password: "5678",
  },
};


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
// Function that returns only the urls associated with the userID
const urlsForUser = function(userID, urlDatabase) {
  const urlDatabaseUser = {};
  for (const shortID in urlDatabase) {
    const longUrlUserID = urlDatabase[shortID].userID;
    if (longUrlUserID === userID) {
      urlDatabaseUser[shortID] = { longURL: urlDatabase[shortID].longURL, userID };
    }
  }
  // if(users[id] === req.cookies.user_id){

  //return userID matched urls
  console.log(urlDatabaseUser);
  return urlDatabaseUser;

};
urlsForUser("aJ48lW", urlDatabase);

//Says hello to the client
app.get("/", (req, res) => {
  res.send("Hello!"); //eventually needs to change
});

// Id request
app.get("/urls", (req, res) => {
  if (!req.cookies.user_id) {
    return res.redirect("/login");
  }
  const urlsOfUser = urlsForUser(req.cookies.user_id, urlDatabase);

  const templateVars = { urls: urlsOfUser, user: users[req.cookies.user_id] };
  res.render("urls_index", templateVars);
});

//Renders the urls_new view
app.get("/urls/new", (req, res) => {
  if (!req.cookies.user_id) {
    return res.redirect("/login");
  }
  const templateVars = { user: users[req.cookies.user_id] };
  res.render("urls_new", templateVars);
});

//Goes to edit page
app.get("/urls/:id", (req, res) => {
  const userID = req.cookies.user_id;
  if (!userID) {
    return res.status(400).send("Please login to see your urls.");
  }
  const shortURL = req.params.id;
  if (userID !== urlDatabase[shortURL].userID) {
    return res.status(400).send("Sorry, you are not authorized to view this page.");
  }
  const templateVars = { id: shortURL, longURL: urlDatabase[shortURL].longURL, user: users[userID] };

  res.render("urls_show", templateVars);
});

//If they input a url that is not in the database
app.get("/u/:id", (req, res) => {
  if (!urlDatabase[req.params.id]) {
    return res.send("That URL was not found");
  }
  res.redirect(urlDatabase[req.params.id].longURL);
});

//This POST Route is used to create new Short and Long URL in the 
//url database
app.post("/urls", (req, res) => {
  if (!req.cookies.user_id) {
    return res.send("It doens't seem that you are logged in. Only registered members can shorten a URL");
  }

  const shortURL = generateRandomString(6);
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL: longURL, userID: req.cookies.user_id };
  res.redirect(`/urls/${shortURL}`);
});

//Edit long url returned from edit button
app.post("/urls/:id/edit", (req, res) => {
  const shortURL = req.params.id;
  urlDatabase[shortURL].longURL = req.body.longURL;
  res.redirect("/urls");
});

//Will the request to delete a url from the server
app.post("/urls/:id/delete", (req, res) => {
  const userID = req.cookies.user_id;
  const shortURL = req.params.id;
  if (!userID) {
    return res.status(400).send("You need to be logged in and have a valid account to delete your URLS");
  } else if (userID !== urlDatabase[shortURL].userID) {
    return res.status(400).send("Please log in to your account in order to delete this URL");
  }
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

//Change this into a function call so get rid of extra code
app.get("/login", (req, res) => {
  //Checks to see if the value in cookies is equal to the userID
  if (req.cookies.user_id) {
    return res.redirect("/urls");
  }
  res.render("login", { user: undefined });
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const passwordCheck = bcrypt.compareSync(password, foundUser.password);
  // const hashedPassword = bcrypt.hashSync(password, 10);

  //Check if email or password were empty
  if (!email || !password) {
    return res.status(400).send('Please input both email and password.');
  }

  let foundUser;
  for (const userID in users) {
    //Checks if user inputted email is the same as any in the users database
    if (users[userID].email === email) {
      foundUser = users[userID];
    }
  }
  if (!foundUser) {
    return res.status(404).send("User does not exist");
  }


  if (!passwordCheck) {
    return res.status(400).send("Incorrect password");
  }



  res.cookie("user_id", foundUser.id);
  res.redirect("/urls");
}
);

app.get("/register", (req, res) => {
  if (req.cookies.user_id) {
    res.redirect("/urls");
  } else {
    res.render("register", { user: undefined });
  }
});

//Creates a newUser Object
app.post("/register", (req, res) => {

  const email = req.body.email;
  const password = req.body.password;
  const id = generateRandomString(6);
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (!email || !password) {
    return res.status(400).send('Please input both email and password.');
  }

  let foundUser;
  for (const userID in users) {
    //Checks if user inputted email is the same as any in the users database
    if (users[userID].email === email) {
      foundUser = users[userID];
    }
  }
  if (foundUser) {
    return res.status(400).send("Unfortunately that email is already in our database plase input a new one.");
  }
  //New user object
  const newUser = {
    id,
    email,
    password: hashedPassword
  };
  //This will add the newUser to the users database
  users[id] = newUser;
  // Set user_id cookie from value based on newUser.id
  res.cookie("user_id", newUser.id);
  res.redirect("/urls");
});

//Logout post from protected
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

//Server is listening
app.listen(PORT, () => {
  console.log(`Example app listening on port 8080!`);
});
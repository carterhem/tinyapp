const { json } = require("express");
const express = require("express");
const app = express();
const PORT = 8080; //default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

let urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

app.set("view engine", "ejs");

const generateRandomString = function () {
  let result = "";
  //place to put end string
  const possibleCharacters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  //what characters am i choosing from?
  for (let j = 0; j < 6; j++) {
    //loop through the string possibleCharacters
    result += possibleCharacters.charAt(
      Math.floor(Math.random() * possibleCharacters.length)
    );
    //add the character picked at random(mathfloor/mathrandom * length) to the result
  }
  return result;
};

const findEmail = function(email, users) {
  for (const key in users) {
    if (email === users[key]["email"]){
      return key;
    }
}
};

//const bodyParser = require("body-parser"); moved to top for continuity
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/urls/new", (req, res) => {
  const user = users[req.cookies.user_id];
  const templateVars = { user: user };
  res.render("urls_new", templateVars);
});

app.get("/urls", (req, res) => {
  // console.log(req)
  const user = users[req.cookies.user_id]
    ? users[req.cookies.user_id]
    : undefined;
  if (!user) {
    return res.redirect("/login");
  }
  const templateVars = { urls: urlDatabase, user: user };
  // console.log("templateVars", templateVars)
  res.render("urls_index", templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.cookies.user_id];
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: user,
  };
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  // const templateVars = {
  //   shortURL: req.params.shortURL,
  //   longURL: urlDatabase[req.params.shortURL],
  //   username: req.cookies["user_id"],
  // };
  const templateVars = { user: null };
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  // const templateVars = {
  //   shortURL: req.params.shortURL,
  //   longURL: urlDatabase[req.params.shortURL],
  //   username: req.cookies["user_id"],
  // };
  const templateVars = { user: null };
  res.render("login", templateVars);
});

app.post("/urls", (req, res) => {
  // console.log(req.body);
  const longURL = req.body.longURL; // added longURL to this chain
  const shortURL = generateRandomString();

  urlDatabase[shortURL] = longURL;
  //instead of making this hard - make the value of shortURL key in database longURL
  //spread operator to save the key value pair to the database
  // console.log("urldatabase", urlDatabase)
  // const ABC = {
  //   shortURL:longURL
  console.log(urlDatabase);
  // console.log("ABC", ABC)
  // console.log("req.body.longURL", req.body.longURL);  // Log the POST request body to the console
  // urlDatabase[shortURL];
  // console.log(urlDatabase)
  // console.log("shortURL", shortURL)
  res.redirect(`/urls/${shortURL}`);
  // console.log("redirect","/urls/:shortURL")
});

app.post("/urls/:shortURL/delete", (req, res) => {
  console.log(req.params);
  // let longURL = req.body.longURL;
  // let shortURL = req.body.shortURL;
  delete urlDatabase[req.params.shortURL];

  // delete urlDatabase['shortURL'];
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  console.log(req.body);
  // console.log(req.body.username)
  res.cookie("username", req.body.username);
  console.log(req.cookies);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  // console.log(req.body);
  // console.log(req.body.username)
  res.clearCookie("user_id", req.body.user_id);

  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  // console.log(req.params)
  // console.log(req.body)
  const newLongURL = req.body.newLongURL;
  console.log(newLongURL);
  urlDatabase[req.params.shortURL] = newLongURL;
  // let longURL = req.body.longURL;
  // let shortURL = req.body.shortURL;
  // update urlDatabase[req.params.shortURL];

  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const firstEmail = req.body.email;
  const firstPassword = req.body.password;
  if (!firstEmail || !firstPassword) {
    //if in the request there is no email or no password - error message
    return res
      .status(400)
      .send("Email and/or password fields cannot be blank!");
  } else if (findEmail(firstEmail, users)) {
    //using my email function findEmail to identify if email from the request exists in the database    
   return res.status(400).send("A user account has already been created with that email!"); 
  } else if (firstEmail && firstPassword) {
    //neither of these conditions are true, then proceed to register
    console.log("req.body", req.body);
  const userRandomID = generateRandomString();
  users[userRandomID] = {};
  const id = userRandomID;
  users[userRandomID]["id"] = id;
  const email = req.body.email;
  users[userRandomID]["email"] = email;
  const password = req.body.password;
  users[userRandomID]["password"] = password;
  console.log("email", email)
  
  res.cookie("user_id", userRandomID);
  // const userRandomID = (users[generateRandomString()] = {});
  // console.log("userRandomID", userRandomID);
  // console.log("id", id);
  // console.log("req.body.email", req.body.email);
  console.log("users", users);
  //testing users object before redirect
  res.redirect("/urls");
  }
  

});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  // console.log(longURL);
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

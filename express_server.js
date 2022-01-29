const { json } = require("express");
const express = require("express");
const app = express();
const PORT = 8080; //default port 8080
const bodyParser = require("body-parser");
const findEmail = require("./helpers");
// const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
// app.use(cookieParser());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.urlencoded({ extended: false }));

app.use(
  cookieSession({
    name: "session",
    keys: [
      "38283ajfafwaawf58295gahuada984t",
      "afuobawnafaoi23qyt4ujagfnalkfpf",
    ],
  })
);

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "userRandomID",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "user2RandomID",
  },
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "a@a.com",
    password: bcrypt.hashSync("123", 10),
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "b@b.com",
    password: bcrypt.hashSync("123", 10),
  },
};

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

// const findPassword = function (password, users) {
//   let returnKey = [];
//   console.log("findPassword password", password);
//   for (const key in users) {
//     console.log("findPassword users[key].password", users[key].password);
//     if (bcrypt.compareSync(password, users[key].password)) {
//       returnKey = users[key];
//     }
//   }
//   console.log("findPassword returnKey", returnKey);
//   return returnKey;
// };

const urlsForUser = function (user, urlDatabase) {
  const userUrls = {};
  for (const key in urlDatabase) {
    if (user.id === urlDatabase[key].userID) {
      // console.log("urlDatabase[key]", urlDatabase[key])
      userUrls[key] = urlDatabase[key];
    }
  }
  return userUrls;
};

app.get("/urls/new", (req, res) => {
  const user = users[req.session.user_id]
    ? users[req.session.user_id]
    : undefined;
  if (!user) {
    return res.redirect("/login");
  }

  const templateVars = { user: user };
  res.render("urls_new", templateVars);
});

app.get("/urls", (req, res) => {
  const user = users[req.session.user_id]
    ? users[req.session.user_id]
    : undefined;
  //define if there is a user or not to build conditionals on

  if (!user) {
    return res.status(400).send("Please Login or Register to view this page!");
  }
  const urlList = urlsForUser(user, urlDatabase);
  //now i have an array of shorturls and need to pull long urls from it to display

  const templateVars = { urls: urlList, user: user };
  res.render("urls_index", templateVars);
});

app.get("/", (req, res) => {
  const user = users[req.session.user_id]
    ? users[req.session.user_id]
    : undefined;
  if (user) {
    res.redirect("/urls");
  } else if (!user) {
    res.redirect("/login");
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.session.user_id]
    ? users[req.session.user_id]
    : undefined;

    if (!user) {
      return res.status(400).send("Please login to access this page!");
    }
    //  else if (user) {
    //   if (user !== database user) {
    //     return res.status(400).send("This is not your URL to access!");
    //   }
    // }
//need to update this so that if the user given doesn't match user from database error message is returned
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: user,
  };
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  const user = users[req.session.user_id]
  ? users[req.session.user_id]
  : undefined;
if (user) {
  res.redirect("/urls");
} else if (!user) {
  const templateVars = { user: null };
  res.render("register", templateVars);
}

});

app.get("/login", (req, res) => {
  const user = users[req.session.user_id]
  ? users[req.session.user_id]
  : undefined;
 if(user) {
  res.redirect("/urls");
 } else if (!user) {
  const templateVars = { user: null };
  res.render("login", templateVars);
 }
});

app.post("/urls", (req, res) => {
  const user = users[req.session.user_id]
    ? users[req.session.user_id]
    : undefined;
  if (!user) {
    return res.status(400).send("Users must be logged in to use this feature!");
  }
  const longURL = req.body.longURL; 
  const shortURL = generateRandomString();
  const URL = {
    longURL: longURL,
    userID: req.session.user_id,
  };

  urlDatabase[shortURL] = URL;
  //instead of making this hard - make the value of shortURL key in database longURL
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const cookieUser = req.session.user_id;
  
  if (cookieUser === urlDatabase[req.params.shortURL].userID) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    return res.status(400).send("This URL does not belong to this User!");
  }
});

app.post("/login", (req, res) => {
  const loginEmail = req.body.email;
  const loginPassword = req.body.password;
  //creating variables to house request information
  if (!loginEmail || !loginPassword) {
    return res
      .status(400)
      .send("Email and/or password fields cannot be blank!");
  }

  const user = findEmail(loginEmail, users);
  if (!user) {
    //as in if there is no email found that matches form submission
    return res
      .status(403)
      .send("No user account exists for that email address!");
  }
  const compare = bcrypt.compareSync(loginPassword, user.password);
  if (compare) {
    req.session.user_id = user.id;
    res.redirect("/urls");
  } else {
    return res.status(403).send("Incorrect Password");
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

app.post("/urls/:shortURL", (req, res) => {
  let cookieUser = req.session.user_id;

  if (cookieUser === urlDatabase[req.params.shortURL].userID) {
    const newLongURL = req.body.newLongURL;
    urlDatabase[req.params.shortURL].longURL = newLongURL;
    res.redirect("/urls");
  } else {
    return res.status(400).send("This URL does not belong to this User!");
  }
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
    return res
      .status(400)
      .send("A user account has already been created with that email!");
  } else if (firstEmail && firstPassword) {
    //neither of these conditions are true, then proceed to register
    const userRandomID = generateRandomString();
    users[userRandomID] = {};
    const id = userRandomID;
    users[userRandomID]["id"] = id;
    const email = req.body.email;
    users[userRandomID]["email"] = email;
    const password = req.body.password;
    const hashedPassword = bcrypt.hashSync(password, 10);
    users[userRandomID]["password"] = hashedPassword;
    req.session.user_id = userRandomID;
    res.redirect("/urls");
  }
});

app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    return res.status(404).send("That ID does not exist!");
  }
  //if longURL doesn't exist in the database - then give an error message
  const longURL = urlDatabase[req.params.shortURL].longURL;

  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

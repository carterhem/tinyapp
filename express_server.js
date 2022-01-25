const { json } = require("express");
const express = require("express");
const app = express();
const PORT = 8080; //default port 8080


let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.set("view engine", "ejs");

function generateRandomString() {
let result = "";
//place to put end string
const possibleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//what characters am i choosing from?
for (let j = 0; j < 6; j++) {
  //loop through the string possibleCharacters
  result += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
  //add the character picked at random(mathfloor/mathrandom * length) to the result

} return result;
}


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
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
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL] 
  };
  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
  console.log(req.body)
  const longURL = req.body.longURL;// added longURL to this chain
  const shortURL = generateRandomString()

  urlDatabase[shortURL] = longURL
  // urlDatabase = {...urlDatabase, [shortURL]:longURL}
  //spread operator to save the key value pair to the database
  // console.log("urldatabase", urlDatabase)
  // const ABC = {
  //   shortURL:longURL
  console.log(urlDatabase)
  // console.log("ABC", ABC)
  // console.log("req.body.longURL", req.body.longURL);  // Log the POST request body to the console
  // urlDatabase[shortURL]; 
  // console.log(urlDatabase)
  // console.log("shortURL", shortURL)
  res.redirect(`/urls/${shortURL}`); 
  // console.log("redirect","/urls/:shortURL")
});


app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  console.log(longURL);
  res.redirect(longURL);

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

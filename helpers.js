const findEmail = function (email, users) {
  for (const user of Object.values(users)) {
    if (email === user.email) {
      // console.log("users", users)
      // console.log("users[key]", users[key])
     
      // console.log("key", key)
      return user;
    }
  }
};

module.exports = findEmail;


// const testUsers = {
//   "userRandomID": {
//     id: "userRandomID", 
//     email: "user@example.com", 
//     password: "purple-monkey-dinosaur"
//   },
//   "user2RandomID": {
//     id: "user2RandomID", 
//     email: "user2@example.com", 
//     password: "dishwasher-funk"
//   }
// };

// findEmail("user@example.com", testUsers)

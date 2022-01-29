const { assert } = require('chai');
const findEmail = require('../helpers.js');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

// const findEmail = function (email, users) {
//   for (const key in users) {
//     if (email === users[key].email) {
//       return users[key];
//     }
//   }
// }

describe('findEmail', function() {
  it('should return a user with valid email', function() { //should PASS
    const user = findEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    console.log("user", user)
    console.log("user.email", user.email)
    // console.log("expectedUserID", expectedUserID)
   assert.strictEqual(user.id, expectedUserID, 'did not return user despite valid email')
  });
  it('should return undefined for a non-existent email', function() {// should PASS
    const user = findEmail("notemail@gmail.com", testUsers)
    const expectedUserID = undefined;
   assert.strictEqual(user, expectedUserID, "did not return undefined despite non-existent email")
  });
});
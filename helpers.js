const findEmail = function (email, users) {
  for (const key in users) {
    if (email === users[key].email) {
      return users[key];
    }
  }
};

module.exports = findEmail;

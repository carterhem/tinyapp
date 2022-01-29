const findEmail = function (email, users) {
  for (const user of Object.values(users)) {
    if (email === user.email) {
      return user;
    }
  }
};

module.exports = findEmail;
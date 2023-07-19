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

const getUserByEmail = function(email, database) {
  for (const user in database) {
    if (database[user]["email"] === email) {
      return user;
    }
  }
};


console.log(getUserByEmail("a@a.ca", users))


module.exports = { getUserByEmail };
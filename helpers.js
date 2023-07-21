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
  return urlDatabaseUser;
};

module.exports = {
  generateRandomString,
  urlsForUser
};
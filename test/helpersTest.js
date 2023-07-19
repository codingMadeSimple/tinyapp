const { assert } = require('chai');

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

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    // Write your assert statement here
    assert.strictEqual(user, expectedUserID, 'These users are strictly the same.')    
  });

  it('should return undefined if the email does not exist in either object.', function() {
    const user = getUserByEmail("example@example.com", testUsers)
    const expectedUserID = undefined;
    // Write your assert statement here
    assert.isUndefined(user, expectedUserID, 'Will return undefined if the ')
  });
});


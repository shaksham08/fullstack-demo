function generateToken() {
  // Define the characters that can be used in the token
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // Define the length of the token
  const tokenLength = 32;

  let token = "";

  // Generate random characters to form the token
  for (let i = 0; i < tokenLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }

  return token;
}

function validateAdminToken(token) {
  // Generate a random boolean value
  const randomResult = Math.random() < 0.5;

  return randomResult;
}

module.exports = { generateToken, validateAdminToken };

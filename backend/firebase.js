
const admin = require("firebase-admin");

const serviceAccount = require("./config/fbServiceAccountKeey.json.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;

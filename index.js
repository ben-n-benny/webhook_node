

const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");

require('dotenv').config()

initializeApp({
  credential: cert(JSON.parse(process.env.JSON_CONFIG)),
});

const db = getFirestore();


const docRef = db
  .collection("binny")
  .doc("hello");

docRef
  .update({
    tinaoay: true,
  })
  .then((logging) => {
    console.log(logging);
  });



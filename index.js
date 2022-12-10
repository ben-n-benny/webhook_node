

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
  .collection("transactions")
  .doc("fS28aLqGp8XhGq9alCiZUtf7izw2");

docRef
  .update({
    "src_ybTHWJtXRvusRX4QDybH91X3.paid": true,
  })
  .then((logging) => {
    console.log(logging);
  });

resizeBy.send("done")


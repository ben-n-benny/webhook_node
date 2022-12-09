

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

const serviceAccount = require("./paymongo-kasmagtech-2a3f2649bb98.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const docRef = db.collection("benny").doc("alovelace");

docRef.set({
  first: "Ada",
  last: "Lovelace",
  born: 1815,
});
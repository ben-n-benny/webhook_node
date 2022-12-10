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
const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());

require("dotenv").config();

initializeApp({
  credential: cert(process.env.JSON_CONFIG),
});

const db = getFirestore();

app.post("/", (req, res) => {
  const request_body = req.body;
  // console.log(req.body)
  //res.send(req.body.data.attributes.type);
  if (request_body.data.attributes.type == "source.chargeable") {
    let amount = request_body.data.attributes.data.attributes.amount;
    let id = request_body.data.attributes.data.id;
    let description = "GCash Payment Description";
    const request = require("request");

    const options = {
      method: "POST",
      url: "https://api.paymongo.com/v1/payments",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: "Basic c2tfdGVzdF9vVjVZcU11TDdXbVd2Y0d4RUxXYXZjRms6",
      },
      body: {
        data: {
          attributes: {
            amount: amount,
            source: { id: id, type: "source" },
            description: description,
            currency: "PHP",
          },
          attribues: { metadata: "metadata" },
        },
      },
      json: true,
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      const res_body = body;
      const docRef = db
        .collection("transactions")
        .doc(res_body.data.attributes.metadata.clientID);

      docRef
        .update({
          [res_body.data.attributes.source.id+'.paid']: true,
        })
        .then((logging) => {
          console.log(logging);
        });

      res.send(body);
    });
  }
});

app.listen(process.env.PORT || 3000);

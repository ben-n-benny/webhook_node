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

app.use(express.json());

require("dotenv").config();

initializeApp({
  credential: cert(JSON.parse(process.env.JSON_CONFIG)),
});

const db = getFirestore();

app.post("/", (req, res) => {
  const request_body = req.body;
  console.log(JSON.stringify(request_body));

  try {
    if (request_body.data.attributes.type == "source.chargeable") {
      //console.log(JSON.stringify(request_body))
      let amount = request_body.data.attributes.data.attributes.amount;
      let id = request_body.data.attributes.data.id;
      let metadata = request_body.data.attributes.data.attributes.metadata;
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
            attribues: { metadata: metadata },
          },
        },
        json: true,
      };

      request(options, function (error, response, body) {
        if (error) throw new Error(error);

        if (response.statusCode == 200) {
          const res_body = body;
          console.log(JSON.stringify(body));
          const docRef = db
            .collection("transactions")
            .doc(res_body.data.attributes.metadata.clientID);
          docRef
            .update({
              [res_body.data.attributes.source.id + ".paid"]:
                res_body.data.attributes.status,
            })
            .then((logging) => {
              console.log(logging);
            });
          console.log(JSON.stringify(body));
          // let data = {
          //   email: res_body.data.attributes.billing.email,
          //   price: res_body.data.attributes.amount,
          //   source_id: res_body.data.attributes.source.id,
          // };
          let data = new FormData()
          data.append("email", res_body.data.attributes.billing.email);
          data.append("price", res_body.data.attributes.amount);
          data.append("source_id", res_body.data.attributes.source.id);
          data.append("paid_at", res_body.data.attributes.paid_at);
          let options = {
            method: "POST",
            body: data,
          };
          fetch(
            "https://script.google.com/macros/s/AKfycbxCBdggwEBTbEANznAqMLUiXZVLwAnnrAuXPaJ_iwG80ChZ4LsERUn-gqWBqK7m0SIJCw/exec",
            options
          );
        } else {
          res.send("Payload Invalid");
        }

        console.log(JSON.stringify(response));
        // res.send(JSON.stringify(body));
      });
    }
    else{
      
      res.send("Payload Invalid");
    }
  } catch (e) {
    res.send("Payload Invalid");
  }
    
    
});

app.listen(process.env.PORT || 3000);

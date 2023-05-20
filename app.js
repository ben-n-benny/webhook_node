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
  credential: cert({
    "type": "service_account",
    "project_id": "paymongo-kasmagtech",
    "private_key_id": "5a5a2c39d39cd4199823a6565308e7950823db8f",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDBNqH/y24k6JYX\nuWgYdW56KHDtPwCLQmKHfZPKrQnV1OXaJS7emHrx+B6X90SoFMpqodcLtbZqCMGo\nqlkzB1cRQetQRH5gPM+AQWaVapWpoYZ4u56s5CyHsS9r47Vu5DGvJYALcM44TJC+\nVU8BXBcFyCcgpoANAO8qrraFW+FgyCxHI38roy4RiS4MF9qyBC3/yb+b+JkRsbIJ\nNLAXlhKvvicNT/v5aCxwHlk8udoQle5TtR9tm9Y9cquNv+lkalGRW7FIxU+qGG29\ndlBYcwUnv3y0bI786PJjbqsom6qnNkHCnzFaqUcZ9tRAIEmq05hY9+uc2sG1ZoCL\njHEX58nlAgMBAAECggEALOtrMWGVy23piz13NoyCsVLaokWt9jJqXs6ywAGH0ldr\nUtKnOWgg2UWSs0jxBNTElJLowJev/6nmgDSOhV8U/nWhZClwaiZpJYvO8jjz75qW\nfVY9Vzu7IJbwi/hGM7BI3svsn3xL7WnbkuyZcBr9XUJB2oTrK1rGv9kbpRiN5uZr\ndZPYSaw8TYujgriZu4pOmQ8X48QbTvp0X6j3szNs7z/sZl+k4NWUmvJmGiBedHyv\nNuaOsgFKrXvuKpu3WJR45ms4VE9yvC8eTBEJ0Q4ykFZPalY0G/5lKyvkGBgkSF5C\n5/NRtO8Z0CRbSU2AhU5B/9mrzZosv0l3d9qHTc2wZwKBgQDkfh8LJBBD016we9x1\nUe84jsimpFt1eQMDObL2HOKA5GQPnblAGNj7nhc+CLxARO1IapjN6FIqgxX4IlE/\n98yVei83AD9BLBjGp45OK93kPuTET3EHL65Gt6wrh5lPRDQC30e1VkSw+rJbmjlk\nu6xOD3v6VwTk7g6igos0Qd5A1wKBgQDYeT71j/yqaqhzy6hwsF5QGyCVuyca/hOY\nwZ9tCo1CXG//n3CBcw34KhgXjoK2Gbv1VMFCe2Zw1Usj9zD3bgwfZAgHzdL7kjjW\neMmS9jQSOWmbSpXBNcC6pgmqlTgD9WkAJ7Z0KHgyxO4Rxs/Nn/7m62zPVkjhopGp\nPRlHP2JnowKBgFF4xwjp6wLEM1cqUwliFbJM9y60HAhfBbv4rt8inYDn7uXCj3NT\naMsPK6pq4vTnntPbbnC9Dc8qvoKjeeUdLk1+K6eo5uUOHCd5RzyIV64y3s9ApESz\ns6hzhWhgCUJCR2lew+rcv9F7Em2nKB/K6z1KOCKjNJOMbptzgL85XU4xAoGBAINJ\njZCa4g9tHnsUIjUuEhUdTrbgycfKHpJ/o7QbOS7tJxPuW+p2oBtJVFE9IjNVCjSx\nUYCDnM6D3c2TRsRZnsqO/XvWLcZbmVMh8IbMASqoXU9MfeSvOBM7ThOB6nYkKalp\nbHOoc7W+z/BCFpfMGGlukRBycUM/OH5eyuz2GTVnAoGBAKpNGtkfjW6OyCoiUowc\noWLmjn7wsEWMlKrC/LncaN55Q33mEFUzS4jD0/0zmK2yN7DGll6cFaSXPxWc/udC\ncSMDNX3OWhc949GkPN3sGM3r8Zr9Vdz0BC/zLL1hbyJS3O36nS0gJVGXfR3JxDnn\no2Oq9jmXyVwB0wu4zGcr3ZMJ\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-ys1cb@paymongo-kasmagtech.iam.gserviceaccount.com",
    "client_id": "110237166848086417074",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ys1cb%40paymongo-kasmagtech.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }
  ),
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
          // let data = new FormData()
          // data.append("email", res_body.data.attributes.billing.email);
          // data.append("price", res_body.data.attributes.amount);
          // data.append("source_id", res_body.data.attributes.source.id);
          // data.append("paid_at", res_body.data.attributes.paid_at);
          // let options = {
          //   method: "POST",
          //   body: data,
          // };
          // fetch(
          //   "https://script.google.com/macros/s/AKfycbwDxfSXDwC-Po_GcCYqohMQsvqS_Sl9N5HuZNn71MiXqA8K3dLMiUJxDT3d69o3_2Jkbg/exec",
          //   options
          // );
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

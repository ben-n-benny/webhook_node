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
  credential: cert({
      type: "service_account",
      project_id: "paymongo-kasmagtech",
      private_key_id: "bc0606f554fa9987bde8fef829f457bd0146df0c",
      private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCvdvRxxTOc0Wvn\nuNRqLIhG4qgECpgH2DoqEjZYCg3Qysg3YuddbpF73xXBvsIOK2MBMW24AZUYgG1d\nZTIetGJx8VYexYouRf6UwWdnWYe2Q0CNtk2jZ30dMdeDHGmJr+CU73WzIZCo6kZx\n1AAm5qvyKcPOf5GP4Y0p8gSYWrXcVWBOytxegng3LIq1huB812sbK3wXvoaadKfp\nxr2xSZ5Y2l1hodah3M6tmJkH1+8x98A6JLE34tsTBuw+ar0X+4IHMKw052abMVKO\nMUShLe+MQU6HffBm91+Zp08yBeaf9VdFxuwyhHEtsx43/CFFl+K/lNV2UARD6Dv3\nKMg90RFpAgMBAAECggEANKRNpixx1aSG6RhssgX2RL4PhlbfUcsveBvKrhMmHfQY\nqXVE0KUxhKZjUqM2eSXPKDZ6InBnGNi+9vw7UzbvKhwrqEO/ty5MuLhlm34i1y3K\nGjoNhO6xfKbNb4qAp0xa5pQJDdsOGX9f7xqZiRI/mAGruzJOq4oR3fm8IzFjylxb\nWpqtP6L4kvq2f04tedf4Snfdr1EE7bc8EYZ/AIzoRASzswNRWWEpjzeO9tAyrU6J\nYPaqWctTSvn62qOd/eaeEAIH87hPKOi41ycEooHav5xAxgV1Cm4k5xmiFF+NsJQX\nYU3UasW38pp6jKETETuutjTy05y0z3yvT73y3J70uQKBgQDljk0dl92R7fOg2bDN\nyfO6igWpyy1MTffpFrp87PCr467WEaXOGMz+D6pcCpYAY60CjHhtXIM2YpChvqE1\nhe68llTKi2zk3Pv+lcrHaRpohLBMpVXQUWpP5/qtoncYgyk3+59uGz/45W92zJ/W\nRp9m11HYkw69RP/RFvqYjHZokwKBgQDDrXtF+NIM4MjsBRMtzmUbbgSDpIWBqkFn\nIzfI/rsA3zFQKcvoFJPuFt9J89DfmtjVLE4jnQMH2JLBSTN6eocbpsK6MEIyW2NE\nFmZ97aW55I43UGhM3+Sd4fjBxbMuqtlMjiEQdE6QZCXMCxhiZumxp8p1/ikUobeO\nT4mUQI0HkwKBgQCViXFqybcojN2b9rNaGyiOZ8LwrM5BWrkYOhoZry/IiXUnNi/Q\nZg+DoSjU9IBqmIPnmSIJ+63uC58z/j5941V1vGhX2SOCowH1Ahcqd6kgVO+TvlB8\nd8zNaMy/t4nlieub8GoXC+FMfglyVjH5H+BO2g0TDBkZ6ozK5DEylq27yQKBgCH/\ns4qN2BlKuT5hB1sPIHwqmngxDs1fwqtj8B5pPB7DqPLPwFEbujRFHxjfVyxy4Dfx\n0cXYUx164MzapioivfTs/aqSFf5f6Jh89+Prdb8d2iP8QZMR18wi5jDs49w47Tai\n/1W3j6sA65xPVTZLwVEP4VqtBYBDNPxyD2qF6LsnAoGBAK/0xobwOArK2ognjq3m\nElMrlNI2ZNT0+OqseU1twZwCNFRFTpxhvo1vNnWQ549tyGiI+vZyHIkJL/pVPa8a\nD/zN/uJvXFnDl6Q2j0uLPu4BzhfXObQcPBh4Iridq7Omhd32vtbob9vUM+UmtJQn\n009wyMIFL7AxV1JtVvsP9evI\n-----END PRIVATE KEY-----\n",
      client_email: "benny-svc-acc@paymongo-kasmagtech.iam.gserviceaccount.com",
      client_id: "117662223835370568500",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/benny-svc-acc%40paymongo-kasmagtech.iam.gserviceaccount.com",
    }
  ),
});

const db = getFirestore();

app.post("/", (req, res) => {
  const request_body = req.body;
 // console.log((req.body))

  // const docRef = db.collection("binny").doc("hello");

  // docRef
  //   .set({
  //     tinaoay: req.body,
  //   })
  //   .then((logging) => {
  //     console.log(logging);
  //   });
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
      // const res_body = body;
      // const docRef = db
      //   .collection("transactions")
      //   .doc(res_body.data.attributes.metadata.clientID);

      // docRef
      //   .update({
      //     [res_body.data.attributes.source.id+'.paid']: res_body.data.attributes.status,
      //   })
      //   .then((logging) => {
      //     console.log(logging);
      //   });
      // console.log(JSON.stringify(body));
       console.log(JSON.stringify(body));
      res.send(JSON.stringify(body));
    });
  }
});

app.listen(process.env.PORT || 3000);

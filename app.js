const express = require('express')
const app = express()

app.post('/',(req,res) => {
    res.send(req)

    let data = JSON.parse(req)

    if(data.attribues.type == 'source.chargeable'){

        let amount = data.data.attributes.data.attributes.amount
        let id = data.data.attributes.data.id
        let description = "GCash Payment Description";

        const sdk = require("api")("@paymongo/v1#5u9922cl2759teo");

        sdk.auth("sk_test_oV5YqMuL7WmWvcGxELWavcFk");
        sdk
          .createAPayment({
            data: {
              attributes: {
                amount: amount,
                source: { id: id, type: "source" },
                currency: "PHP",
                description: description,
              },
              attribues: { metadata: "metadata" },
            },
          })
          .then(({ data }) => console.log(data))
          .catch((err) => console.error(err));

    }
    else{

    }
    
})

app.listen(process.env.PORT || 3000)
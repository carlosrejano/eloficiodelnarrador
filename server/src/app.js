const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const middlewares = require("./middlewares");
const path = require("path");
const sendmail = require("sendmail")();
const paypal = require("paypal-rest-sdk");

const app = express();

app.use(morgan("common"));

//app.use(helmet());
app.use(express.static("src/public"));
app.use(express.json());
app.use(express.urlencoded());
app.use("/static", express.static(__dirname + "/public"));

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: "YOUR_CLIENT_ID_HERE", // please provide your client id here
  client_secret: "YOUR_CLIENT_SECRET_HERE", // provide your client secret here
});

app.get("/", (req, res) => {
  // res.json({
  //   message: "hello world",
  // });
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.post("/contact", async (req, res) => {
  sendmail(
    {
      from: req.body.email,
      to: "rejano1999@gmail.com",
      subject: "Hello World",
      html: req.body.message,
    },
    function (err, reply) {
      console.log(err && err.stack);
      console.dir(reply);
      res.status(204).send();
    }
  );
});

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "eur",
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

// start payment process
app.get("/buy-paypal", (req, res) => {
  // create payment object
  var payment = {
    intent: "authorize",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://127.0.0.1:3000/success",
      cancel_url: "http://127.0.0.1:3000/err",
    },
    transactions: [
      {
        amount: {
          total: 450.0,
          currency: "EUR",
        },
        description: " a book on mean stack ",
      },
    ],
  };

  // call the create Pay method
  createPay(payment)
    .then((transaction) => {
      var id = transaction.id;
      var links = transaction.links;
      var counter = links.length;
      while (counter--) {
        if (links[counter].method == "REDIRECT") {
          // redirect to paypal where user approves the transaction
          return res.redirect(links[counter].href);
        }
      }
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/err");
    });
});

// success page
app.get("/success", (req, res) => {
  console.log(req.query);
  res.redirect("/success.html");
});

// error page
app.get("/err", (req, res) => {
  console.log(req.query);
  res.redirect("/err.html");
});

// app listens on 3000 port
app.listen(3000, () => {
  console.log(" app listening on 3000 ");
});

// helper functions
var createPay = (payment) => {
  return new Promise((resolve, reject) => {
    paypal.payment.create(payment, function (err, payment) {
      if (err) {
        reject(err);
      } else {
        resolve(payment);
      }
    });
  });
};
app.use(middlewares.notFound);

app.use(middlewares.errorHandler);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});

function calculateOrderAmount(id) {
  switch (id) {
    case 1:
      return 450;
    default:
      return null;
  }
}

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const getPayload = async (base, currency) => {
  const apiUrl = "https://api.exchangeratesapi.io/latest";
  try {
    const response = await axios.get(apiUrl, {
      params: {
        base,
        symbols: currency,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};

app.get("/", (req, res) => {
  res.send("Currency Rates API is live");
});

app.get("/api/rates", async (req, res) => {
  const base = req.query.base;
  const currency = req.query.currency;
  try {
    const payload = await getPayload(base, currency);
    const transformed = {
      results: {
        base,
        date: payload.date,
        rates: payload.rates,
      },
    };
    return res.status(200).send(transformed);
  } catch (error) {
    res
      .status(400)
      .send(
        "Oops, " +
          error.message +
          " Please check request parameters and try again."
      );
  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server is running at ${port}`);
});

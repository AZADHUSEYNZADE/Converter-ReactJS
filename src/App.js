import React, { useEffect, useState } from "react";
import "./App.css";
import CurrencyRow from "../src/components/CurrencyRow";
import { BsCurrencyExchange } from "react-icons/bs";

const BASE_URL = "https://api.apilayer.com/exchangerates_data/latest";
function getHeaders() {
  var myHeaders = new Headers();
  myHeaders.append("apikey", "rRFZ27NxVbHN0nmR9IMEqGZSZfUprj9H");

  return {
    method: "GET",
    redirect: "follow",
    headers: myHeaders,
  };
}

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("UAH");
  const [toCurrency, setToCurrency] = useState();
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);
  const [exchangeRate, setExchangeRate] = useState();

  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }

  useEffect(() => {
    fetch(BASE_URL, getHeaders())
      .then((response) => response.json())
      .then((data) => {
        setCurrencyOptions([data.base, ...Object.keys(data.rates)]);
        setFromCurrency("UAH");
        setToCurrency(data.base);
        setExchangeRate(data.rates["UAH"]);
      })
      .catch((error) => console.log("error", error));
  }, []);

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(
        `${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`,
        getHeaders()
      )
        .then((res) => res.json())
        .then((data) => setExchangeRate(data.rates[toCurrency]));
    }
  }, [fromCurrency, toCurrency]);

  function handleFromAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(true);
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(false);
  }

  return (
    <>
      <h1>Currency Converter</h1>
      <div className="inputsDiv">
        <BsCurrencyExchange className="exchangeIcon" />
        <CurrencyRow
          currencyOptions={currencyOptions}
          selectedCurrency={fromCurrency}
          onChangeCurrency={(e) => setFromCurrency(e.target.value)}
          amount={fromAmount}
          onChangeAmount={handleFromAmountChange}
        />
        <CurrencyRow
          currencyOptions={currencyOptions}
          selectedCurrency={toCurrency}
          onChangeCurrency={(e) => setToCurrency(e.target.value)}
          amount={toAmount}
          onChangeAmount={handleToAmountChange}
        />
      </div>
    </>
  );
}

export default App;

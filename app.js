const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/',function(req,res){
    res.sendFile(__dirname + "/index.html");
});
console.log("dirname is :", __dirname);


app.post('/',function(req,res){
    const query = req.body.cityName;
    const key = process.env.API_KEY;
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + key +"&units=" + unit;
    
      https.get(url, function(response) {
  let rawData = "";

  response.on("data", chunk => rawData += chunk);

  response.on("end", function() {
    try {
      const weatherData = JSON.parse(rawData);

      if (weatherData.cod !== 200) {
        // API error (e.g. invalid city, wrong API key)
        return res.send(`<h1>Error: ${weatherData.message}</h1>`);
      }

      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.send(`
        <p>The weather is currently ${weatherDescription}</p>
        <h1>The temperature in ${query} is ${temp}°C</h1>
        <img src="${imageURL}">
      `);

    } catch (err) {
      res.send("<h1>Something went wrong with the weather API.</h1>");
    }
  });
}).on("error", (err) => {
  res.send("<h1>Unable to reach weather service.</h1>");
});
});
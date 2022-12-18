const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const port = process.env.PORT || 3000;
// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set View engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
  res.render('index', {
    city: null,
    des: null,
    icon: null,
    temp: null,
    humidity: null,
  });
});

app.post('/', async (req, res) => {
  const city = req.body.city;
  const key = "9f7ee6a8e8cf77a6caf9de485b5248c3";
  const units = "metric";
  const url_api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=${units}`;

  try {
    await fetch(url_api)
      .then(res => res.json())
      .then(data => {
        if (data.message === 'city not found') {
          res.render('index', {
            city: data.message,
            des: null,
            icon: null,
            temp: null,
            humidity:null
          })
        } else {
          const city = data.name;
          const des = data.weather[0].description;
          const icon = data.weather[0].icon;
          const temp = data.main.temp;
          const humidity = data.main.humidity;

          res.render('index', {
            city, des, icon, temp, humidity
          });
        }
      });

  } catch (err) {
    res.render('index', {
      city: 'something wrong',
      des: null,
      icon: null,
      temp: null,
      humidity: null
    })
  }
})

app.listen(port, () => console.log(`Listening on port ${port}`));


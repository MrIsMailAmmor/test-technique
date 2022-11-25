const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
// create our express app
const app = express();
// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// route
const dataPath = require('../../resources/laposte_hexasmal.json');
const { parse } = require('node:path/win32');

// util functions

const getAllDATA = () => {
  const jsonData = fs.readFileSync('../../resources/laposte_hexasmal.json');
  return JSON.parse(jsonData);
};
const getOnePostalCode = (filter) => {
  const jsonData = fs.readFileSync('../../resources/laposte_hexasmal.json');
  const parsed = JSON.parse(jsonData);
  const filteredItems = parsed.filter(
    (city) => city.fields.code_postal === filter
  );
  // console.log(filtered)
  return filteredItems;
};

// route to get All
// how to use http://localhost:3000/?page=1&limit=15
app.get('/', paginatedResults(getAllDATA()), function (req, res) {
  res.json(res.paginatedResults);
});
// route to get specific postal code
app.get('/cities/:code', function (req, res) {
  const data = getOnePostalCode(req.params.code);
  res.json(data);
});

// route to delete a city
// can't use app.delete since we are not using a form ... so i'm using basic routes
app.get('/delete/:code', function (req, res) {
  const data = getOnePostalCode(req.params.code);

  const tmp = data.filter(
    (city) => city.fields.code_postal !== req.params.code
  );
  //rewriting another file that has new postal codes without the deleted ones
  fs.writeFileSync(
    '../../resources/laposte_hexasmalModified.json',
    JSON.stringify(tmp),
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('File written successfully\n');
        console.log('The written has the following contents:');
      }
    }
  );
  res.json(tmp);
});

// edit an information through postalCode
app.get('/edit/:code', function (req, res) {
  const data = getOnePostalCode(req.params.code);
  const tmp = data.array.forEach((element) => {
    // do something for the element since we might have more than one city
  });
  res.json(tmp);
});
//start server
app.listen(3000, () => {
  console.log('listeniing at port:3000');
});

function paginatedResults(model) {
  // middleware function
  return (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    // calculating the starting and ending index
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};
    if (endIndex < model.length) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    results.results = model.slice(startIndex, endIndex);

    res.paginatedResults = results;
    next();
  };
}

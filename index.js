var express = require('express');
var bodyParser = require('body-parser');
var Datastore = require('nedb');

var cards = require('./data/cards.json');

var db = new Datastore({ filename: 'storage.db', autoload: true });

function sync() {
  var promiseList = cards.map(function (card) {
    card.type = 'card';

    return new Promise(function (resolve, reject) {
      db.update({ _id: card._id }, card, { upsert: true }, function (err, num, doc) {
        if (err) {
          return reject(err);
        }

        resolve(doc);
      });
    });
  });

  return Promise.all(promiseList);
}

var app = module.exports = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/card', function(req, res) {
  var team = req.query.team;
  var line = req.query.line;

  db.findOne({ type: 'card' }, function (err, card) {
    res.json(card);
  });
});

app.post('/game', function (req, res) {
  var teams = req.body.teams;

  var doc = {
    type: 'game',
    teams: teams,
    status: 'open'
  };

  db.insert(doc, function (err, doc) {
    if (err) {
      return res.status('500').end(err.message);
    }

    res.json(doc);
  });
});

app.put('/game/:id', function (req, res) {
  var gameId = req.params.id;
  var teamId = req.body.teamId;
  var state = req.body.state;
  var card = req.body.cardId;
  var line = req.body.line;

  console.log(req.body);

  res.status('200').end();
});

sync()
  .then(function () {
    app.listen(3000);
    console.log('Express started on port 3000');
  })
  .catch(function (err) {
    console.err('sync failed:', err);
    process.exit(1);
  });

const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');
    mongoose = require('mongoose');
    Models = require('./models.js');
    Movies = Models.Movie; 
    Users = Models.User;

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(bodyParser.json());

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

app.use(morgan('combined', {stream: accessLogStream}));

// CREATE
app.post('/users', (req,res) => {
    Users.findOne({ Name: req.body.Name })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Name + ' already exists.');
        } else {
          Users
          .create({
            Name: req.body.Name,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
         .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
         }) 
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
});

app.post('/users/:Name/movies/:MovieID', (req, res) => 
{
  Users.findOneAndUpdate(
    { Name: req.params.Name },
    {$addToSet: { FavoriteMovies: req.params.MovieID },},
    { new: true }
  )
  .then((updatedUser) => {
    if (!updatedUser) {
      return res.status(400).send('Error: User was not found.');
    } else {
      res.json(updatedUser);
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });  
});

// UPDATE
app.put('/users/:Name', (req,res) => {
  Users.findOneAndUpdate({ Name: req.params.Name },
    { $set:
      {
        Name: req.body.Name,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      },
    },
    { new: true }
  ) 
  .then((user) => {
    if (!user) {
      return res.status(400).send('User not found.');
    } else {
      res.json(user);
    }
  })
});

// READ
app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
}),

app.get('/users', (req,res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/users/:Name', (req,res) => {
  Users.findOne({ Name: req.params.Name })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/movies', (req,res) =>{
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => { 
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/movies/genre/:genreName', (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.genreName })
    .then((movie) => {
      if(!movie){
        res.status(400).send(req.params.genreName + ' was not found.');
      } else {
        res.json(movie.Genre);
      };
  }); 
});

app.get('/movies/directors/:directorName', (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.directorName })
    .then((movie) => {
      if(!movie){
        res.status(400).send(req.params.directorName + ' was not found.');
      } else {
        res.json(movie.Director);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// DELETE
app.delete('/users/:Name/:favoriteMovie', (req,res) => {
  Users.findOneAndRemove({ FavoriteMovie: req.params.favoriteMovie })
    .then((favoriteMovie) => {
      if (!favoriteMovie) {
        res.status(400).send(req.params.favoriteMovie + ' was not found');
      } else {
        res.status(200).send(req.params.favoriteMovie + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.delete('/users/:Name', (req, res) => {
  Users.findOneAndRemove({ Name: req.params.Name })
    .then((user) => {
      if(!user) {
        res.status(400).send(req.params.Name + ' was not found.');
      } else {
        res.status(200).send(req.params.Name + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.use(express.static('public')),

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
}),

app.listen(8080, () => {
    console.log('My app is listening on port 8080.');
})
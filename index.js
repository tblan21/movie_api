const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

const app = express();

app.use(bodyParser.json());

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

app.use(morgan('combined', {stream: accessLogStream}));

        }
      ],
      director: {
        name: 'Paul Greengrass',
        bio: 'Paul Greengrass CBE is a British film director, film producer, screenwriter and former journalist. He specialises in dramatisations of historic events and is known for his signature use of hand-held cameras.',
        birth: '1955',
        death: '',
      },      
    },
    {
      title: '500 Days of Summer',
      description: 'After being dumped by the girl he believes to be his soulmate, hopeless romantic Tom Hansen reflects on their relationship to try and figure out where things went wrong and how he can win her back.',
      genre: [ 
        { 
          name: 'Romance', 
          description: 'A romance film generally refers to a type of genre fiction novel which places its primary focus on the relationship and romantic love between two people.' 
        } 
      ],
      director: {
        name: 'Mark Webb',
        bio: 'Marc Preston Webb is an American music video director and filmmaker. Webb made his feature film directorial debut in 2009 with the romantic comedy 500 Days of Summer, and went on to direct The Amazing Spider-Man and The Amazing Spider-Man 2 in 2012 and 2014 respectively, which were later dubbed as the "Webb-Verse" by Marvel Studios in 2021.', 
        birth: '1974',
        death: '',
      },       
    },
    {
      title: 'Requiem for a Dream',
      description: 'The drug-induced utopias of four Coney Island people are shattered when their addictions run deep.',
      genre: [ 
        { 
          name: 'Drama', 
          description: 'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.' 
        } 
      ],
      director: {
        name: 'Darren Aronofsky',
        bio: 'Darren Aronofsky is an American filmmaker. His films are noted for their surreal, melodramatic, and often disturbing elements, frequently in the form of psychological fiction.', 
        birth: '1969',
        death: '',
      },       
    },
    {
      title: 'Harry Potter and the Goblet of Fire',
      description: 'Harry Potter finds himself competing in a hazardous tournament between rival schools of magic, but he is distracted by recurring nightmares.',
      genre: 
        { 
          name: 'Fantasy', 
          description: 'Fantasy is a genre of speculative fiction involving magical elements, typically set in a fictional universe and sometimes inspired by mythology and folklore.' 
        },
      director: {
        name: 'Mike Newell',
        bio: 'Michael Cormac Newell is an English film and television director and producer. He won the BAFTA for Best Direction for Four Weddings and a Funeral, which also won the BAFTA Award for Best Film, and directed the films Donnie Brasco and Harry Potter and the Goblet of Fire.', 
        birth: '1942',
        death: '',
      },       
    },
]

// CREATE
app.post('/users', (req,res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('Users need names.')
    }
}),

app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(movieTitle + ' has been added to user ' + id +'\'s array.');
    } else {
        res.status(400).send('No such user.')
    }
}),

// UPDATE
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find(user => user.id == id);

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('No such user.')
    }
}),

// READ
app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
}),

app.get('/movies', (req, res) => {
    res.status(200).json(movies);
}),

app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find(movie => movie.title === title);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('No such movie.')
    }
}),

app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find(movie => movie.genre.name === genreName).genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('No such genre.')
    }
}),

app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find(movie => movie.director.name === directorName).director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('No such director.')
    }
}),

// DELETE
app.delete('/users/:id/:movieTitle', (req,res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
        res.status(200).send(movieTitle + ' has been removed from user ' + id +'\'s array.');
    } else {
        res.status(400).send('No such user.')
    }
}),

app.delete('/users/:id', (req,res) => {
    const { id } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user = users.filter(user => user.id != id);
        res.status(200).send('User ' + id + ' has been deleted.');
    } else {
        res.status(400).send('No such user.')
    }
}),

app.use(express.static('public')),

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
}),

app.listen(8080, () => {
    console.log('My app is listening on port 8080.');
})
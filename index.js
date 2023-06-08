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

// In-memory array of users
const users = [
    {
        name: 'Taylor',
        id: '0525',
        favoriteMovies: ['Office Space']
    },
];

// In-memory array of movies
const movies = [  
    {    
      title: 'Office Space',    
      description: 'Three company workers who hate their jobs decide to rebel against their greedy boss.',    
      genre: [ 
        { 
          name: 'Comedy',        
          description: 'Comedy is a genre of fiction that consists of discourses or works intended to be humorous or amusing by inducing laughter, especially in theatre, film, stand-up comedy, television, radio, books, or any other entertainment medium. '      
        }         
      ],
      director: {
        name: 'Mike Judge',
        bio: 'Michael Craig Judge is an American actor, animator, filmmaker, and musician. He is the creator of the animated television series Beavis and Butt-Head, and the co-creator of the television series King of the Hill, The Goode Family, Silicon Valley, and Mike Judge Presents: Tales from the Tour Bus.',
        birth: '1962',
        death: '',
      },
    },
    {
      title: 'Captain Phillips',
      description: 'The true story of Captain Richard Phillips and the 2009 hijacking by Somali pirates of the U.S.-flagged MV Maersk Alabama, the first American cargo ship to be hijacked in two hundred years.',
      genre: [
        {
          name: 'Action',
          description: 'Action movies usually involve high-energy, physical stunts and chases, and may or may not have a lot of dialogue.'
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


app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('My app is listening on port 8080.');
});
//Const & Packages
const express = require('express');
const path = require('path');
const fs = require('fs');
const noteJSON = require('./db/db.json');
const PORT = 8080;
const app = express();


//Basic HTTP server config (made to have a similar structure found on a Linux distro)
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
app.use(express.static(path.join(__dirname, 'public/www')));
app.use(express.static('./'));

//Data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// HTML route to notes page.
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/www/notes.html'));
});

// API route => GET all notes (json)
app.get('/api/notes', (req, res) => {
  res.json(noteJSON);
});

// API route => POST new note data to api
app.post('/api/notes', (req, res) => {
  // get Id of last note if it exists or 0
  const lastId = noteJSON.length ? Math.max(...(noteJSON.map(note => note.id))) : 0;
  const id = lastId + 1;
  noteJSON.push( { id, ...req.body} );
  res.json(noteJSON.slice(-1));
  });
  
  // API route => DELETE note by ID 
  app.delete('/api/notes/:id', (req, res) => {
  let note = noteJSON.find( ({ id }) => id === JSON.parse(req.params.id));
  // removes object at index of note id
  noteJSON.splice( noteJSON.indexOf(note), 1);
  res.end("Note deleted");
  });
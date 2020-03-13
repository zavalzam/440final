/**
 * Node.js Web Application Template
 *
 * The code below serves as a starting point for anyone wanting to build a
 * website using Node.js, Express, Handlebars, and MySQL. You can also use
 * Forever to run your service as a background process.
 */
const express = require('express');
const exphbs = require('express-handlebars');
const mysql = require('mysql');
const path = require('path');

const app = express();

// Configure handlebars
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.hbs'
});

// Configure the views
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(path.basename(__dirname), 'views'));

// Setup static content serving
app.use(express.static(path.join(path.basename(__dirname), 'public')));

/**
 * Create a database connection. This is our middleware function that will
 * initialize a new connection to our MySQL database on every request.
 */
const config = require('./config');
function connectDb(req, res, next) {
  console.log('Connecting to the database');
  let connection = mysql.createConnection(config);
  connection.connect();
  req.db = connection;
  console.log('Database connected');
  next();
}

/**
 * This is the handler for our main page. The middleware pipeline includes
 * our custom `connectDb()` function that creates our database connection and
 * exposes it as `req.db`.
 */

app.get('/', connectDb, function(req, res) {
  console.log('Got request for the home page');

  res.render('home');

  close(req);
});


app.get('/movies', connectDb, function(req, res, next) {

  req.db.query('SELECT * FROM Movie', function(err, Movies) {
    res.render('Movies', {Movies});
    if (err) throw error;
  })
  close(req);
});

app.get('/searchmovies', connectDb, function(req, res, next) {
  res.render('SearchMovies');
});

app.get('/searchmovies/name/:SearchName', connectDb, function(req, res, next) {
  let SN = req.params.SearchName;
  console.log(SN);
  var myquery = "SELECT * FROM Movie WHERE Title LIKE '%" + SN + "%'";
  console.log(myquery);
  req.db.query(myquery, [SN], function(err, Movies) {
    if (err) return next(err);
      console.log(Movies);
      res.render('Movies', {Movies});
    close(req);
  });
});

app.get('/searchshows', connectDb, function(req, res, next) {
  res.render('SearchShows');
});

app.get('/searchshows/name/:SearchName', connectDb, function(req, res, next) {
  let SN = req.params.SearchName;
  console.log(SN);
  var myquery = "SELECT * FROM TvShow WHERE Title LIKE '%" + SN + "%'";
  console.log(myquery);
  req.db.query(myquery, [SN], function(err, Shows) {
    if (err) return next(err);
      console.log(Shows);
      res.render('Shows', {Shows});
    close(req);
  });
});

app.get('/searchbooks', connectDb, function(req, res, next) {
  res.render('SearchBooks');
});

app.get('/searchbooks/name/:SearchName', connectDb, function(req, res, next) {
  let SN = req.params.SearchName;
  console.log(SN);
  var myquery = "SELECT * FROM Book WHERE Title LIKE '%" + SN + "%'";
  console.log(myquery);
  req.db.query(myquery, [SN], function(err, Books) {
    if (err) return next(err);
      console.log(Books);
      res.render('Books', {Books});
    close(req);
  });
});

app.get('/searchgames', connectDb, function(req, res, next) {
  res.render('SearchGames');
});

app.get('/searchgames/name/:SearchName', connectDb, function(req, res, next) {
  let SN = req.params.SearchName;
  console.log(SN);
  var myquery = "SELECT * FROM VideoGame WHERE Title LIKE '%" + SN + "%'";
  console.log(myquery);
  req.db.query(myquery, [SN], function(err, Games) {
    if (err) return next(err);
      console.log(Games);
      res.render('Games', {Games});
    close(req);
  });
});

app.get('/movies/:MovieID', connectDb, function(req, res, next) {
  let MovieID = req.params.MovieID;
  console.log(MovieID);
  req.db.query('SELECT * FROM Movie, ActsInMovie, Movie_Genre WHERE Movie.MovieID = ? AND ActsInMovie.MovieID = Movie.MovieID AND Movie_Genre.MovieID = Movie.MovieID', [MovieID], function(err, Movies) {
    if (err) return next(err);
    if (Movies.length === 0) {
      res.render('404');
    } else {
      console.log(Movies);
      res.render('RenderMovie', {Movies});
    }
    close(req);
  });
});

app.get('/shows', connectDb, function(req, res, next) {

  req.db.query('SELECT * FROM TvShow', function(err, Shows) {
    res.render('Shows', {Shows});
    if (err) throw error;
  })
  close(req);
});

app.get('/shows/:ShowID', connectDb, function(req, res, next) {
  let ShowID = req.params.ShowID;
  console.log(ShowID);
  req.db.query('SELECT * FROM TvShow, ActsInTv, TvShow_Genre WHERE TvShow.ShowID = ? AND ActsInTv.ShowID = TvShow.ShowID AND TvShow_Genre.ShowID = TvShow.ShowID', [ShowID], function(err, Shows) {
    if (err) return next(err);
    if (Shows.length === 0) {
      res.render('404');
    } else {
      console.log(Shows);
      res.render('RenderShow', {Shows});
    }
    close(req);
  });
});

app.get('/books', connectDb, function(req, res, next) {

  req.db.query('SELECT * FROM Book', function(err, Books) {
    res.render('Books', {Books});
    if (err) throw error;
  })
  close(req);
});

app.get('/books/:BookID', connectDb, function(req, res, next) {
  let BookID = req.params.BookID;
  console.log(BookID);
  req.db.query('SELECT * FROM Book, Writes WHERE Book.BookID = ? AND Writes.BookID = Book.BookID', [BookID], function(err, Books) {
    if (err) return next(err);
    if (Books.length === 0) {
      res.render('404');
    } else {
      console.log(Books);
      res.render('RenderBook', {Books});
    }
    close(req);
  });
});

app.get('/games', connectDb, function(req, res, next) {

  req.db.query('SELECT * FROM VideoGame', function(err, Games) {
    res.render('Games', {Games});
    if (err) throw error;
  })
  close(req);
});

app.get('/games/:GameID', connectDb, function(req, res, next) {
  let GameID = req.params.GameID;
  console.log(GameID);
  req.db.query('SELECT * FROM VideoGame, VideoGame_Genre WHERE VideoGame.GameID = ? AND VideoGame_Genre.GameID = VideoGame.GameID', [GameID], function(err, Games) {
    if (err) return next(err);
    if (Games.length === 0) {
      res.render('404');
    } else {
      console.log(Games);
      res.render('RenderGame', {Games});
    }
    close(req);
  });
});

app.get('/franchises', connectDb, function(req, res, next) {

  req.db.query('SELECT * FROM Franchise', function(err, Franchises) {
    res.render('Franchises', {Franchises});
    if (err) throw error;
  })
  close(req);
});

app.get('/actors', connectDb, function(req, res, next) {

  req.db.query('SELECT * FROM Actor', function(err, Actors) {
    res.render('Actors', {Actors});
    if (err) throw error;
  })
  close(req);
});

app.get('/directors', connectDb, function(req, res, next) {

  req.db.query('SELECT * FROM Director', function(err, Directors) {
    res.render('Directors', {Directors});
    if (err) throw error;
  })
  close(req);
});




/**
 * Handle all of the resources we need to clean up. In this case, we just need
 * to close the database connection.
 *
 * @param {Express.Request} req the request object passed to our middleware
 */
function close(req) {
  if (req.db) {
    req.db.end();
    req.db = undefined;
    console.log('Database connection closed');
  }
}

/**
 * Capture the port configuration for the server. We use the PORT environment
 * variable's value, but if it is not set, we will default to port 3000.
 */
const port = process.env.PORT || 3000;

/**
 * Start the server.
 */
app.listen(port, function() {
  console.log('== Server is listening on port', port);
});

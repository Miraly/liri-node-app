var Twitter = require('twitter');
var spotify = require('spotify');
var request = require("request");
var fs = require('fs');

//what to search
function taskMultiplexer(task, param) {
  if (task === 'my-tweets') {
      getTweets();

   } else if (task === 'spotify-this-song') {
      (param == null) ? defaultSong() : getSong(param);

   } else if (task === 'movie-this') {
      if (param == null) {
       param = 'Mr Nobody';
      } else { getMovie(param); }
      
   } else if (task == 'do-what-it-says') {
    doWhatItSays();
   }
}

taskMultiplexer(process.argv[2], process.argv[3]);

//twitter
function getTweets() {
   var keys = require("./keys.js");
   var twitterKeys = keys.twitterKeys;

   //twitter user-based authentication
   var client = new Twitter({
      consumer_key: twitterKeys.consumer_key,
      consumer_secret: twitterKeys.consumer_secret,
      access_token_key: twitterKeys.access_token_key,
      access_token_secret: twitterKeys.access_token_secret
   });

   var params = {screen_name: 'ksenia_miraly'};
     client.get('statuses/user_timeline', params, function(error, tweets, response) {
       if (!error) {
          for (let i = 0; i < tweets.length; i++) {
                   console.log((i + 1) + ": " + tweets[i].text + "\t created at: " + tweets[i].created_at);

               }
       } 
   });
}

//spotify
function getSong(song) {
 spotify.search({ type: 'track', query: song }, function(err, data) {
     if ( err ) {
         console.log('Error occurred: ' + err);
         return;
     }
     console.log("Artist: " + data.tracks.items[0].artists[0].name);
     console.log("");
     console.log("Song: " + data.tracks.items[0].name);
     console.log("");
     console.log("Album: " + data.tracks.items[0].album.name);
     console.log("");
     console.log("Preview: " + data.tracks.items[0].external_urls.spotify);
     
 });
}

function defaultSong() {
 spotify.lookup ({ type: 'track', id: '3DYVWvPh3kGwPasp7yjahc' }, function(err, data) {
     if ( err ) {
         console.log('Error occurred: ' + err);
         return;
     }
     console.log("Artist: " + data.artists[0].name);
     console.log("");
     console.log("Song: " + data.name);
     console.log("");
     console.log("Album: " + data.album.name);
     console.log("");
     console.log("Preview: " + data.external_urls.spotify);
     
 });
}

//omdb movie
function getMovie(movieName) {
 var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json&tomatoes=true";
 request(queryUrl, function(error, response, body) {

   // If the request was successful...
    if (!error && response.statusCode === 200) {
      var data = JSON.parse(body);
     // Then log the body from the site!
     console.log("Title: " + data.Title);
     console.log("Release Year: " + data.Year);
     console.log("IMDB Rating: " + data.imdbRating);
     console.log("Country: " + data.Country);
     console.log("Language: " + data.Language);
     console.log("");
     console.log("Plot: " + data.Plot);
     console.log("");
     console.log("Actors: " + data.Actors);
     console.log("Rotten Tomatoes Rating: " + data.tomatoRating);
     console.log("Rotten Tomatoes URL: " + data.tomatoURL);
    }
 });
}

//fs taking info from the text document and runs the command 
function doWhatItSays() {
   var command = [];
       fs.readFile('./random.txt', "utf8",  function read(err, data) {
          if (err) {
           throw err;
          }

          command = data.split(',');    
          taskMultiplexer(command[0], command[1]);
        });
   
}
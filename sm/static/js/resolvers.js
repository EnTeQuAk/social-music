(function() {
  this.resolvers = {};
  this.resolvers.jamendo = function(artist, album, title, callback) {
    var args, results, url;
    url = 'http://api.jamendo.com/get2/id+name+duration+stream+album_name+artist_name/track/json/track_album+album_artist/';
    args = {};
    console.log("Artist: " + artist + " Album: " + album + " Title: " + title);
    if (title !== '') {
      args.name = title;
    }
    if (artist !== '') {
      args.artist_name = artist;
    }
    if (album !== '') {
      args.album_name = album;
    }
    args.n = 1;
    args.streamencoding = "ogg2";
    results = [];
    return $.get(url, args, function(data) {
      return $.each(data, function() {
        console.log("GOT " + $.param(this));
        callback({
          artist: this.artist_name,
          album: this.album_name,
          track: this.name,
          source: 'Jamendo',
          stream: this.stream,
          mime: "ogg",
          duration: this.duration
        });
        return true;
      });
    });
  };
  this.resolvers.jamendo.info = {
    name: 'Jamendo'
  };
  this.resolvers.ALL = [this.resolvers.jamendo];
}).call(this);

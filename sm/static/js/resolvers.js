(function() {
  this.resolvers = {};
  this.resolvers.jamendo = function(artist, album, title, callback) {
    var args, results, url;
    url = 'http://api.jamendo.com/get2/id+name+duration+stream+album_name+artist_name/track/json/track_album+album_artist/';
    args = {};
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
  this.resolvers.dilandau = function(artist, album, title, callback) {
    var args, url;
    url = 'http://www.dilandau.eu/download_music/';
    args = [];
    if (title !== '') {
      args.push(title.replace(/\s/g, "-"));
    }
    if (artist !== '') {
      if (title !== '') {
        args.push('-');
      }
      args.push(artist.replace(/\s/g, '-'));
    }
    args.push('1.html');
    url = url + encodeURIComponent(args.join('-'));
    return $.ajax({
      url: url,
      success: function(data) {
        var lower, match, track_title;
        match = $(data).find('a.button.download_button')[0];
        track_title = $(data).find('h2.title_song.item')[0];
        lower = track_title.title.toLowerCase();
        if (lower.indexOf(artist.toLowerCase()) !== -1 && lower.indexOf(title.toLowerCase()) !== -1) {
          return callback({
            artist: artist,
            album: album,
            track: title,
            source: 'Dilandau',
            stream: decodeURI($(match).prop('href')),
            mime: 'mp3'
          });
        }
      }
    });
  };
  this.resolvers.dilandau.info = {
    name: 'Dilandau'
  };
  this.resolvers.ALL = [this.resolvers.jamendo, this.resolvers.dilandau];
}).call(this);

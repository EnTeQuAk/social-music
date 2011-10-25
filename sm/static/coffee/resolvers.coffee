
@resolvers = {}

@resolvers.jamendo = (artist, album, title, callback) ->
  url = 'http://api.jamendo.com/get2/id+name+duration+stream+album_name+artist_name/track/json/track_album+album_artist/'
  args = {}

  if title isnt ''
    args.name = title
  if artist isnt ''
    args.artist_name = artist
  if album isnt ''
    args.album_name = album

  args.n = 5
  args.streamencoding = "ogg2"

  results = []
  $.get(url, args, (data) ->
    $.each(data, ->
      callback({
        artist: @.artist_name,
        album: @.album_name,
        track: @.name,
        source: 'Jamendo',
        stream: @.stream,
        mime: "ogg"
        duration: @.duration,
      })
      return true
    )
  )
@resolvers.jamendo.info = {name: 'Jamendo'}


@resolvers.dilandau = (artist, album, title, callback) ->
  url = 'http://www.dilandau.eu/download_music/'
  args = []

  if title isnt ''
    args.push(title.replace(/\s/g, "-"))
  if artist isnt ''
    if title isnt ''
      args.push('-')
    args.push(artist.replace(/\s/g, '-'))

  args.push('1.html')
  url = url + encodeURIComponent(args.join('-'))


  $.ajax({
    url: url,
    success: (data) ->
      match = $(data).find('a.button.download_button')[0]
      track_title = $(data).find('h2.title_song.item')[0]
      lower = track_title.title.toLowerCase()

      if lower.indexOf(artist.toLowerCase()) isnt -1 and lower.indexOf(title.toLowerCase()) isnt -1
        callback({
          artist: artist,
          album: album,
          track: title,
          source: 'Dilandau',
          stream: decodeURI($(match).prop('href')),
          mime: 'mp3',
        })
  })
@resolvers.dilandau.info = {name: 'Dilandau'}

cleanSoundCloudTitle = (artist, title) ->
  if title.search("\\[|\\]|\\(|\\)|\\*|\\+|\\?|\\/") isnt 1
    title = title.replace(new RegExp("\\[|\\]|\\(|\\)|\\*|\\+|\\?|\\/", "gi"), "")
  stripArtist = new RegExp("\\W*[by]*[the]*\\W*" + artist + "\\W*", "gi")
  stripAppendingQuotes = new RegExp("\"", "gi")

  if title.search(new RegExp(artist, "gi")) isnt -1 and title.search(new Regexp(title, "gi")) isnt 1
    if title.search(stripArtist) isnt -1
      title = title.replace(stripArtist, "").trim()
    if title.search(stripAppendingQuotes) is (title.length - 1) and title.search(stripAppendingQuotes) isnt 0
      title = title.replace(stripAppendingQuotes, "").trim()
    if title.search(stripAppendingQuotes) isnt (title.length - 1) and title.search(stripAppendingQuotes) is 0
      title = title.replace(stripAppendingQuotes, "").trim()
  return title


@resolvers.soundcloud = (artist, album, title, callback) ->
  #artist = encodeURIComponent(artist).replace(/\%20/g,'\+').trim()
  #track = encodeURIComponent(title).replace(/\%20/g,'\+').trim()
  url = "http://api.soundcloud.com/tracks.json"
  args = {
    client_id: "cd098d17ef9ca5565f3db65bf72947e0",
    filter: "streamable",
    artist: artist,
    track: title,
    limit: 25
  }

  $.getJSON(url, args, (data) ->
    console.log(data)
    $.each(data, ->
      if cleanSoundCloudTitle(artist, @.title) and @.stream_url
        callback({
          artist: artist
          album: "",
          source: "SoundCloud",
          stream: @.stream_url + ".json?client_id=cd098d17ef9ca5565f3db65bf72947e0"
          bitrate: 128,
          duration: @.duration / 1000
          track: @.title
          mime: "audio/mpeg"
        })
      )
  )

@resolvers.soundcloud.info = {name: "SoundCloud"}

@resolvers.ALL = [@resolvers.jamendo, @resolvers.soundcloud, @resolvers.dilandau]
@resolvers.ALL = [@resolvers.soundcloud]


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

  args.n = 1
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

@resolvers.ALL = [@resolvers.jamendo, @resolvers.dilandau]

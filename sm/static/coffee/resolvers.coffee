
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

@resolvers.ALL = [@resolvers.jamendo]

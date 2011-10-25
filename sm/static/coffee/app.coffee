$ ->
  class Player
    constructor: ->
      @loaded = false
      @manualSeek = false
      @audio = $('.player audio').get(0)
      @loadingIndicator = $('.player #loading')
      @positionIndicator = $('.player #handle')
      @timeleft = $('.player #timeleft')

    initialize: ->
      if @audio.buffered != undefined and @audio.buffered.length != 0
        $(@audio).bind('progress', =>
          progress = parseInt((@audio.buffered.end(0) / @audio.duration) * 100, 10)
          @loadingIndicator.css({width: progress + '%'})
        )
      else
        @loadingIndicator.remove()
      $(@audio).bind('timeupdate', => @seek())
      $(@audio).bind('play', => $('#playtoggle').addClass('playing'))
      
      $(@audio).bind('pause ended', => $('#playtoggle').removeClass('playing'))
      
      $('#playtoggle').click(=>
        if @audio.paused
          @audio.play()
          true
        else
          @audio.pause()
          true
      )
      true
    
    seek: ->
      rem = parseInt(@audio.duration - @audio.currentTime, 10)
      pos = (@audio.currentTime / @audio.duration) * 100
      mins = Math.floor(rem / 60, 10)
      secs = rem - mins * 60
      @timeleft.text (if mins and secs then '-' + mins + ':' + (if secs < 10 then '0' + secs else secs) else undefined)
      @positionIndicator.css({left: (if not @manualSeek then pos + '%' else undefined)})
      unless @loaded
        @loaded = true
        $('.player #gutter').slider({
          value: 0
          step: 0.01
          orientation: 'horizontal'
          range: 'min'
          max: @audio.duration
          animate: true
          slide: =>
            @manualSeek = true
            true
          
          stop: (e, ui) =>
            @manualSeek = false
            @audio.currentTime = ui.value
            true
        })
        true
    
    push: (stream) ->
      if stream
        @audio.pause()
        @audio.src = stream
        @audio.play()
        true

  $('a[data-pjax]').pjax()

  player = new Player()
  player.initialize()

  opts =
    lines: 6 # The number of lines to draw
    length: 4 # The length of each line
    width: 3 # The line thickness
    radius: 5 # The radius of the inner circle
    color: '#000' # #rbg or #rrggbb
    speed: 1.5 ## Rounds per second
    trail: 66 # Afterglow percentage
    shadow: true # Whether to render a shadow

  $('.find form').submit(->
    $('.playlist h3').spin(opts)
    console.log("QUERY")
    $.getJSON('/get_tracks/', {query: $('.find input[type="text"]').val()},
      (data) ->
        $('.song').fadeOut()
        $.each(data, ->
          if @.track
            for resolver in resolvers.ALL
              console.log("RESOLVE " + resolver.info.name)
              results = resolver(@.artist, @.album, @.track, (obj) ->
                $('.empty').remove()
                $('#song-template').tmpl(obj).appendTo($('.songs')).click(->
                  player.push(obj.stream)
                  true
                ).fadeIn()
                $('.song').unique()
                true
              )
        )
        $('.playlist h3').spin(false)
        false
    )

    false
  )

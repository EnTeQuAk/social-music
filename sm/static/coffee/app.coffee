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
      console.log('Initialize audio')
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
        else
          @audio.pause()
      )
    
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
          
          stop: (e, ui) =>
            @manualSeek = false
            @audio.currentTime = ui.value
        })
    
    push: (stream) ->
      if stream
        @audio.pause()
        @audio.src = stream
        @audio.play()

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
    console.log('Query for ' + $('.find input[type="text"]').val())
    $('.playlist h3').spin(opts)
    $.getJSON('/get_tracks/', {artist_name: $('.find input[type="text"]').val()},
      (data) ->
        $('.empty').remove()
        $('.song').fadeOut()
        $('#song-template').tmpl(data).appendTo($('.songs'))
        $('.play-song').click(->
          player.push($(this).data('stream'))
        )
        console.log("Stop spinner")
        $('.playlist h3').spin(false)
    )
    
    false
  )

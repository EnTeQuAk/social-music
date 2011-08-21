$(document).ready(function() {

  var module = '\
  <li class="module-item song">\
    <a class="module-item-title" href="#">${name}</a>\
    <a href="#" class="quiet">(${artist_name})</a>\
    <span class="quiet">${duration}s</span>\
    <ul class="module-item-menu">\
      <li><a href="#" class="play-song" data-stream="${stream}">Play</a></li>\
    </ul>\
  </li>';

  // Initialize pjax links
  $('a[data-pjax]').pjax()

  $('.find form').submit(function() {
    console.log('Query for ' + $('.find input[type="text"]').val());
    $.getJSON('/get_tracks/', {
      artist_name: $('.find input[type="text"]').val()
    }, function(data) {
      console.log('Songs: ' + data);
      $('.empty').remove();
      $('.song').fadeOut();
      $.tmpl(module, data).appendTo($('.songs'));

      $('.play-song').click(function() {
        stream = $(this).data('stream');
        if (stream) {
          audio = $('.player audio').get(0);
          audio.pause();
          audio.src = stream;
          audio.play()
        } else {
          // TODO: Error handling!
        }
      });
    });
    return false;
  });

	initAudio();

  function initAudio() {
    console.log("Initialize audio");
    var audio,
        loadingIndicator,
        positionIndicator,
        timeleft,
        loaded = false,
        manualSeek = false;

		audio = $('.player audio').get(0);
		loadingIndicator = $('.player #loading');
		positionIndicator = $('.player #handle');
		timeleft = $('.player #timeleft');
		
		if ((audio.buffered != undefined) && (audio.buffered.length != 0)) {
			$(audio).bind('progress', function() {
				var loaded = parseInt(((audio.buffered.end(0) / audio.duration) * 100), 10);
				loadingIndicator.css({width: loaded + '%'});
			});
		} else {
			loadingIndicator.remove();
		}
		
		$(audio).bind('timeupdate', function() {
			var rem = parseInt(audio.duration - audio.currentTime, 10),
					pos = (audio.currentTime / audio.duration) * 100,
					mins = Math.floor(rem/60,10),
					secs = rem - mins*60;
			
      if (mins && secs) {
        timeleft.text('-' + mins + ':' + (secs < 10 ? '0' + secs : secs));
      }
			if (!manualSeek) { positionIndicator.css({left: pos + '%'}); }
			if (!loaded) {
				loaded = true;
				
				$('.player #gutter').slider({
						value: 0,
						step: 0.01,
						orientation: "horizontal",
						range: "min",
						max: audio.duration,
						animate: true,					
						slide: function(){							
							manualSeek = true;
						},
						stop:function(e,ui){
							manualSeek = false;					
							audio.currentTime = ui.value;
						}
					});
			}
			
		}).bind('play',function(){
			$("#playtoggle").addClass('playing');		
		}).bind('pause ended', function() {
			$("#playtoggle").removeClass('playing');		
		});		
		
		$("#playtoggle").click(function() {			
			if (audio.paused) {	audio.play();	} 
			else { audio.pause(); }			
		});
  }
});

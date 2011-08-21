(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $(function() {
    var Player, opts, player;
    Player = (function() {
      function Player() {
        this.loaded = false;
        this.manualSeek = false;
        this.audio = $('.player audio').get(0);
        this.loadingIndicator = $('.player #loading');
        this.positionIndicator = $('.player #handle');
        this.timeleft = $('.player #timeleft');
      }
      Player.prototype.initialize = function() {
        console.log('Initialize audio');
        if (this.audio.buffered !== void 0 && this.audio.buffered.length !== 0) {
          $(this.audio).bind('progress', __bind(function() {
            var progress;
            progress = parseInt((this.audio.buffered.end(0) / this.audio.duration) * 100, 10);
            return this.loadingIndicator.css({
              width: progress + '%'
            });
          }, this));
        } else {
          this.loadingIndicator.remove();
        }
        $(this.audio).bind('timeupdate', __bind(function() {
          return this.seek();
        }, this));
        $(this.audio).bind('play', __bind(function() {
          return $('#playtoggle').addClass('playing');
        }, this));
        $(this.audio).bind('pause ended', __bind(function() {
          return $('#playtoggle').removeClass('playing');
        }, this));
        return $('#playtoggle').click(__bind(function() {
          if (this.audio.paused) {
            return this.audio.play();
          } else {
            return this.audio.pause();
          }
        }, this));
      };
      Player.prototype.seek = function() {
        var mins, pos, rem, secs;
        rem = parseInt(this.audio.duration - this.audio.currentTime, 10);
        pos = (this.audio.currentTime / this.audio.duration) * 100;
        mins = Math.floor(rem / 60, 10);
        secs = rem - mins * 60;
        this.timeleft.text((mins && secs ? '-' + mins + ':' + (secs < 10 ? '0' + secs : secs) : void 0));
        this.positionIndicator.css({
          left: (!this.manualSeek ? pos + '%' : void 0)
        });
        if (!this.loaded) {
          this.loaded = true;
          return $('.player #gutter').slider({
            value: 0,
            step: 0.01,
            orientation: 'horizontal',
            range: 'min',
            max: this.audio.duration,
            animate: true,
            slide: __bind(function() {
              return this.manualSeek = true;
            }, this),
            stop: __bind(function(e, ui) {
              this.manualSeek = false;
              return this.audio.currentTime = ui.value;
            }, this)
          });
        }
      };
      Player.prototype.push = function(stream) {
        if (stream) {
          this.audio.pause();
          this.audio.src = stream;
          return this.audio.play();
        }
      };
      return Player;
    })();
    $('a[data-pjax]').pjax();
    player = new Player();
    player.initialize();
    opts = {
      lines: 6,
      length: 4,
      width: 3,
      radius: 5,
      color: '#000',
      speed: 1.5,
      trail: 66,
      shadow: true
    };
    return $('.find form').submit(function() {
      console.log('Query for ' + $('.find input[type="text"]').val());
      $('.playlist h3').spin(opts);
      $.getJSON('/get_tracks/', {
        artist_name: $('.find input[type="text"]').val()
      }, function(data) {
        $('.empty').remove();
        $('.song').fadeOut();
        $('#song-template').tmpl(data).appendTo($('.songs'));
        $('.play-song').click(function() {
          return player.push($(this).data('stream'));
        });
        console.log("Stop spinner");
        return $('.playlist h3').spin(false);
      });
      return false;
    });
  });
}).call(this);

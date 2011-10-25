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
        $('#playtoggle').click(__bind(function() {
          if (this.audio.paused) {
            this.audio.play();
            return true;
          } else {
            this.audio.pause();
            return true;
          }
        }, this));
        return true;
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
          $('.player #gutter').slider({
            value: 0,
            step: 0.01,
            orientation: 'horizontal',
            range: 'min',
            max: this.audio.duration,
            animate: true,
            slide: __bind(function() {
              this.manualSeek = true;
              return true;
            }, this),
            stop: __bind(function(e, ui) {
              this.manualSeek = false;
              this.audio.currentTime = ui.value;
              return true;
            }, this)
          });
          return true;
        }
      };
      Player.prototype.push = function(stream) {
        if (stream) {
          this.audio.pause();
          this.audio.src = stream;
          this.audio.play();
          return true;
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
      $('.playlist h3').spin(opts);
      console.log("QUERY");
      $.getJSON('/get_tracks/', {
        query: $('.find input[type="text"]').val()
      }, function(data) {
        $('.song').fadeOut();
        $.each(data, function() {
          var resolver, results, _i, _len, _ref, _results;
          if (this.track) {
            _ref = resolvers.ALL;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              resolver = _ref[_i];
              console.log("RESOLVE " + resolver.info.name);
              _results.push(results = resolver(this.artist, this.album, this.track, function(obj) {
                $('.empty').remove();
                $('#song-template').tmpl(obj).appendTo($('.songs')).click(function() {
                  player.push(obj.stream);
                  return true;
                }).fadeIn();
                $('.song').unique();
                return true;
              }));
            }
            return _results;
          }
        });
        $('.playlist h3').spin(false);
        return false;
      });
      return false;
    });
  });
}).call(this);

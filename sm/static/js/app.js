$(document).ready(function() {

  var Player, player;
  Player = (function() {
    function Player() {
      var audio, loaded, loadingIndicator, manualSeek, positionIndicator, timeleft;
      this.loaded = false;
      this.manualSeek = false;
      this.audio = $('.player audio').get(0);
      this.loadingIndicator = $(".player #loading");
      this.positionIndicator = $(".player #handle");
      this.timeleft = $(".player #timeleft");
      this.initialize();
    }

    Player.prototype.initialize = function() {
      console.log("Initialize audio");
      if (this.audio.buffered != undefined && this.audio.buffered.length !== 0) {
        $(this.audio).bind("progress", function() {
          var progress;
          progress = parseInt((this.audio.buffered.end(0) / this.audio.duration) * 100, 10);
          return this.loadingIndicator.css({
            width: progress + "%"
          });
        });
      } else {
        this.loadingIndicator.remove();
      }
      $(this.audio).bind("timeupdate", this.seek);
      $(this.audio).bind("play", function() {
        return $('#playtoggle').addClass("playing");
      });
      $(this.audio).bind("pause ended", function() {
        return $("#playtoggle").removeClass("playing");
      });
      return $("#playtoggle").click(function() {
        if (this.audio.paused) {
          return this.audio.play();
        } else {
          return this.audio.pause();
        }
      });
    };

    Player.prototype.seek = function() {
      var mins, pos, rem, secs;
      rem = parseInt(this.audio.duration - this.audio.currentTime, 10);
      pos = (this.audio.currentTime / this.audio.duration) * 100;
      mins = Math.floor(rem / 60, 10);
      secs = rem - mins * 60;
      this.timeleft.text(mins && secs ? "-" + mins + ":" + (secs < 10 ? "0" + secs : secs) : void 0);
      this.positionIndicator.css({
        left: !this.manualSeek ? pos + "%" : void 0
      });
      if (!this.loaded) {
        this.loaded = true;
        return $(".player #gutter").slider({
          value: 0,
          step: 0.01,
          orientation: "horizontal",
          range: "min",
          max: this.audio.duration,
          animate: true,
          slide: function() {
            return this.manualSeek = true;
          },
          stop: function(e, ui) {
            this.manualSeek = false;
            return this.audio.currentTime = ui.value;
          }
        });
      }
    };
    return Player;
  })();


  $(".find form").submit(function() {
    console.log("Query for " + $('.find input[type="text"]').val());
    $.getJSON("/get_tracks/", {
      artist_name: $('.find input[type="text"]').val()
    }, function(data) {
      console.log("Songs: " + data);
      $(".empty").remove();
      $(".song").fadeOut();
      $('#song-template').tmpl(data).appendTo($(".songs"));
      return $(".play-song").click(function() {
        var stream;
        stream = $(this).data("stream");
        if (stream) {
          this.audio = $(".player audio").get(0);
          this.audio.pause();
          this.audio.src = stream;
          return this.audio.play();
        } else {

        }
      });
    });
    return false;
  });

  $("a[data-pjax]").pjax();

  return player = new Player();
});

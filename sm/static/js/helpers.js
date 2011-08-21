(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $.fn.spin = function(opts) {
    this.each(__bind(function() {
      var spinner;
      spinner = $(this).data('spinner');
      if (spinner) {
        spinner.stop();
      }
      if (opts !== false) {
        opts = $.extend({
          color: $(this).css('color')
        }, opts);
        console.log("start spinner");
        spinner = new Spinner(opts).spin($(this).get(0));
        return $(this).data('spinner', spinner);
      }
    }, this));
    return this;
  };
}).call(this);

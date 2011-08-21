$.fn.spin = (opts) ->
  @each(=>
    spinner = $(@).data('spinner')
    spinner.stop() if spinner

    if opts isnt false
        opts = $.extend({color: $(@).css('color')}, opts)
        console.log("start spinner")
        spinner = new Spinner(opts).spin($(@).get(0))
        $(@).data('spinner', spinner)
  )
  this

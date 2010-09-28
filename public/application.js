var Dashy = {
  init: function(list_selector) {
    this.get(0);
    this.list = $(list_selector);
  },
  get: function(revision) {
    console.log('START POLL');
    var self = this;
    $.getJSON('/event/'+revision, function(e, textStatus){
      console.log(textStatus)
      if (textStatus == 'success') {
        var array = e.list;
        var timeout = 0
        $.each(array, function( i, d ){
          var data = JSON.parse(d);
          setTimeout(function(data) {
            var event_div = self.build(data);
            self.list.prepend(event_div);
            event_div.addClass('incoming');
          }, 100*i, data)

        })

        self.get(e.revision);
      }
    });
  },
  build: function(event) {
    var title = $('<h3/>', {
      html: event.title
    });
    var subtitle = $('<div/>', {
      html: event.subtitle
    });
    var actor     = $('<strong/>', {
      html: event.actor
    })
    var link_1     = $('<a/>', {
      href: event.link_1_url,
      target: '_blank',
      html: event.link_1_title
    })
    
    var container = $('<div/>', {
      html: ""
    });
    
    container
      .append(actor).append(link_1)
      .append(title)
      .append(subtitle);
    
    return container;
  }
};

$(function() {
  Dashy.init('#event_list');
})

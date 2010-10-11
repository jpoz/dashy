var DashyEvents = {
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
            // event_div.addClass('incoming');
          }, 100*i, data)

        })

        self.get(e.revision);
      }
    });
  },
  build: function(event) {
    var title = $('<h3/>', {
      "class": "title",
      html: event.title
    });
    var subtitle = $('<div/>', {
      "class":"subtitle",
      html: event.subtitle
    });
    var actor     = $('<strong/>', {
      html: event.actor
    })
    var link_1     = $('<a/>', {
      "class":"link_1",
      href: event.link_1_url,
      target: '_blank',
      html: event.link_1_title
    })
    
    var container = $('<div/>', {
      "class": "event",
      html: ""
    });
    
    container
      .append(title)
      .append(actor).append(link_1)
      .append(subtitle);
    
    return container;
  }
};

var DashyScores = {
  init: function(selector) {
    this.contanier = $(selector);
    this.get();
  },
  get: function() {
    var self = this;
    $.getJSON('/highscores', function(array, textStatus){
      if (textStatus == 'success') {
        $.each(array, function( i, d ){
          self.getScoreFor(d);
        });
      }
    });
  },
  getScoreFor: function(key) {
    var self = this;
    $.getJSON('/highscore/'+key, function(score_set, textStatus){
      if (textStatus == 'success') {
        var scores = self.build(key,score_set);
        self.contanier.append(scores);
      }
    });
  },
  build: function(key, score_set) {
    var container = $('<div/>', {
      html: "<h3>" + key + "</h3>"
    });
    
    for(var i in score_set.rank) {
      var score     = $('<div/>', {
        html: "<strong>" + score_set.rank[i] + "</strong>&nbsp;-&nbsp;" + score_set.scores[score_set.rank[i]]
      });
      container.append(score);
    }
    
    return container;
  }
}


var DashyViews = {
  init: function(selector) {
    this.views = $(selector);
    this.views.hide();
    this.current_view = -1;

    var height = $(window).height();
    var width = $(window).width();
    
    this.views.css({
      height: height+"px",
      width: width+"px"
    });

    this.go();

  },
  timeout: 5000,
  animation_length: 1000, // has to match the time in transitions.css
  go: function() {
    var old_view = this.current_view;
    if (this.current_view >= 0) {
      this.swap_out($(this.views[old_view]));
    }
    this.current_view = this.current_view + 1;
    if (this.current_view > this.views.length-1) this.current_view = 0;
    this.swap_in($(this.views[this.current_view]));
    setTimeout(function() { DashyViews.go() }, DashyViews.timeout);
  },
  swap_out: function(going_out) {
    going_out.addClass('swap_out');
    setTimeout(function() {
      going_out.removeClass('swap_out').hide();
    }, DashyViews.animation_length);
  },
  swap_in: function(going_in) {
    going_in.show().addClass('swap_in');
    setTimeout(function() {
      going_in.removeClass('swap_in');
    }, 5000);
  }
}


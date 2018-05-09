$(document).ready(function() {
    $.getJSON("/talks.json", renderTalks);
  });

  var renderTalks = function(data) {
    data.forEach(function(talk) {
      $("#talks-container").append(
        "<div class=\"col-lg-2 col-md-4 col-sm-6 talk-container\"><div class=\"talk-card\">"+
        "<div class=\"talk-speaker\">"+talk.speaker.name+"</div>"+
        "<h4>"+talk.title+"</h4>"+
        "<p>"+talk.description+"</p>"+
        "</div></div>"
      );
    });
  };
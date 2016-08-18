var counter = 0;
var Reader = (function(){
  return {
    start : function(FeedUrl,MaxCount){
      var YQLstr = 'SELECT channel.item FROM feednormalizer WHERE output="rss_2.0" AND url ="' + FeedUrl + '" LIMIT ' + MaxCount;
      $.ajax({
        url: "https://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(YQLstr) + "&format=json&diagnostics=false&callback=?",
        dataType: "json",
        success : function(response){
          var feedResponse = response.query.results.rss;
          for (var i=0 ; i < feedResponse.length ; i++){
            var feed = feedResponse[i].channel.item;
            var articleNode = '<div class="col-md-6"><div class="article-wrapper"><a href="#" class="btn btn-default hide-btn">hide this article</a><a href="'+ feed.link +'" class="article_heading">' + feed.title +  '</a><div class="description">'+ feed.encoded +'</div><p class="about_creator"><span class="creator_name pull-left">'+ feed.creator +'</span><span class="published_on pull-right">'+ feed.pubDate +'</span></p></div></div>';
            $('#feedWrapper').append(articleNode);
          }
          Reader.correctYoutubeLink();
          Reader.hideArticle();
        }
      });
    },
    correctYoutubeLink : function(){
      $('iframe').each(function(){
        var Ulink = $(this).attr('src');
        // console.log(Ulink +'  ' +Ulink.indexOf('//'));
        if(Ulink.indexOf('//') == 0){
          var a = Ulink.replace('//www','www');
          var newUlink = a.replace('/embed','/v');
          $(this).attr('src',newUlink);
        }
      });
    },
    hideArticle : function(){
      $('.hide-btn').on('click',function(e){
        e.preventDefault();
        $(this).parent().parent().hide();
      });
    },
    showTime : function(){
      var dt = new Date();
      var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
      $('#timer_watch').text(time);
    },
    timeonsite : function(){
      counter = counter+1;
      $('#counter').text(counter+' sec');
    }
  }
})();
Reader.start('https://www.scoopwhoop.com/rss','20');
window.setInterval(function(){
  Reader.showTime();
  Reader.timeonsite();
}, 1000);

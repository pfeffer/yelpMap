window.yelpMap = (function(yelpMap){
  yelpMap.InfowindowView = Backbone.View.extend({
    initialize: function(){
    },
    infowindowTemplate: _.template($('#info-window-template').html()),
    render: function(){
      console.log("from IW render");
      var json = this.model.toJSON();

      //infowindow.setContent(this.html);
      // var $content = $(this.infowindowTemplate(json));
      //       this.options.infowindow.setContent($content[0]);
      
      $(this.el).html(this.infowindowTemplate(json));
    },
    events: {
      "click #business-edit-btn": "editBusiness",
      "mouseenter .ratings-stars": "ratingMouseEnter",
      "mouseleave .ratings-stars": "ratingMouseLeave",
      "click .ratings-stars": "ratingStarClick"
    },
    editBusiness: function(){
      this.options.infowindow.close();
      console.log("from EDIT infowindow");      
      console.log(this.options);
      $(this.el).find("#edit-form").show();
      
      this.drawUserRating();
      
      // $(this.el).find('.ratings-stars').on('click', function(e){
      //         var $star = $(e.currentTarget);
      //         console.log($star.data('value'));
      //         this.model.setUserRating($star.data('value'));
      //       }, this);
      //       
      this.options.infowindow.open(this.options.map, this.options.googleMarker);
    },
    ratingStarClick: function(e){
      var $star = $(e.currentTarget);
      console.log($star.data('value'));
      this.model.setUserRating($star.data('value'));
    },
    ratingMouseEnter: function(e) {  
      var $star = $(e.currentTarget);
      $star.prevAll().andSelf().html("★");
      $star.nextAll().html("☆");
    },
    ratingMouseLeave: function(e) {  
      this.drawUserRating();
    },
    drawUserRating: function(){
      var rating = this.model.getUserRating();
      if (rating >0){
        $(this.el).find('.star_' + rating).prevAll().andSelf().html("★");  
        $(this.el).find('.star_' + rating).nextAll().html("☆");
      }else{
        console.log($(this.el).find('.ratings-stars'));
        $(this.el).find('.ratings-stars').html("☆");  
      }
    }
  });
  
  return yelpMap;
})(window.yelpMap || {})
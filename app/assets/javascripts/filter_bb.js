window.yelpMap = (function(yelpMap){
  yelpMap.FilterView = Backbone.View.extend({
    events:{
      "click #btn-search": "searchButton",
    },
    searchButton: function(){
      var search_params = {
        rating: $('#amount').text(),
        category: $('#category').val()
      };
      this.trigger('search', search_params);
    }
    
  });
  
  return yelpMap;
})(window.yelpMap || {})
//= require underscore-min
//= require backbone-min

//= require infowindow_bb
//= require user_bb
//= require map_bb
//= require location_bb
//= require filter_bb


window.yelpMap = (function(yelpMap){
  
  var map_model = new yelpMap.MapModel;
  
  // var locations = new yelpMap.LocationCollection(yelpMap.user_locations_raw);
  var locations = new yelpMap.LocationCollection();
  
  var map_view = new yelpMap.MapView({ el: $('#map-canvas')[0], collection: locations, user: yelpMap.user });
  
  var filter_view = new yelpMap.FilterView({el: $("#filter-panel")[0]});
  
  filter_view.on('search', function(search_params){
    //data massage
    search_params.coordinates = map_view.getCoordinates();
    locations.fetchFromYelp(search_params);
  })

  return yelpMap;
})(window.yelpMap || {});

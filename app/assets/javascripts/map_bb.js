// window.yelp = (function(yelp){
//   yelp.model = .....
//   return yelp;
// })(window.yelp || {});

log = function(p){
  return console.log(p);
}

window.yelpMap = (function(yelpMap){
  yelpMap.MapModel = Backbone.Model.extend({
  
  });

  yelpMap.MapView = Backbone.View.extend({
    initialize: function(params){
      this.initializeMap();
      this.collection.on('reset', this.render, this);
      // this.Collection.bind("change", function(model, attributes){
      //         // do something with the model, here
      //       });
      
      this.options.user.on('change destroy', this.updateMap, this);
      
      //     
      //       this.collection.addUserLocations('json');
      //     
      //       this.collection.trigger('reset');
      //     
      //       this.infoWindow = new ;
    },
    render: function(){
      //remove each marker
      //close infowindow.content
      var self = this;
      this.collection.each(function(location_model){
        //put each marker
      
        var marker = new yelpMap.MarkerView({model: location_model, map: self.map, infowindow: self.infowindow});
        location_model.on('remove', function(){ marker.removeMarker(); });
        // location_model.marker = marker;
        //console.log(location_model);
        // marker.setMap(this.map); //on model change
      })
    },
    initializeMap: function(){
      var myLatLng = new google.maps.LatLng(43.6395961, -79.3835943);
      var options = {
        center: myLatLng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(this.el, options);
      var thisView = this;
      google.maps.event.trigger(this.map, 'resize');
      
      this.infowindow = new google.maps.InfoWindow({
        content: $("#info-window-content")[0]
      });
      
      yelpMap.infowindowView = new yelpMap.InfowindowView({
        el: $('#info-window-content')[0],
        infowindow: this.infowindow,
      });
      
      // google.maps.event.addListener(this.map, 'bounds_changed', function(){
      //         console.log("1");
      //         thisView.setCoordinates(this);
      //       });
    },
    getCoordinates: function(){
      var bounds = this.map.getBounds();
      var ne = bounds.getNorthEast();
      var sw = bounds.getSouthWest();
      var coordinates = {
        northEast: {
          lat: ne.lat(),
          lng: ne.lng(),
        },
        southWest: {
          lat: sw.lat(),
          lng: sw.lng()
        }
      }
      return coordinates;
    },
    updateMap: function(model){
      log('updating map');
      log(model);
    }
  });
  
  ////////////////////////////////////////////////////////////////////////////
  yelpMap.MarkerView = Backbone.View.extend({
    initialize: function(){
      this.render();
      // this.model.bind("change", this.render, this);
      this.model.on("change", function(){
        this.render();
        //yelpMap.infowindowView.render();
      }, this);
      
      var pinColor = "00FF00";
      this.pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));
      this.pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
        new google.maps.Size(40, 37),
        new google.maps.Point(0, 0),
        new google.maps.Point(12, 35));
    },
    events:{
      "click #business-edit-btn": "editBusiness"
    },
    infowindowTemplate: _.template($('#info-window-template').html()),
    render: function(){
      var latLong = this.model.getLatLong();
      
      var thisView = this;
      if (this.model.isUserLocation){
        this.googleMarker = new google.maps.Marker({
          map: this.options.map,
          position: latLong,//this.model.getLatLong()
          title: this.model.getName(),
          icon: this.pinImage,
          shadow: this.pinShadow
        });
      }else{
        this.googleMarker = new google.maps.Marker({
          map: this.options.map,
          position: latLong,//this.model.getLatLong()
          title: this.model.getName()
        });
      }
      
      google.maps.event.addListener(this.googleMarker, 'click', function(){
        thisView.openInfowindow(this);
      });
      
      // this.model.on("change", function(){
      //       //         this.openInfowindow(this.googleMarker);
      //         yelpMap.infowindowView.render();
      //       }, this);
    },
    removeMarker: function(){
      this.googleMarker.setMap(null);
    },
    openInfowindow: function(googleMarker){
      
      yelpMap.infowindowView.model = this.model;
      yelpMap.infowindowView.options.map = this.options.map;
      yelpMap.infowindowView.options.googleMarker = googleMarker;
      
      yelpMap.infowindowView.render();
      this.options.infowindow.open(this.options.map, googleMarker);
      
      // var json = this.model.toJSON();
      // var $content = $(this.infowindowTemplate(json));
      // this.options.infowindow.setContent($content[0]);
      // // this.options.infowindow.close();
      // 
      // 
      // console.log(this.options.infowindow.getContent());
      // var view = this;
      // // $("#business-edit-btn").on('click', this.editBusiness);
      // $("#edit-form").hide();
      // $content.on('click', "#business-edit-btn", function(){
      //   // view.editBusiness();
      //   view.options.infowindow.close();
      //   
      //   console.log("edit!!!");
      //   $content.find("#edit-form").show();
      //   var rating = view.model.getUserRating();
      //   $content.find('.star_' + rating).prevAll().andSelf().html("★");  
      //   $content.find('.star_' + rating).nextAll().html("☆");
      //   
      //   $content.find('.ratings_stars').on('click', function(e){
      //     var $star = $(e.currentTarget);
      //     console.log($star.data('value'));
      //     view.model.setUserRating($star.data('value'));
      //   });
      //   
      //   view.options.infowindow.open(view.options.map, googleMarker);
      // });
      // 
      // $('.ratings_stars').hover(  
      //     // Handles the mouseover  
      //     function() {  
      //         //$(this).prevAll().andSelf().addClass('ratings_over');  
      //         $(this).prevAll().andSelf().html("★");
      //         $(this).nextAll().html("☆");
      //     },  
      //     // Handles the mouseout  
      //     function() {  
      //         //$(this).prevAll().andSelf().removeClass('ratings_over');  
      //         //$(this).prevAll().andSelf().html("☆");
      // 
      //         view.drawUserRating($content);
      //     }  
      // );  
      // 
    },
    drawUserRating: function($content){
      rating = this.model.getUserRating();
      $content.find('.star_' + rating).prevAll().andSelf().html("★");  
      $content.find('.star_' + rating).nextAll().html("☆");
    },
    editBusiness: function(){
      //set rating first
      
      //$("#rating").find('.total_votes').text( votes + ' votes recorded (' + exact + ' rating)' );
          
      
      $("#edit-form").show("slow");
      if (this.model.isUserLocations){
        
      }
    }
  });
  
  return yelpMap;
})(window.yelpMap || {})

window.yelpMap = (function(yelpMap){
  yelpMap.LocationModel = Backbone.Model.extend({
    defaults:{
      isUserLocation: false,
      userComment: '',
      userRating: 0
    },
    getLatLong: function(){
      var location = this.get('location');
      var latLong = new google.maps.LatLng(location.coordinate.latitude, location.coordinate.longitude);
      return latLong;
    },
    getName: function(){
      return this.get('name');
    },
    isUserLocation: function(){
      return this.get('isUserLocation')
    },
    getUserComment: function(){
      return this.get('userComment');
    },
    getUserRating: function(){
      return this.get('userRating');
    },
    setUserRating: function(val){
      this.set('userRating', val);
    }
  });
  
  yelpMap.LocationCollection = Backbone.Collection.extend({
    model: yelpMap.LocationModel,
    fetchFromYelp: function(search_params){
      var auth = { 
        
        consumerKey: "1-OP-r2vX6WfeW1icvsYpw", 
        consumerSecret: "anzhzLXXgMnyRPiLRmT6WIfBNQo",
        accessToken: "SCT3og7hzzYdO0oobi9R8xUzxm2wQlmJ",
        accessTokenSecret: "stQo287Pd_7rS0oGzZnZMyzc1ME",
        serviceProvider: { 
          signatureMethod: "HMAC-SHA1"
        }
      };
      var accessor = {
        consumerSecret: auth.consumerSecret,
        tokenSecret: auth.accessTokenSecret
      };
      var str_bounds = ''+search_params.coordinates.southWest.lat+','+search_params.coordinates.southWest.lng+'|'
        +search_params.coordinates.northEast.lat+','+search_params.coordinates.northEast.lng;

      parameters = [];
      parameters.push(['limit', 10]);
      parameters.push(['sort', 2]); // sort by highest rated
      if (search_params.category != ""){
        parameters.push(['category_filter', search_params.category]);
      }
      parameters.push(['bounds', str_bounds]);
      parameters.push(['callback', 'cb']);
      
      parameters.push(['oauth_consumer_key', auth.consumerKey]);
      parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
      parameters.push(['oauth_token', auth.accessToken]);
      parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

      var message = { 
        'action': 'http://api.yelp.com/v2/search',
        'method': 'GET',
        'parameters': parameters 
      };

      OAuth.setTimestampAndNonce(message);
      OAuth.SignatureMethod.sign(message, accessor);

      var parameterMap = OAuth.getParameterMap(message.parameters);
      parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);
      console.log(parameterMap);
      
      var collection = this;

      $.ajax({
        'url': message.action,
        'data': parameterMap,
        'cache': true,
        'dataType': 'jsonp',
        'jsonpCallback': 'cb',
        error:function(jqXHR, textStatus, errorThrown){
          console.log(textStatus);
        },
        success: function(data, textStats, XMLHttpRequest) {
          collection.each(function(m){ m.trigger('remove'); })
          collection.reset(data.businesses);
          console.log(collection.at(0));
          collection.at(0).set('isUserLocation', true);
        }
      });
    }
  });
  
  // yelp.LocationModel = Backbone.Model.extend({
  //     initialize: function(params){
  //       this.key1 = params['key1'];
  //       if(!this.yelp_fetched){
  //         this.fetch_from_yelp();
  //       }
  //     }
  //   })
  
  return yelpMap;
})(window.yelpMap || {})
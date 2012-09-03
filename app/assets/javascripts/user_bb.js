window.yelpMap = (function(yelpMap){
  var UserModel = Backbone.Model.extend({
    defaults:{
      // facebook_id: null,
      // first_name: '',
      // name: '',
      // location_id: '',
      // location_name: '',
    },
    facebookId: function(){
      return this.get('facebook_id');
    },
    
  });
  
  yelpMap.UserView = Backbone.View.extend({
    tagName: 'div'
  });
  
  var user = new UserModel;
  if (yelpMap.raw_user) user.set(yelpMap.raw_user);
  yelpMap.user = user;
    
  window.fbAsyncInit = function() {
        $("#fb-logout-link").click(function(){
          window.location = "/logout";
          FB.Event.unsubscribe('auth.statusChange', serverLogin);
        });
        
        if (yelpMap.raw_user){
          console.log('user already exists');
          $("#fb-login-link").hide();
          $("#fb-logout-link").show();
          return;
        }
        
        $("#fb-login-link").click(function(){
          //FB.login(); 
          FB.getLoginStatus(function(response){
            if (response.status === 'connected') {
              serverLogin(response);
            } else {
              FB.Event.subscribe('auth.statusChange', serverLogin);
              FB.login();
            }
          });
        });
        
        var serverLogin = function(response){
          $.ajax({
            'url': '/login',
            'data': {'fb_token': response.authResponse.accessToken},
            'dataType': 'json',
            error:function(jqXHR, textStatus, errorThrown){
              console.log(errorThrown);
            },
            success: function(data, textStats, XMLHttpRequest) {
                var user_params = data['user'];
                user_params['locations'] = data['locations'];
                user.set(user_params);
                console.log('we\'re authorized!');
                $("#fb-login-link").hide();
                $("#fb-logout-link").show();
            }
          });
        }
    
        
        
        FB.init({
            appId       : '371052199634798', // App ID
            //channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel File
            //status      : true, // check login status
            cookie      : true, // enable cookies to allow the server to access the session
            xfbml       : true,  // parse XFBML
        });
        
        
        
    };
    
    //FB.Event.subscribe('auth.statusChange', function(response) {
    var fbStatusChangeHandler = function(response){  
      console.log(response.authResponse);
      if (response.authResponse){
        //user authorized the app
          
        // ajax the server
        $.ajax({
          'url': '/login',
          'data': {'fb_token': response.authResponse.accessToken},
          'dataType': 'json',
          error:function(jqXHR, textStatus, errorThrown){
            console.log(errorThrown);
          },
          success: function(data, textStats, XMLHttpRequest) {
              var user_params = data['user'];
              user_params['locations'] = data['locations'];
              user.set(user_params);
              console.log('we\'re authorized!');
              $("#fb-login-link").hide();
              $("#fb-logout-link").show();
          }
        });
      }else{
        //the app wasn't authorized

          // ajax the server
        $.ajax({
          'url': '/logout',
          error:function(jqXHR, textStatus, errorThrown){
            console.log(errorThrown);
          },
          success: function(data, textStats, XMLHttpRequest) {
              console.log('we\'re logged out :(!');
              $("#fb-login-link").show();
              $("#fb-logout-link").hide();
          }
        });
      }
    };
    
    return yelpMap;
})(window.yelpMap || {});
class UsersController < ApplicationController
  require 'net/https'
  
  # POST /users
  def create_login
    if request.xhr?
      
      unless params[:fb_token].nil?
        # check fb_token validity
        # get fb_id by calling facebook.com/me
        
        
        uri = URI.parse("https://graph.facebook.com/me/?access_token=#{params[:fb_token]}")
        puts "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
        
        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = true
        request = Net::HTTP::Get.new(uri.path + "?" + uri.query)
        response = http.request(request)
        if response.code.to_s == 200.to_s
          user = User.find_or_create_by_fb_id(response.body)
          puts user
          if user
            session[:user_id] = user.id
            render :json => {:user => user, :locations => user.locations }
          else
            puts "OOOPS"
            render :json => "could not create user", :status => 400 
          end
        end
      end
    end
  end
  
  # POST /users/logout
  def logout
    session[:user_id] = nil
    redirect_to root_path #, :notice => "bye bye"
  end
  
end


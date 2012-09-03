class UserMapController < ApplicationController
  def index
    if current_user
      @user = current_user
      #@locations = @user.locations
    end
    
  end
end

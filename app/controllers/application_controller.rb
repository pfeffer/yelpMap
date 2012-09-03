class ApplicationController < ActionController::Base
  protect_from_forgery
  
  before_filter :current_user
  
  #session user id (db)
  #@current_user
  
  protected ########################################################
  
  def current_user
    return @current_user if @current_user.present?
    @current_user = User.find_by_id(session[:user_id])
  end
  
end

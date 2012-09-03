class User < ActiveRecord::Base
  attr_accessible :fb_id, :fb_location, :name
  
  has_many :locations
  # location: yelp_id, comment, rating
  
  def self.find_or_create_by_fb_id(json_str)
    begin
      fb_params = JSON.parse(json_str)
      
      # {"id":"726741210","name":"Masha Kuznetsova","first_name":"Masha","last_name":"Kuznetsova","link":"http:\/\/www.facebook.com\/mashaku","username":"mashaku","hometown":{"id":"109389799079499","name":"Severodvinsk"},"location":{"id":"110941395597405","name":"Toronto, Ontario"},"gender":"female","timezone":-4,"locale":"en_US","verified":true,"updated_time":"2012-08-19T18:44:00+0000"}
      u = super(fb_params["id"])
      u.name = fb_params["name"]
      u.fb_location = fb_params["location"]["name"]
      u.save!
      return u
    rescue => e
      return nil
    end
  end
  
  
end

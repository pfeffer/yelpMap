class Location < ActiveRecord::Base
  attr_accessible :comment, :rating, :yelp_id
  
  belongs_to :user
end

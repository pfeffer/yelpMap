class CreateLocations < ActiveRecord::Migration
  def change
    create_table :locations do |t|
      t.integer :yelp_id
      t.string :comment
      t.integer :rating

      t.timestamps
    end
  end
end

class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.integer :fb_id
      t.string :fb_location
      t.string :name

      t.timestamps
    end
    
    add_index :users, :fb_id
  end
end

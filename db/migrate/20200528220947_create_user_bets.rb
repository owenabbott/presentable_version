class CreateUserBets < ActiveRecord::Migration[6.0]
  def change
    create_table :user_bets do |t|
      t.integer :user_id
      t.integer :bet_amount
      t.integer :round_id
      t.timestamps
    end
  end
end

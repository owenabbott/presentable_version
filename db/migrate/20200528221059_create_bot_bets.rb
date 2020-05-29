class CreateBotBets < ActiveRecord::Migration[6.0]
  def change
    create_table :bot_bets do |t|
      t.integer :bot_id
      t.integer :round_id
      t.integer :bet_amount
      t.timestamps
    end
  end
end

class Round < ApplicationRecord
    has_one :user_bet
    has_one :user, through: :user_bet
    has_many :bot_bets
    has_many :bots, through: :bot_bets
end

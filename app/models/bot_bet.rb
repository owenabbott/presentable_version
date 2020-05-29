class BotBet < ApplicationRecord
    belongs_to :bot
    belongs_to :round
end

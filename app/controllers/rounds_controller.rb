class RoundsController < ApplicationController
    def create
        round = Round.create()
        render json: round
        #nothing goes in round, it's purely something that associates with bets. wondering how to create it.
    end
end

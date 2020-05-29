class UserBetsController < ApplicationController

    def create
        Round.create()
        bet = UserBet.create(bet_amount: params.values[0][:bet_amount], round_id: Round.all.last.id, user_id: params.values[0][:user_id] )
        render json: bet
    end

    def update

        puts "##################################"
        puts "##################################"
        puts params

        puts "##################################"
        puts "##################################"
        bet = UserBet.find(params[:id])
        bet.update(params[:bet_amount])
        render json: bet

    end


end

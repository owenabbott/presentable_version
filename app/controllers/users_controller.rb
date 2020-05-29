class UsersController < ApplicationController
    
    def index
        users = User.all 

        render json: users
    end

    def create
        puts "--------------------------------------------"
        puts "--------------------------------------------"
        puts params.values

        #IT WORKS!!!: user = User.create({name: params.values[0][:name], bank_account: params.values[0][:bank_account]})
        user = User.create({name: params.values[0][:name], bank_account: params.values[0][:bank_account]})
        render json: user

    end


    def update

        puts "--------------------------------------------"
        puts params
        user = User.all.last
        user.update(bank_account: params[:bank_account])
        render json: user
    end


end

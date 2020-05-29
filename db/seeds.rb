# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

User.destroy_all
Round.destroy_all
Bot.destroy_all
BotBet.destroy_all
UserBet.destroy_all

##############################################
    #User Info:
    # t.string :name
    # t.int :bank_account
    # t.timestamps
##############################################


##############################################
    #Round Info:


##############################################


##############################################
    #User_Bet info:
    # t.int :user_id
    # t.int :bet_amount
    # t.int :round_id

##############################################

##############################################
    # Bot_Bet Info:
    # t.int :bot_id
    # t.int :bet_amount
##############################################


##############################################
    #Bot Info:
    # t.string :name
    # t.int :bank_account
    # t.timestamps
##############################################

def createUser
    User.create!({name: "Owen", bank_account: 7000})
end


def createBots
    botNameArray = ["Wild Bill Hickok", 'Wyatt Earp']
    botNameArray.each do |handle|
        Bot.create!({name: handle, bank_account: 5000})
    end
end

def createRound
    Round.create!({})
end

def placeBotBet 
    Bot.all.each do |bot|
        BotBet.create!({bot_id: bot.id, round_id: Round.last.id, bet_amount: 20})
    end
end

def placeUserBet
    User.all.each do |user|
        UserBet.create!({user_id: user.id, round_id: Round.last.id, bet_amount: 20})
    end
end




createUser
createBots
createRound
placeBotBet
placeUserBet
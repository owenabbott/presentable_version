class BotsController < ApplicationController

    def index
        bots = Bot.all 
        render json: bots
        #I'm having trouble getting serializer or fast json to run. They install but have trouble connecting to the serializers folder.
        #I'm not sure what the conflict is but for the purposes of getting done on time, I'm going to attempt to fix it directly in the controller.
    end

    def show
        bot = Bot.find(params[:id]) 
        render json: bot
    end 

    def edit

    end


    def update 

    end


end



Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :users
  resources :rounds
  resources :user_bets
  resources :bot_bets
  get '/bots', to: 'bots#index'
  patch '/bots', to: 'bots#update'
  get '/bots/:id', to: 'bots#show'
  

end

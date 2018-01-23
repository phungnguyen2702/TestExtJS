Rails.application.routes.draw do
  # resources :products do
  #   match 'update_extjs',to: 'products#update_extjs', via: [:post]
  #   match 'create_extjs', to: 'products#create_extjs', via: [:post]
  #   match 'destroy_extjs', to: 'products#destroy_extjs', via: [:post]
  # end
  get 'products', to: 'products#index'
  root 'home#index'
  post 'create_extjs', to: 'products#create_extjs'
  post 'update_extjs', to: 'products#update_extjs'
  post 'destroy_extjs', to: 'products#destroy_extjs'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end

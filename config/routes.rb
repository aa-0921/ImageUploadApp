# Rails.application.routes.draw do
#   get 'images/index'
#   get 'images/new'
#   get 'images/edit'
#   get 'images/show'
#   # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
# end

Rails.application.routes.draw do
  root to: 'images#index'
  resources :images, except: :index
end

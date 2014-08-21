require 'json'
require 'httparty'
get '/' do
  erb :login
end

post '/user_login' do
  @username = params[:username]
  @password = params[:password]
  @current_user = User.where('user_name=? and password=?', @username, @password ).first
  if @current_user != nil
    session[:id] = User.find_by_user_name(@username).id
    erb :kitchen
  else
    @error = "Wrong username and password"
    erb :login
  end

end

post '/user_register' do
  username = params[:username]
  password = params[:password]
  email = params[:email]
  User.create(user_name: username, password: password)
  erb :login
end

get '/user_login' do
  erb :kitchen
end

get '/recipe' do
  app_id = params[:app_id]
  app_key = params[:app_key]
  query = params[:q]
  ingredients = params[:allowedIngredient]
  ingredients.reject! { |space| space.empty? }
  # p ingredients
  special = ''
  ingredients.each do |ingredient|
    special << "&allowedIngredient[]=" + ingredient
  end
  # p special
  response = HTTParty.get("http://api.yummly.com/v1/api/recipes?_app_id=#{app_id}&_app_key=#{app_key}#{special}&q=#{query}")
  # p response
  object = JSON.parse(response.body)
  # p object
  # p object["matches"]
  recipes = []
  # p object["matches"]
  object["matches"].each do |match|
  recipes << {recipe: match["recipeName"], ingredients: match["ingredients"], picture: match["imageUrlsBySize"]["90"], id: match["id"]}
  end
  # p recipes
  recipes.to_json


  # p response
  # p data = response["foo"]
  # data.to_json
end

get '/instructions' do
  id = params[:id]

  instruction_response = HTTParty.get("http://api.yummly.com/v1/api/recipe/#{id}?_app_id=9285586a&_app_key=d28d4c08b01a940f886faacc4a94e00b")

  p object = JSON.parse(instruction_response.body)

  object.to_json



end


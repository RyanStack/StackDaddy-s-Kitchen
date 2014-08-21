helpers do
  def api
    response = HTTParty.get('http://api.yummly.com/v1/api/recipes?')
  end
end

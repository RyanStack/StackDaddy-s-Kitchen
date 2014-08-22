$(document).ready(function() {
  $('#login_button').on("click", signInDropDown)
  $('#register_button').on("click", registerDropDown)
  $('form#foodsearch').submit(apiCall)
  $('.recipes').on('click', '.link', apiInstructions)
});

//All code relating to recipe search

var apiCall = function(event) {
  event.preventDefault()
  $('.recipes').empty()
  var searchfood = $('#ingredients').val().split(' ')[0]
  var ingredients = $('#ingredients').val().split(' ')
  console.log (searchfood)
  console.log (ingredients)
  var ajaxRequest = $.ajax({
    url:  '/recipe',
    type: "GET",
    data: {q: searchfood, app_id: '9285586a', app_key: 'd28d4c08b01a940f886faacc4a94e00b', allowedIngredient: ingredients},
    dataType: 'json'
  })
  ajaxRequest.success(function(data) {
      console.log (data)
      var intro = document.getElementsByClassName('intro')
      intro[0].style.display = 'none';
      var overlay = document.getElementsByClassName('overlay')
      overlay[0].style.display = 'none';
      if (data.length === 0) {
        $('.recipes').append($('<p/>', {
      text: "Hit the Supermarket.  There are no recipes with those ingredients."
    }))
      }
      for (var i=0; i<data.length; i++) {
        var name = data[i].recipe
        var ingredients = data[i].ingredients
        var picture = data[i].picture
        var id = data[i].id
        recipeAppender(name, ingredients, picture, id)
      }

  })
}

var recipeAppender = function(name, ingredients, picture, id) {
  var row = buildRecipeRow(name, ingredients, picture, id)
  $('.recipes').append(row)

}

function buildRecipeRow(name, ingredients, picture, id) {
  // gets todoTemplate stored in DOM.
  var recipeTemplate = $.trim($('#recipe_template').html());
  // Creates an jQueryDOMElement from the todoTemplate.
  var $recipe = $(recipeTemplate);
  // Modifies it's text to use the passed in todoName.
  $recipe.find('img').attr("src", picture)
  $recipe.find('h4').text(name);
  $recipe.find('h5').text(ingredients)
  $recipe.find('.link').data("foodlink", id)
  // Returns the jQueryDOMElement to be used elsewhere.
  return $recipe;
}




//All code relating to Instructions

var apiInstructions = function(event) {
  event.preventDefault()
  var a = $(event.target).parents('div.recipe').find('a').data("foodlink")
  console.log(a)
  var recipe_id = $(event.target).parents('div.recipe').find('a').data("foodlink")
  console.log (recipe_id)
  var ajaxRequest = $.ajax({
    url:  '/instructions',
    type: "GET",
    data: {id: recipe_id, app_id: '9285586a', app_key: 'd28d4c08b01a940f886faacc4a94e00b'},
    dataType: 'json'
  })
  ajaxRequest.success(function(data) {
      console.log(data)
      window.temp = data;
      var name = data.name;
      var ingredients = data.ingredientLines;
      console.log (ingredients)
      var yield = data.yield
      var time = data.totalTime;
      var source = data.source.sourceRecipeUrl;
      instructionPopUp(name, ingredients, yield, time, source)
})
}

function buildInstructionPopUp(name, ingredients, yield, time, source) {
  // gets todoTemplate stored in DOM.
  var instructionTemplate = $.trim($('#instruction_template').html());
  // Creates an jQueryDOMElement from the todoTemplate.
  var $instruction = $(instructionTemplate);
  // Modifies it's text to use the passed in todoName.
  $instruction.find('h4').text(name);
  for (var i=0; i<ingredients.length; i++) {
    var li = $instruction.find('ul')
    var $li = $(li)
    $li.append($('<li/>', {
      text: ingredients[i]
    }))
  }
  $instruction.find('p').text(yield);
  $instruction.find('#time').text(time)
  $instruction.find('a').attr("href", source)
  // Returns the jQueryDOMElement to be used elsewhere.
  return $instruction;
}

var instructionPopUp = function(name, ingredients, yield, time, source) {
  var popup = buildInstructionPopUp(name, ingredients, yield, time, source)
  $('.popup').html(popup)

  $('#exit').on("click", removePopUp)
}

var removePopUp = function(event) {
  $('.popup').empty()
}



//All code relating to Login/Register
var signInDropDown = function(event) {
  form = $('#login').html()
  $('#content').html(form)
  }

var registerDropDown = function(event) {
  form = $('#register').html()
  $('#content').html(form)
}
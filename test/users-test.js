const chai = require('chai');
const expect = chai.expect;

const User = require('../src/User');
const Recipe = require('../src/Recipe');

describe('User', function() {

  let user1, user2, user3, user4, recipe1, recipe2;

  beforeEach(function() {
    user1 = new User({name: "Saige O'Kon", id: 1, pantry: [{ingredient: 20081, amount: 4}, {ingredient: 18372, amount: 4}]})
    user2 = new User({name: "Ephraim Goyette", id: 2, pantry: [{ingredient: 2048, amount: 1}, {ingredient: 18371, amount: 7}]});
    user3 = new User({name: "Jeremy Beramy", id: 3, pantry: []});
    user4 = new User({name: "Rachael Green", id: 4, pantry: [{ingredient: 222, amount: 1}, {ingredient: 626, amount: 5}]});

    recipe1 = new Recipe({
      id: 595736,
      image: "https://spoonacular.com/recipeImages/595736-556x370.jpg",
      ingredients: [{id: 20081, quantity: {amount: 1.5, unit: "c"}}, {id: 18372, quantity: {amount: 0.5, unit: "tsp"}}],
      instructions: [{
        instruction: "In a large mixing bowl, whisk together the dry ingredients (flour, pudding mix, soda and salt). Set aside.In a large mixing bowl of a stand mixer, cream butter for 30 seconds. Gradually add granulated sugar and brown sugar and cream until light and fluffy.",
        number: 1
      },
      {
        instruction: "Add egg and vanilla and mix until combined.",
        number: 2
      },
      ],
      name: "Loaded Chocolate Chip Pudding Cookie Cups",
      tags: [
        "antipasti",
        "starter",
        "snack"
      ]
    });

    recipe2 = new Recipe({
      id: 562334,
      image: "https://spoonacular.com/recipeImages/562334-556x370.jpg",
      ingredients: [
        {
          "id": 2048,
          "quantity": {
            "amount": 2,
            "unit": "teaspoons"
          }
        },
        {
          "id": 18371,
          "quantity": {
            "amount": 0.3333333333333333,
            "unit": "teaspoon"
          }
        },
        {
          "id": 20090,
          "quantity": {
            "amount": 1.125,
            "unit": "cup"
          }
        }],
      instructions: [
        {
          "instruction": "Grease or spray oil a 9\u00d75 inch loaf pan.Preheat oven to 170 \u2013 200\u00b0F (lowest possible).",
          "number": 1
        },
        {
          "instruction": "Mix warm water with brown rice syrup, molasses, and yeast in a cup larger than 8 oz., as it may bubble over; set aside until foamy on the top, no more than 5 minutes.In the bowl of your mixer, beat the eggs at high speed in a large mixing bowl until large bubbles form, about 20 seconds.",
          "number": 2
        }],
      name: "Mock Udi\u2019s Gluten Free Whole Grain Bread",
      tags: []
    })

  });

  it('should be a function', function() {
    expect(User).to.be.a('function');
  });

  it('should be an instance of the User class', function() {
    expect(user1).to.be.an.instanceof(User);
  });

  it('should be able to add a meal to the favorites array', function() {

    user1.favoriteMeal(recipe1);

    expect(user1.favoriteRecipes).to.deep.equal([recipe1]);
  });

  it('should be able to remove a meal to the favorites array', function() {

    user1.favoriteMeal(recipe1);
    user1.favoriteMeal(recipe2);
    user1.unfavoriteMeal(recipe1);

    expect(user1.favoriteRecipes).to.deep.equal([recipe2]);
  });

  it('should be able to add a meal to the meals to cook array', function() {

    user1.addRecipeToMealsToCook(recipe1);

    expect(user1.recipesToCook).to.deep.equal([recipe1]);
  });

  it('should be able to remove a meal to the meals to cook array', function() {

    user1.addRecipeToMealsToCook(recipe1);
    user1.addRecipeToMealsToCook(recipe2);
    user1.removeRecipeFromMealsToCook(recipe1);

    expect(user1.recipesToCook).to.deep.equal([recipe2]);
  });

  it('should be determine if we have enough ingredients to cook a given meal', function() {

    expect(user1.checkIngredientAmts(recipe1)).to.equal(true);
  });

  it('should determine if we do not have enough ingredients to cook a given meal', function() {


    expect(user2.checkIngredientAmts(recipe2)).to.equal(false);
    expect(user3.checkIngredientAmts(recipe2)).to.equal(false);
    expect(user4.checkIngredientAmts(recipe2)).to.equal(false);
  });

  it('it should return false if the user doesn\'t have enough ingredients in their pantry', function() {
    user3.checkIngredientAmts(recipe2);
    user2.checkIngredientAmts(recipe2);
    user4.checkIngredientAmts(recipe2);
    expect(recipe2.canBeCooked).to.equal(false);
    expect(recipe2.canBeCooked).to.equal(false);
    expect(recipe2.canBeCooked).to.equal(false);
  });

  it('it should return true if the user has enough ingredients in their pantry', function() {
    user1.checkIngredientAmts(recipe1);
    expect(recipe1.canBeCooked).to.equal(true);
  });

  it('it should print out all of the ingredients and amounts needed for the given recipe if the user is missing all of the ingredients', function() {
    user3.checkIngredientAmts(recipe1);
    user4.checkIngredientAmts(recipe2);
    expect(recipe1.ingredientsNeeded).to.deep.equal([ { difference: '1.50 c', id: 20081 }, { difference: '0.50 tsp', id: 18372 } ]);
    expect(recipe2.ingredientsNeeded).to.deep.equal([ { difference: '2.00 teaspoons', id: 2048 }, { difference: '0.33 teaspoon', id: 18371 }, {difference: '1.13 cup', id: 20090 } ]);
  });

  it('it should print out all of the ingredients and amounts needed for the given recipe if some ingredients are missing', function() {
    user2.checkIngredientAmts(recipe2);
    expect(recipe2.ingredientsNeeded).to.deep.equal([ { difference: '1.13 cup', id: 20090}, {difference: '1.00 teaspoons', id: 2048 } ]);
  });

  it('it should remove used ingredients from the pantry after it has been cooked', function() {
    recipe1.hasBeenCooked = true;
    recipe2.hasBeenCooked = true;
    user1.checkIngredientAmts(recipe1);
    user2.checkIngredientAmts(recipe2);
    user1.removeIngredients(recipe1);
    user2.removeIngredients(recipe2);
    expect(user1.pantry).to.deep.equal([{ingredient: 20081, amount: 2.5}, {ingredient: 18372, amount: 3.5}]);
    expect(user2.pantry).to.deep.equal([{ingredient: 2048, amount: 1}, {ingredient: 18371, amount: 7}]);
  });

});

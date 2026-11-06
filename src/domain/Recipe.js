import { assertObject } from '../utils/assertions';
import Logger from '../services/Logger';

const numeral = require('numeral');

const logger = Logger.getLogger();

export class Recipe {
  static idCounter = 1;

  static getNextId() {
    const id = Recipe.idCounter;
    Recipe.idCounter += 1;
    return id;
  }

  /**
   * Returns a new Recipe instance initialized
   * by the server representation of an item.
   * A server item has mostly the same fields as a Recipe
   * so most of them are copied. A few are generated/renamed.
   */
  static fromServerItem(item) {
    assertObject(item, "item is an object");

    const recipe = new Recipe();
    Object.keys(item).forEach(function copyProp(k) {
      recipe[k] = item[k];
    });
    recipe.originalRecipeId = recipe.recipeId;
    recipe.recipeId = Recipe.getNextId(); // Rewrite recipeId.
    // Note! this is our ID for this object.
    // It is generated because the server "recipeId" appears multiple times.
    // In any case we still need to keep the original recipeId around.
    recipe.amount = numeral(item.sellingPrice).format('0,0.00');
    return recipe;
  }
}

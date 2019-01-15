import { Component, OnInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import ingredientsJSON from '../assets/ingredients.json';
import recipesJSON from '../assets/validation.json';
import cuisinesJSON from '../assets/cuisines.json';
import { FormControl } from '@angular/forms'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'robofoodie';
  model: tf.Model;
  predictions: any;
  ingredients: any;
  recipe: any;
  encodedRecipe: any;
  actualCuisine: any;
  predictedCuisine: any;
  certainty: any;
  newIngredient: any;
  myRecipe: any;
  checked: any;
  showPrediction = false;
  userGuess: any;
  cuisines = [{value: "brazilian", displayValue: "Brazilian"},
              {value: "british", displayValue: "British"},
              {value: "cajun_creole", displayValue: "Cajun Creole"},
              {value: "chinese", displayValue: "Chinese"},
              {value: "filipino", displayValue: "Filipino"},
              {value: "french", displayValue: "French"},
              {value: "greek", displayValue: "Greek"},
              {value: "indian", displayValue: "Indian"},
              {value: "irish", displayValue: "Irish"},
              {value: "italian", displayValue: "Italian"},
              {value: "jamaican", displayValue: "Jamaican"},
              {value: "japanese", displayValue: "Japanese"},
              {value: "korean", displayValue: "Korean"},
              {value: "mexican", displayValue: "Mexican"},
              {value: "moroccan", displayValue: "Moroccan"},
              {value: "russian", displayValue: "Russian"},
              {value: "southern_us", displayValue: "Southern US"},
              {value: "spanish", displayValue: "Spanish"},
              {value: "thai", displayValue: "Thai"},
              {value: "vietnamese", displayValue: "Vietnamese"}];



  async ngOnInit() {
    await this.loadModel();
    this.loadRecipe();
  }

  updateList(ingredient) {
    console.log("update: "+ingredient);
  }

  loadRecipe() {
    this.showPrediction = false;
    var recipeIndex = Math.floor(Math.random() * Math.floor(recipesJSON.length));
    var myRecipes = recipesJSON;
    this.ingredients = myRecipes[recipeIndex].ingredients;
    this.actualCuisine = myRecipes[recipeIndex].cuisine;
    //one-hot encode recipe for model prediction
    this.recipe = new Array(ingredientsJSON.length).fill(0);
    for(var i=0; i<this.ingredients.length; i++) {
      var j = ingredientsJSON.indexOf(this.ingredients[i]);
      if (j >= 0) {
        this.recipe[j] = 1;
      }
    }
    this.encodedRecipe = tf.tensor(this.recipe);
    this.encodedRecipe = this.encodedRecipe.reshape([1, ingredientsJSON.length]);

    this.userGuess = null;
  }

  addIngredient(myNewIngredient) {
  }

  async loadModel() {
    this.model = await tf.loadModel('./assets/model.json');
  }

  async predict(recipeData:any) {
    const pred = await tf.tidy(() => {
        // Make and format the predications
        const output = this.model.predict(recipeData) as any;
        // Save predictions on the component
        this.predictions = Array.from(output.dataSync());
        var predictionIndex = this.predictions.indexOf(Math.max(...this.predictions))
        this.certainty = Math.max(...this.predictions)
        this.predictedCuisine = cuisinesJSON[predictionIndex];
        this.showPrediction = true;
    });
  }
}

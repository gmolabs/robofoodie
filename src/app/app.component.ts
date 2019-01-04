import { Component, OnInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import ingredientsJSON from '../assets/ingredients.json';
import recipesJSON from '../assets/validation.json';
import cuisinesJSON from '../assets/cuisines.json';


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


  async ngOnInit() {
    await this.loadModel();
    this.loadRecipe();
  }

  loadRecipe() {
    var recipeIndex = Math.floor(Math.random() * Math.floor(recipesJSON.length));
    var myRecipes = recipesJSON;
    console.log(recipesJSON);
    this.ingredients = myRecipes[recipeIndex].ingredients;
    this.actualCuisine = myRecipes[recipeIndex].cuisine;
    console.log("New Recipe: " + this.ingredients)

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
    console.log(this.encodedRecipe);

    this.predict(this.encodedRecipe);

  }

  async loadModel() {
    console.log("Loading model...");
    this.model = await tf.loadModel('/assets/model.json');
    console.log("Model loaded");
  }

  async predict(recipeData:any) {
    console.log(this.model);
    const pred = await tf.tidy(() => {
        // Make and format the predications
        const output = this.model.predict(recipeData) as any;
        console.log(output);
        // Save predictions on the component
        this.predictions = Array.from(output.dataSync());
        //console.log(this.predictions);
        var predictionIndex = this.predictions.indexOf(Math.max(...this.predictions))
        this.certainty = Math.max(...this.predictions)
        // var predictionIndex = 0;
        // var topPrediction = 0;
        // for (var i = 0; i < cuisinesJSON.length; i++ ) {
        //   if (this.predictions[i] > topPrediction) {
        //     topPrediction = this.predictions[i];
        //     predictionIndex = i;
        //   }
        // }
        this.predictedCuisine = cuisinesJSON[predictionIndex];
        //console.log(predictedCuisine)

    });
  }
}

import { Component, OnInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as ingredientsJSON from '../assets/ingredients.json';
import * as recipesJSON from '../assets/validation.json';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'robofoodie';
  model: tf.Model;
  prediction: any;
  ingredients: any;
  recipe: any;
  cuisine: any;
  cuisines: any;


  ngOnInit() {
    this.loadModel();
    this.loadRecipe();
    this.predict();
  }

  loadRecipe() {
    var recipeIndex = Math.floor(Math.random() * Math.floor(recipesJSON.length));
    var myRecipes = recipesJSON.default;
    this.ingredients = myRecipes[recipeIndex].ingredients;
    console.log("New Recipe: " + this.ingredients)

    //one-hot encode recipe for model prediction
    this.recipe = new Array(ingredientsJSON.default.length).fill(0);
    console.log(this.recipe);
    for(var i=0; i<this.ingredients.length; i++) {
      var j = ingredientsJSON.default.indexOf(this.ingredients[i]);
      if (j >= 0) {
        this.recipe[j] = 1;
      }
    }
    console.log(this.recipe)
  }

  async loadModel() {
    console.log("Loading model...");
    this.model = await tf.loadModel('/assets/model.json');
    console.log("Model loaded");
  }

  async predict() {
    const pred = await tf.tidy(() => {
        console.log("TODO: make prediction");
    });
  }
}

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
  cuisine: any;


  ngOnInit() {
    this.loadModel();
    this.loadRecipe();

  }

  loadRecipe() {
    var recipeIndex = Math.floor(Math.random() * Math.floor(recipesJSON.length));
    var myRecipes = recipesJSON.default;
    this.ingredients = myRecipes[recipeIndex].ingredients;
    console.log("New Recipe: " + this.ingredients)
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

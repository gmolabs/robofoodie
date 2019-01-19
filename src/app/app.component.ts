import { Component, OnInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import ingredientsJSON from '../assets/ingredients.json';
import recipesJSON from '../assets/validation.json';
import cuisinesJSON from '../assets/cuisines.json';
import { FormControl } from '@angular/forms'
import {ViewChild, ElementRef} from '@angular/core';

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
  userGuessResult = "";
  userGuessIcon = "arrow_forward";
  roboGuessResult = "";
  roboGuessIcon = "arrow_forward";
  robofoodieScore = 0;
  playerScore = 0;
  totalTries = 0;
  modelLoaded = false;
  loadingMessage = [
    "Defragging dough...",
    "Compiling carrots...",
    "Debugging kale...",
    "Formatting cheeses...",
    "Oversampling oranges...",
    "Adjusting salt...",
    "Monitoring hydration...",
    "Simulating yeast...",
    "Kneading algorithms...",
    "Seasoning classifiers...",
    "Slicing lists...",
    "Whipping parameters..."
  ];
  loadingMessageIndex=0;
  refreshIntervalId: any;

  @ViewChild('recipeCard') recipeCardRef: ElementRef;
  @ViewChild('recipeCardContent') recipeCardContentRef: ElementRef;

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
    this.refreshIntervalId = setInterval(()=> {
      this.loadingMessageIndex=Math.floor(Math.random() * Math.floor(this.loadingMessage.length));
 },1500);
    await this.loadModel();
    this.loadRecipe();
    clearInterval(this.refreshIntervalId);
    this.modelLoaded=true;
  }

  updateList(ingredient) {
    console.log("update: "+ingredient);
  }

  loadRecipe() {
    this.recipeCardContentRef.nativeElement.scrollTop=0;
    this.userGuessResult="";
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
    this.userGuessIcon = "arrow_forward";
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
        if(this.actualCuisine==this.userGuess) {
          this.userGuessResult="Correct!";
          this.userGuessIcon="check";
          this.playerScore++;
        } else {
          this.userGuessResult="Incorrect"
          this.userGuessIcon="clear";
        }
        if(this.actualCuisine==this.predictedCuisine) {
          this.roboGuessResult="Correct!";
          this.roboGuessIcon="check";
          this.robofoodieScore++;
        } else {
          this.roboGuessResult="Incorrect"
          this.roboGuessIcon="clear";
        }
        this.totalTries++;
    });
  }
}

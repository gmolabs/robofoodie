import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCuisines'
})
export class FormatCuisinesPipe implements PipeTransform {
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

  transform(value: any): any {
    let formattedCuisine = "";
    // the code you're looking for
    // iterate over each element in the array
      for (var i = 0; i < this.cuisines.length; i++){
        // look for the entry with a matching `code` value
        if (this.cuisines[i].value == value){
            // we found it
            return this.cuisines[i].displayValue;
        }
      }
  }
}

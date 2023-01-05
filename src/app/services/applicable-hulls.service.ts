import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApplicableHullsService {

  general120 = {
    "CV": ["CV", "CVL"],
    "CVL": ["CV", "CVL"],
    "BB": ["BB", "BC", "BBV"],
    "BC": ["BB", "BC", "BBV"],
    "BBV": ["BB", "BC", "BBV"],
    "DD": ["DD", "DDG"],
    "DDG": ["DD", "DDG"],
    "SS": ["SS", "SSV"],
    "SSV": ["SS", "SSV"],
    "CL": ['CL'],
    "IX": ["SS"],
    "AE": ["AE"],
    "CA": ["CA", "CB", "BM"],
    "CB": ["CA", "CB", "BM"],
    "BM": ["CA", "CB", "BM"],
    "AR": ["AR"]
  }

  generalObtain = {
    "CV": ["CVL"],
    "CVL": ["CV", "CVL"],
    "BB": ["BB", "BC", "BBV"],
    "BC": ["BB", "BC", "BBV"],
    "BBV": ["BB", "BC", "BBV"],
    "DD": ["DD", "DDG"],
    "DDG": ["DD", "DDG"],
    "SS": ["SS", "SSV"],
    "SSV": ["SS", "SSV"],
    "CL": ['CL'],
    "IX": ["SS"],
    "AE": ["AE"],
    "CA": ["CA", "CB", "BM"],
    "CB": ["CA", "CB", "BM"],
    "BM": ["CA", "CB", "BM"],
    "AR": ["AR"]
  }

  specifics120 = {};
  specificsObtain = {};

  constructor() { }

  async init() {
    fetch("assets/specificTech.json")
      .then(value => value.text())
      .then(value => {
        const json = JSON.parse(value);
        this.specifics120 = json.specifics120;
        this.specificsObtain = json.specificsObtain;
      })

    return;
  }

  async getHulls(type: "120" | "obtain" = "120", shipName, shipHull) {
    // waiting for init() to finish
    while(this.specifics120 == null)
      ;
    
    if(type == "120") {
      const specific120 = this.specifics120[shipName]
      return (specific120 != null) ? specific120 : this.general120[shipHull];
    } else {
      const specificObtain = this.specificsObtain[shipName]
      return (specificObtain != null) ? specificObtain : this.generalObtain[shipHull];
    }
  }
}

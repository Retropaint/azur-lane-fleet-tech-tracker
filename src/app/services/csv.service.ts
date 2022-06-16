import { Injectable } from '@angular/core';
import * as papa from 'papaparse';
import { ShipsService } from './ships.service';

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  settingsText: string;

  constructor(private shipsService: ShipsService) { }

  export() {
    // remove unneeded properties from ships
    let csvShips = [];
    for(const ship of this.shipsService.ships) {
      // prevent referencing the actual ship object
      let csvShip = JSON.parse(JSON.stringify(ship));

      delete csvShip.fallbackThumbnail;
      delete csvShip.hasRetrofit;
      delete csvShip.isBulkSelected;
      csvShips.push(csvShip);
    }

    var csv = papa.unparse(csvShips);

    // download csv
    var csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    var csvURL = window.URL.createObjectURL(csvData);
    var testLink = document.createElement('a');
    testLink.href = csvURL;
    testLink.setAttribute('test', 'test.csv');
    testLink.setAttribute('download', 'AL_fleet_tech.csv');
    testLink.click();
    testLink.remove();
  }

  import(file: any) {
    // keep reference to itself
    const script = this;
    
    papa.parse(file, 
      {
			  delimiter: ",",
			  quoteChar: '"',
			  header: false,
			  complete: function(results, file) {
          // property columns 
          let nameCol = 0;
          let levelCol = 0;
          let obtainedCol = 0;
          let isPropertyRow = true;
          let isInvalid = false;

          for(const row of results.data) {
            // if it's the first row, get property columns and skip
            if(isPropertyRow) {
              nameCol = script.getColumnByName('name', row);
              levelCol = script.getColumnByName('level', row);
              obtainedCol = script.getColumnByName('isObtained', row);
              if(nameCol == null || levelCol == null || obtainedCol == null) {
                isInvalid = true;
                break;
              }
              isPropertyRow = false
              continue;
            }

            // set properties
            const ship = script.shipsService.getByName(row[nameCol]);
            ship.level = parseInt(row[levelCol]);
            ship.isObtained = row[obtainedCol].toUpperCase() == 'TRUE' ? true : false;
          }
          
          if(isInvalid) {
            script.settingsText = "Invalid CSV"
          } else {
            script.settingsText = "Imported";
            script.shipsService.save();
          }
			  }
		  }
    )
  }

  getColumnByName(name: string, row: any): number {
    for(let c = 0; c < row.length; c++) {
      // set both to upper case to prevent case sensitivity
      if(row[c].toUpperCase() == name.toUpperCase()) {
        return c;
      }
    }
    return null;
  }
}

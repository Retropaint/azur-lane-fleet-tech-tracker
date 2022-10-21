import { Injectable } from '@angular/core';
import * as papa from 'papaparse';
import { Subject } from 'rxjs';
import { Ship } from '../interfaces/ship';
import { FilterService } from './filter.service';
import { MiscService } from './misc.service';
import { ShipsService } from './ships.service';
import { SortService } from './sort.service';

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  settingsText: string;

  importStatusSubject = new Subject<boolean>();
  importStatus = this.importStatusSubject.asObservable(); 

  constructor(
    private shipsService: ShipsService,
    private misc: MiscService,
    private sort: SortService,
    private filter: FilterService
  ) { }

  export() {

    let shipArray = this.shipsService.ships;
    if(this.misc.considerStatusSorting) {
      shipArray = this.shipsService.setAllProperShipPos(this.sort.immediateSort(shipArray));
    }

    // remove unneeded properties from ships
    let csvShips: Ship[] = [];
    shipArray.forEach(ship => {
      if(!this.misc.shipsFilterPass[ship.id]) {
        return;
      }

      // prevent referencing the actual ship object
      let csvShip: any = JSON.parse(JSON.stringify(ship));

      delete csvShip.fallbackThumbnail;
      delete csvShip.hasRetrofit;
      delete csvShip.isBulkSelected;
      delete csvShip.techPoints;

      // add retrofit properties to approriate ships
      const finalRarity = this.shipsService.getRetroRarity(ship.id)
      if(csvShip.rarity != finalRarity) {
        csvShip.rarity = finalRarity;
        csvShip.name += ' (Retrofit)';
        csvShip.id = (parseInt(csvShip.id) + 3000).toString();
      }

      // apply these fields (no clue why they aren't included in the first place)
      csvShip.faction = ship.faction;
      csvShip.techStat = ship.techStat;
      csvShip.techBonus = ship.techBonus;
      csvShip.obtainStat = ship.obtainStat;
      csvShip.obtainBonus = ship.obtainBonus;
      csvShip.appliedHulls = ship.appliedHulls;
      csvShip.obtainAppliedHulls = ship.obtainAppliedHulls;

      if(ship.techPoints != null) {
        csvShip.obtainTechPoints = ship.techPoints.obtain;
        csvShip.techPoints = ship.techPoints.maxLevel;
        csvShip.mlbTechPoints = ship.techPoints.maxLimitBreak;
      }
      
      csvShips.push(csvShip);
    })

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
            script.importStatusSubject.next(false);
          } else {
            script.importStatusSubject.next(true);
            script.shipsService.save();
          }
			  }
		  })
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

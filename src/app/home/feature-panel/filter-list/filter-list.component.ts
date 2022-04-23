import { Component, Input, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { FilterService } from 'src/app/services/filter.service';
import { MiscService } from 'src/app/services/misc.service';

@Component({
  selector: 'app-filter-list',
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.scss', '../../home.page.scss'],
})
export class FilterListComponent implements OnInit {

  // names are absolutely positioned, so that they don't shift depending on if the image is loaded. Right margins are their offset as they use float: right 
  
  hullNames: string[] = ["DD", "CL", "CA", "CV", "BB", "SS", "Others", "All"]
  hullIconWidths: number[] = [40, 40, 40, 40, 50, 40, 35];
  hullTextRightMargins: number[] = [15, 15, 15, 15, 15, 15, 5, 40];

  statNames: string[] = ["FP", "TRP", "AVI", "AA", "RLD", "HIT", "ASW", "EVA", "HP", "All"];
  statIconWidths: number[] = [50, 35, 35, 38, 38, 35, 35, 32, 35];
  statTextRightMargins: number[] = [17, 17, 17, 17, 17, 17, 17, 17, 17, 40];

  factionNames: string[] = ["USS", "HMS", "IJN", "KMS", "ROC", "SN", "FFNF", "MNF", "RN", "All"];
  factionIconWidths: number[] = [40, 30, 40, 32, 32, 40, 32, 32, 40];
  factionTextRightMargins: number[] = [10, 15, 15, 15, 15, 17, 15, 15, 17, 40];

  rarityNames: string[] = ["Common", "Rare", "Elite", "Super-Rare", "Ultra-Rare", "All"];

  statusNames: string[] = ["W.I.P", "Maxed", "Unobtained", "All"];

  unfoldedFilters = {
    "hulls": true,
    "stats": true,
    "factions": true,
    "rarities": true,
    "status": true
  }

  constructor(public filter: FilterService, public misc: MiscService) { }

  ngOnInit() {}
  
  toggleFold(filter: string) {
    this.unfoldedFilters[filter] = !this.unfoldedFilters[filter];

    // set folded filter to All if it's not already
    if(!this.unfoldedFilters[filter] && !this.filter[filter]["All"]) {
      this.filter.pressedFilter("All", this.filter[filter]);
    }
  }
}

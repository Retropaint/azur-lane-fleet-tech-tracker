import { Component, Input, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { FilterService } from 'src/app/services/filter.service';
import { MiscService } from 'src/app/services/misc.service';

@Component({
  selector: 'app-filter-list',
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.scss', '../../../home/home.page.scss'],
})
export class FilterListComponent implements OnInit {

  hullNames: string[] = ["DD", "CL", "CA", "CV", "BB", "SS", "Others", "All"]
  statNames: string[] = ["FP", "TRP", "AVI", "AA", "RLD", "HIT", "ASW", "EVA", "HP", "No Tech", "All"];
  factionNames: string[] = ["USS", "HMS", "IJN", "KMS", "ROC", "RN", "SN", "FFNF", "MNF", "MOT", "All"];
  rarityNames: string[] = ["Common", "Rare", "Elite", "Super-Rare", "Ultra-Rare", "All"];
  statusNames: string[] = ["W.I.P", "Unobtained", "Maxed", "All"];

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

  toggleTechType() {
    this.misc.filteringMaxTech = !this.misc.filteringMaxTech;
    this.filter.filter();
  }
}

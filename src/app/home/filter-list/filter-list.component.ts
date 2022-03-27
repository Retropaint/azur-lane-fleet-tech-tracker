import { Component, Input, OnInit } from '@angular/core';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-filter-list',
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.scss', '../home.page.scss'],
})
export class FilterListComponent implements OnInit {

  // names are absolutely positioned, so that they don't shift depending on if the image is loaded. Right margins are their offset as they use float: right 
  
  hullNames: string[] = ["DD", "CL", "CA", "CV", "BB", "SS", "Others"]
  hullIconWidths: number[] = [40, 40, 40, 40, 50, 40, 35];
  hullTextRightMargins: number[] = [15, 15, 15, 15, 15, 15, 5];

  factionNames: string[] = ["USS", "HMS", "IJN", "KMS", "ROC", "SN", "FFNF", "MNF", "RN"];
  factionIconWidths: number[] = [40, 30, 40, 32, 32, 40, 32, 32, 40];
  factionTextRightMargins: number[] = [10, 15, 15, 15, 2, 17, 15, 15, 17];
  
  statNames: string[] = ["FP", "TRP", "AVI", "AA", "RLD", "HIT", "ASW", "EVA", "HP"];
  statIconWidths: number[] = [50, 35, 35, 38, 38, 35, 35, 32, 35];
  statTextRightMargins: number[] = [17, 17, 17, 17, 17, 17, 17, 17, 17];

  

  constructor(public filter: FilterService) { }

  ngOnInit() {}
  
  
}

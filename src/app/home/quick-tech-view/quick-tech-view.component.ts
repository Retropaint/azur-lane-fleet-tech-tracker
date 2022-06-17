import { Component, OnInit } from '@angular/core';
import { FilterService } from 'src/app/services/filter.service';
import { HullHierarchyService } from 'src/app/services/hull-hierarchy.service';
import { MiscService } from 'src/app/services/misc.service';
import { ShipsService } from 'src/app/services/ships.service';

@Component({
  selector: 'app-quick-tech-view',
  templateUrl: './quick-tech-view.component.html',
  styleUrls: ['./quick-tech-view.component.scss', '../home.page.scss'],
})
export class QuickTechViewComponent implements OnInit {

  constructor(
    public shipsService: ShipsService, 
    public filter: FilterService, 
    public hullHierarchy: HullHierarchyService,
    public misc: MiscService
  ) { }

  ngOnInit() {}

}

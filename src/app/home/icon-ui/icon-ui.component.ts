import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FilterService } from 'src/app/services/filter.service';
import { ShipsService } from 'src/app/services/ships.service';
import { HomePage } from '../home.page';

@Component({
  selector: 'app-icon-ui',
  templateUrl: './icon-ui.component.html',
  styleUrls: ['./icon-ui.component.scss', '../home.page.scss'],
})
export class IconUIComponent {

  @ViewChildren('categories') categoryElements: QueryList<ElementRef>;

  categoryFoldToggle = {};
  initialScrollY: number;
  initialOffsetTop: number;
  mouse: any;
  isMobile: boolean;
  selectedCategory: string;

  constructor(
    private platform: Platform,
    public home: HomePage,
    public shipsService: ShipsService) {}
  
  async ngAfterViewInit() {
    this.isMobile = this.platform.platforms().includes('mobileweb');
  }

  async openCategoryEditor(selectedCategory: string = null) {
  }

  split() {
  }
}

import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Platform } from '@ionic/angular';
import { CategoryEditorComponent } from 'src/app/prompts/category-editor/category-editor.component';
import { ShipCategoryDataService } from 'src/app/services/ship-category-data.service';
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

  // elements for tutorial anchors
  @ViewChild('filterElement') filterElement: ElementRef;

  constructor(
    public shipCategoryData: ShipCategoryDataService, // if it shows 'unused', it's not. HTML uses it
    private platform: Platform,
    public home: HomePage,
    private categoryEditor: CategoryEditorComponent) {}
  
  async ngAfterViewInit() {
    this.isMobile = this.platform.platforms().includes('mobileweb');

    // interval is used so it can keep checking if the user is selecting a preset
    // this is... not the best way to do it, but it's a 'temporary' solution for now
    if(this.shipCategoryData.sortedCategoryNames.length != 0) {
      return;
    }
    
    const interval = setInterval(() => {
      if(this.shipCategoryData.sortedCategoryNames.length != 0) {
        this.shipCategoryData.selectedCategory = this.shipCategoryData.sortedCategoryNames[0];
        clearInterval(interval);
      }
    }, 500)
  }

  clickedCategory(category: string) {
    this.shipCategoryData.selectedCategory = category;
  }

  async openCategoryEditor(selectedCategory: string = null) {
    this.categoryEditor.open(selectedCategory);
  }
}

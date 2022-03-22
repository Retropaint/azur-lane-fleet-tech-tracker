import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CategoryEditorComponent } from 'src/app/prompts/category-editor/category-editor.component';
import { FilterService } from 'src/app/services/filter.service';
import { SheetDragService } from 'src/app/services/sheet-drag.service';
import { ShipCategoryDataService } from 'src/app/services/ship-category-data.service';
import { SheetUIComponent } from '../sheet-ui.component';

@Component({
  selector: 'app-sheet-category',
  templateUrl: './sheet-category.component.html',
  styleUrls: ['./sheet-category.component.scss', '../sheet-ui.component.scss'],
})
export class SheetCategoryComponent implements AfterViewInit {

  @ViewChild('header') headerElement: ElementRef;
  @Input() category: string;
  @Input() index: number;
  @Input() isHeaderHighlighted: boolean;
  @Input() belowThisGrid: boolean;

  loadTime: number = 0;

  constructor(public filter: FilterService, 
    public shipCategoryData: ShipCategoryDataService,
    private sheetDrag: SheetDragService,
    private categoryEditor: CategoryEditorComponent
    ) {}

  ngAfterViewInit(): void {
    this.sheetDrag.headerRefs.push(this.headerElement);

    const interval = setInterval(() => {
      this.loadTime++;
      if(this.loadTime > 50) {
        clearInterval(interval);
      }
    })
  }

  openCategoryEditor(category: string) {
    this.categoryEditor.open(category);
  }
}

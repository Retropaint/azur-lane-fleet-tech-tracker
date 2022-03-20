import { AfterContentInit, AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PromptService } from 'src/app/services/prompt.service';
import { ShipCategoryDataService } from 'src/app/services/ship-category-data.service';

@Component({
  selector: 'app-preset-selection',
  templateUrl: './preset-selection.component.html',
  styleUrls: ['./preset-selection.component.scss'],
})
export class PresetSelectionComponent implements AfterViewInit, OnDestroy {

  constructor(private shipCategoryData: ShipCategoryDataService, private modalController: ModalController, private prompt: PromptService) { }

  ngAfterViewInit() {
    this.prompt.init(450);
  }

  selectedPreset(preset: string = null) {
    this.modalController.dismiss(preset);
  }

  ngOnDestroy() {
    this.prompt.exit();
  }
}

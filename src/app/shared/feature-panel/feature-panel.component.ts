import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ShipLevelEditorComponent } from 'src/app/prompts/ship-level-editor/ship-level-editor.component';
import { FilterService } from 'src/app/services/filter.service';
import { MiscService } from 'src/app/services/misc.service';
import { ShipsService } from 'src/app/services/ships.service';

@Component({
  selector: 'app-feature-panel',
  templateUrl: './feature-panel.component.html',
  styleUrls: ['./feature-panel.component.scss', '../../home/home.page.scss'],
})
export class FeaturePanelComponent {

  @Input() uiMode: string;

  constructor(
    public misc: MiscService,
    private modalController: ModalController,
    private shipsService: ShipsService
  ) { }

  toggleBulkSelect() {
    this.misc.isBulkSelect = !this.misc.isBulkSelect;
    if(!this.misc.isBulkSelect && this.misc.bulkSelected.length > 0) {
      this.openLevelEditor();
    }
  }

  selectAllShips() {
    this.shipsService.ships.forEach(ship => {
      if(this.misc.shipsFilterPass[ship.id]) {
        this.misc.bulkSelected.push(ship);
      }
    })
    this.openLevelEditor();
  }

  async openLevelEditor() {
    const modal = await this.modalController.create({
      component: ShipLevelEditorComponent,
      animated: false,
      componentProps: {
        'isBulk': true
      }
    })
    modal.present();
  }
}

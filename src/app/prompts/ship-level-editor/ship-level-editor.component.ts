import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { Ship } from 'src/app/interfaces/ship';
import { FilterService } from 'src/app/services/filter.service';
import { MiscService } from 'src/app/services/misc.service';
import { PromptService } from 'src/app/services/prompt.service';
import { ShipsService } from 'src/app/services/ships.service';

@Component({
  selector: 'app-ship-level-editor',
  templateUrl: './ship-level-editor.component.html',
  styleUrls: ['./ship-level-editor.component.scss', '../../../level-slider.scss'],
})
export class ShipLevelEditorComponent implements OnInit, AfterViewInit {

  @Input() name: string;
  @Input() level: number;
  @Input() ship: Ship;
  @Input() category: string;
  @Input() isBulk: boolean;
  @ViewChild('autoResize') autoResize: ElementRef;
  textLevel: number;
  wasSlider: boolean;
  isObtained: boolean;
  isMainFaction: boolean = false;

  @ViewChild('input') input: ElementRef;

  constructor(
    private prompt: PromptService, 
    private modalController: ModalController, 
    private shipsService: ShipsService, 
    private filter: FilterService,
    private misc: MiscService
  ) { }

  ngOnInit() {
    if(!this.isBulk) {
      if(this.level != 1) {
        this.textLevel = this.level;
      } else {
        this.textLevel = null;
      }
  
      // I have no clue why true on init doesn't work
      if(this.level > 1 || this.ship.isObtained) {
        this.isObtained = true;
      }
    } else {
      this.textLevel = null;
      this.level = 1;
      this.isObtained = false;
      this.name = 'bulk select'
    }

    if(!this.isBulk) {
      switch(this.ship.faction) {
        case 'USS': case 'HMS': case 'KMS': case 'IJN':
          this.isMainFaction = true;
      }
    }

    setTimeout(() => {
      if(!this.misc.isMobile) {
        this.input.nativeElement.focus()
      }
    }, 250)
  }

  ngAfterViewInit() {
    this.prompt.init(this.autoResize.nativeElement.getBoundingClientRect().height, true);
  }

  done() {
    if(this.isBulk) {
      this.misc.bulkSelected.forEach(ship => {
        ship.level = this.getFinalLevel() || this.level;
        ship.isObtained = this.isObtained;
        ship.isBulkSelected = false;
      })
      this.misc.bulkSelected = [];
    } else {
      this.ship.isObtained = this.isObtained;

      // set level
      if(!this.isObtained) {
        this.ship.level = 1;
      } else {
        this.ship.level = this.getFinalLevel() || this.level;
      }
    }

    this.shipsService.refreshCogChipReq(this.misc.shipsFilterPass);
    this.shipsService.save();
    this.filter.filter();
    
    this.modalController.dismiss('done');
  }

  getFinalLevel(): number {
    let finalLevel = Math.min(this.level, 125)
    if(!this.wasSlider) {
      finalLevel = Math.min(this.textLevel, 125)
    }
    return finalLevel;
  }

  // change which input type will be accepted in the end, as text and slider levels are inputted separately
  // they're different to prevent slider from following text input, as it looks awkward
  changeLastInput(wasSlider: boolean) {
    this.wasSlider = wasSlider;
    if(!wasSlider) {
      this.textLevel = this.input.nativeElement.value;
    }

    // since this func is called everytime input gets updated I may as well call it here
    if(this.input.nativeElement.value > 1) {
      this.isObtained = true;
    }
  }

  updateSlider() {
    if(this.textLevel != null) {
      this.level = this.textLevel;
    }
  }

  choseMarker(markerLevel: number) {
    this.isObtained = true;
    this.wasSlider = true;
    this.level = markerLevel;
    this.done();
  }

  setObtained(toggle) {
    this.isObtained = toggle;
  }

  exit() {
    if(this.isBulk) {
      this.misc.bulkSelected.forEach(ship => {
        ship.isBulkSelected = false;
      })
      this.misc.bulkSelected = [];
    }
    this.modalController.dismiss();
  }

  ngOnDestroy() {
    this.prompt.exit();
  }
}

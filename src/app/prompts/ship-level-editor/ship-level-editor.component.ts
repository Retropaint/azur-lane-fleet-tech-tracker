import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { PromptService } from 'src/app/services/prompt.service';

@Component({
  selector: 'app-ship-level-editor',
  templateUrl: './ship-level-editor.component.html',
  styleUrls: ['./ship-level-editor.component.scss', 'level-slider.scss'],
})
export class ShipLevelEditorComponent implements OnInit, AfterViewInit {

  @Input() name: string;
  @Input() level: number;
  textLevel: number;
  wasSlider: boolean;

  @ViewChild('input') input: ElementRef;

  constructor(private prompt: PromptService, private modalController: ModalController) { }

  ngOnInit() {
    this.prompt.init(300);
    this.textLevel = this.level;
  }

  ngAfterViewInit() {
    this.input.nativeElement.focus();
  }

  exit() {
    this.modalController.dismiss();
  }

  done() {
    if(this.wasSlider) {
      this.modalController.dismiss(Math.min(this.level, 125));
    } else {
      this.modalController.dismiss(Math.min(this.textLevel, 125));
    }
  }

  // change which input type will be accepted in the end, as text and slider levels are inputted separately
  // they're different to prevent slider from following text input, as it looks awkward
  changeLastInput(wasSlider: boolean) {
    this.wasSlider = wasSlider;
    if(!wasSlider) {
      this.textLevel = this.input.nativeElement.value;
    }
  }

  updateSlider() {
    this.level = this.textLevel;
  }

  ngOnDestroy() {
    this.prompt.exit();
  }
}

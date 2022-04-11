import { Component, Input, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ShortenedNamesService } from 'src/app/services/shortened-names.service';

@Component({
  selector: 'app-faction-tech-box',
  templateUrl: './faction-tech-box.component.html',
  styleUrls: ['./faction-tech-box.component.scss'],
})
export class FactionTechBoxComponent implements OnInit {

  @Input() fullFactionName: string;
  @Input() level: number

  constructor(public shortenedNames: ShortenedNamesService) { }

  async ngOnInit() {}

}

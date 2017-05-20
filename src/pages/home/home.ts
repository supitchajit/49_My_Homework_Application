import { Component, NgZone } from "@angular/core";
import { ModalController, NavController, Platform } from 'ionic-angular';  
import { TakeNote } from '../../services/note.service';  
import { DetailsPage } from '../details/details';  

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {  
    public notes = [];

    constructor(private takeNote: TakeNote,
        private nav: NavController,
        private platform: Platform,
        private zone: NgZone,
        private modalCtrl: ModalController) {

    }

    ionViewDidLoad() {
        this.platform.ready().then(() => {
            this.takeNote.initDB();

            this.takeNote.getAll()
                .then(data => {
                    this.zone.run(() => {
                        this.notes = data;
                    });
                })
                .catch(console.error.bind(console));
        });
    }

    showDetail(note) {
        let modal = this.modalCtrl.create(DetailsPage, { note: note });
        modal.present();
    }
}
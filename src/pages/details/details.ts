import { Component } from '@angular/core';  
import { NavParams, ViewController } from 'ionic-angular';  
import { TakeNote } from '../../services/note.service';

@Component({
  selector: 'page-details',
  templateUrl: 'details.html'
})
export class DetailsPage {
    public subject: any = {};  
    public note: any = {};
    public isNew = true;
    public action = 'Add';
    public isoDate = '';

    constructor(private viewCtrl: ViewController,
        private navParams: NavParams,
        private takeNote: TakeNote) {
    }

    ionViewDidLoad() {
        let editNote = this.navParams.get('note');
        let editSub = this.navParams.get('subject');
        if (editNote) {
            this.subject = editSub;
            this.note = editNote;
            this.isNew = false;
            this.action = 'Edit';
            this.isoDate = this.note.Date.toISOString().slice(0, 10);
        }
    }

    save() {
        this.note.Date = new Date(this.isoDate);

        if (this.isNew) {
            this.takeNote.add(this.note)
                .catch(console.error.bind(console));
        } else {
            this.takeNote.update(this.note)
                .catch(console.error.bind(console));
        }

        this.dismiss();
    }

    delete() {
        this.takeNote.delete(this.note)
            .catch(console.error.bind(console));

        this.dismiss();
    }

    dismiss() {
        this.viewCtrl.dismiss(this.note);
    }
}
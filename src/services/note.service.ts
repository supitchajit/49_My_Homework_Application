import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb';
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';

@Injectable()
export class TakeNote {  
    private _db;
    private _notes;

    initDB() {
        PouchDB.plugin(cordovaSqlitePlugin);
        this._db = new PouchDB('notes.db', { adapter: 'cordova-sqlite' });
    }

    add(note) {  
        return this._db.post(note);
    }

    update(note) {  
        return this._db.put(note);
    }

    delete(note) {  
        return this._db.remove(note);
    }

    getAll() {  

        if (!this._notes) {
            return this._db.allDocs({ include_docs: true})
                .then(docs => {

                    // Each row has a .doc object and we just want to send an 
                    // array of note objects back to the calling controller,
                    // so let's map the array to contain just the .doc objects.

                    this._notes = docs.rows.map(row => {
                        // Dates are not automatically converted from a string.
                        row.doc.Date = new Date(row.doc.Date);
                        return row.doc;
                    });

                    // Listen for changes on the database.
                    this._db.changes({ live: true, since: 'now', include_docs: true})
                        .on('change', this.onDatabaseChange);

                    return this._notes;
                });
        } else {
            // Return cached data as a promise
            return Promise.resolve(this._notes);
        }
    }

    private onDatabaseChange = (change) => {  
        var index = this.findIndex(this._notes, change.id);
        var note = this._notes[index];

        if (change.deleted) {
            if (note) {
                this._notes.splice(index, 1); // delete
            }
        } else {
            change.doc.Date = new Date(change.doc.Date);
            if (note && note._id === change.id) {
                this._notes[index] = change.doc; // update
            } else {
                this._notes.splice(index, 0, change.doc) // insert
            }
        }
    }

    // Binary search, the array is by default sorted by _id.
    private findIndex(array, id) {  
        var low = 0, high = array.length, mid;
        while (low < high) {
        mid = (low + high) >>> 1;
        array[mid]._id < id ? low = mid + 1 : high = mid
        }
        return low;
    }

  
}
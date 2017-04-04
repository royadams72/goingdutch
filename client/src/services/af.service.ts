import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Group } from '../models/group.model';
@Injectable()
export class AfService {
    groups:FirebaseListObservable<Group[]>;

    constructor(private _af:AngularFire) {
    this.getGroups();
   }


  getGroups(){
    this.groups = this._af.database.list('/groups') as
    FirebaseListObservable<Group[]>;
    return this.groups;
  }

  setGroup(group){
    console.log(this.groups)
  return this.groups.push(group);
  }
}

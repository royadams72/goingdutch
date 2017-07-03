import { Injectable, EventEmitter, Output} from '@angular/core';
import { HaversineService, GeoCoord} from "ng2-haversine";
import { AfService } from './af.service';
@Injectable()
export class GeoService {
   private userAddress: GeoCoord;
   private conn1;
  constructor(private afService:AfService){}
  public getGeoLocation(location, completed, username){
    this.userAddress = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
      };
      this.conn1 = this.afService.getGroups(completed, username)
      .subscribe((firebaseData) => {console.log(firebaseData)})

  }
}

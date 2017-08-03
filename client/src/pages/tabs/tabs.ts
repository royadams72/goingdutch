import { Component } from '@angular/core';
import { GroupAdminPage } from '../groupadmin/groupadmin';
import { JoinGroupPage } from '../joingroup/joingroup';
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = JoinGroupPage;
  tab2Root = GroupAdminPage;
  tab3Root = JoinGroupPage;
  tab1Params = {completed: false};
  tab3Params = {completed: true };
//  this.tab1Root.selected();

}

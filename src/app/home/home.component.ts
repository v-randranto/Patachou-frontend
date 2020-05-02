import { Component} from '@angular/core';
import { faPlug } from '@fortawesome/free-solid-svg-icons';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  public connectedNb = 0;
  public connectedIcon = faPlug;
}

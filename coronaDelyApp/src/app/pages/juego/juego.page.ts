import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-juego',
  templateUrl: './juego.page.html',
  styleUrls: ['./juego.page.scss'],
})
export class JuegoPage implements OnInit {

  constructor(private router:Router,) { }

  ngOnInit() {
  }
  inicio(){
    this.router.navigate([`/home`]);
  }
}

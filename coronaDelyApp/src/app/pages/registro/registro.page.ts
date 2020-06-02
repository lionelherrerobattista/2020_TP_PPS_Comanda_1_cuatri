import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  
  private object;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.object = this.activatedRoute.snapshot.paramMap.get('object');
  }

}

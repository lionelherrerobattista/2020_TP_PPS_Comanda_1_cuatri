import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
})
export class EncuestaPage implements OnInit {

  object;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router:Router,
  ) { }

  ngOnInit() {
    this.object = this.activatedRoute.snapshot.paramMap.get('object');
  }
  inicio(){
    this.router.navigate([`/home`]);
  }
}

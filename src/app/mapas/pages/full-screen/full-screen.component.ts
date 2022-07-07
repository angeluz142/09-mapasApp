import { Component, OnInit } from '@angular/core';
import * as   mapboxgl from 'mapbox-gl';


@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  styles: [`
    #map {
      height:100%;
      width:100%; 
  }
  `]
})
export class FullScreenComponent implements OnInit {

  constructor() {
   
   }

  ngOnInit(): void {
  
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11',
    center:[ -58.43961915552296,-34.60342442590247],
    zoom:18
    });

  }



}

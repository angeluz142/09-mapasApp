import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as   mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [`
  .map-container {
    height:100%;
    width:100%; 
}

.row {
  background-color:white;
  bottom:50px;
  border-radius:5px;
  left:50px;
  position:fixed;
  padding:10px;
  z-index:9999;
  width:400px;
}


`
  ]
})
export class ZoomRangeComponent implements AfterViewInit {

  mapa!:mapboxgl.Map;
  zoomLevel:number = 10;
  center:[number,number] = [ -58.43961915552296,-34.60342442590247];

  // se dibuja elemento desde viewchild para la utilizacion de +1 mapa en el mismo componente
  // y evitar conflictos con el id del mapa en el html
  @ViewChild('mapa') divMapa!: ElementRef;

  constructor() { }

  ngAfterViewInit(): void {

    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v11',
      center:this.center,
      zoom:this.zoomLevel
      });

      // listener para obtener el zoom actual
      this.mapa.on('zoom', (evt) => this.zoomLevel = this.mapa.getZoom());

      // listener para comprobar zoom en mapa al finalizar la animación
      this.mapa.on('zoomend',(evt) => {
        if(evt.target.getZoom() > 18)
          this.mapa.zoomTo(18);
      });

      //listener para obtener las cordenadas de la propiedad center o punto medio de mapa
      this.mapa.on('move', (evt) => {
        const {lng,lat} = evt.target.getCenter();
        this.center = [lng,lat];
      });
  }

  // Utilizar el destroy para que los listener no queden a la escucha sin utilizar el modulo
   ngOnDestroy(): void {
     this.mapa.off('move', () => {});
     this.mapa.off('zoomend', () => {});
     this.mapa.off('zoom', () => {});
     
   }

  zoomOut(){
    this.mapa.zoomOut();
  }

  zoomIn(){
    this.mapa.zoomIn();
  }

  updateZoom(valor:string){
    this.mapa.zoomTo(Number(valor));
  }

}

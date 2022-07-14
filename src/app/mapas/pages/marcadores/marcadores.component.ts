import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface CustomMarker {
  color: string;
  marker?: mapboxgl.Marker;
  center?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
      .map-container {
        height: 100%;
        width: 100%;
      }

      .marker-list {
        position: fixed;
        top: 20px;
        right: 20px;
        max-height: 150px;
        z-index: 99999;
      }
      .marker-list li {
        cursor: pointer;
      }

      .panel-scroll {
        overflow-y: auto;
      }

      .panel-scroll::-webkit-scrollbar {
        width: 5px;
        height: 5px;
      }
      .panel-scroll::-webkit-scrollbar-button {
        width: 0px;
        height: 0px;
      }
      .panel-scroll::-webkit-scrollbar-thumb {
        background: #fa0092;
        border: 0px none #ffffff;
        border-radius: 50px;
      }
      .panel-scroll::-webkit-scrollbar-thumb:hover {
        background: #df077a;
      }
      .panel-scroll::-webkit-scrollbar-thumb:active {
        background: #000000;
      }
      .panel-scroll::-webkit-scrollbar-track {
        background: #666666;
        border: 0px none #ffffff;
        border-radius: 50px;
      }
      .panel-scroll::-webkit-scrollbar-track:hover {
        background: #666666;
      }
      .panel-scroll::-webkit-scrollbar-track:active {
        background: #333333;
      }
      .panel-scroll::-webkit-scrollbar-corner {
        background: transparent;
      }
    `,
  ],
})
export class MarcadoresComponent implements AfterViewInit {
  mapa!: mapboxgl.Map;
  zoomLevel: number = 10;
  center: [number, number] = [-58.43961915552296, -34.60342442590247];
  marcadores: CustomMarker[] = [];

  // se dibuja elemento desde viewchild para la utilizacion de +1 mapa en el mismo componente
  // y evitar conflictos con el id del mapa en el html
  @ViewChild('mapa') divMapa!: ElementRef;

  constructor() {}

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel,
    });




    // const marker = new mapboxgl.Marker()
    //   .setLngLat(this.center)
    //   .addTo(this.mapa);

    // Se cargan marcadores en caso de existir
     this.loadLocalMarkers();
  }

  focusMarker(marcador: mapboxgl.Marker) {
    console.log(marcador);

    this.mapa.flyTo({ center: marcador.getLngLat() });
  }

  newMarker() {
    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );

    const newMarker = new mapboxgl.Marker({ draggable: true, color })
      .setLngLat(this.center)
      .addTo(this.mapa);

    this.marcadores.push({
      color,
      marker: newMarker,
    });

    // let mappingMarcadoresToSavedMarker = new Map<string,number[]>();

    // for (let item of this.marcadores) {
    //   mappingMarcadoresToSavedMarker.set(item.color,item.marker.getLngLat().toArray());
    // }

    // for (const item of mappingMarcadoresToSavedMarker.entries()) {
    //   console.table(item);

    // }

    this.saveMarkersLocally();
  }

  saveMarkersLocally() {
    let marcadoresToSave: CustomMarker[] = [];

    this.marcadores.forEach((m) => {
      const { lng, lat } = m.marker!.getLngLat();

      marcadoresToSave.push({
        color: m.color,
        center: [lng, lat],
      });
    });

    localStorage.setItem('markers', JSON.stringify(marcadoresToSave));
  }

  loadLocalMarkers() {
    if (localStorage.getItem('markers')) {
      const marcadores: CustomMarker[] = JSON.parse(
        localStorage.getItem('markers')!
      );

      marcadores.forEach((m) => {
        const loadedMarker = new mapboxgl.Marker({
          color: m.color,
          draggable: true,
        })
          .setLngLat(m.center!)
          .addTo(this.mapa);

          this.marcadores.push({
            color:m.color,
            marker:loadedMarker
          });

          loadedMarker.on('dragend',() =>{
            this.saveMarkersLocally()
          });
      });
    }
  } // loadLocalMarkers

  deleteMarker(item:number){
    this.marcadores[item].marker?.remove();
    this.marcadores.splice(item,1);
    this.saveMarkersLocally();
  }
}

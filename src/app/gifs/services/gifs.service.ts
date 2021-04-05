import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interface/gifs-intergace';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = 'WdWk8LlwH3UYGgqMKzU40s7BPAVBoYli';
  private servicioURL: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];
  public resultado: Gif[] = [];

  get historial(){
  
    return [...this._historial];
  }

  constructor(private http: HttpClient){

    localStorage.getItem('historial');
    if(localStorage.getItem('historial')){
      this._historial= JSON.parse(localStorage.getItem('historial')!);
    } 

    //Otra manera de hacerlo en una linea
    //this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultado = JSON.parse(localStorage.getItem('resultado')!) || [];

  }

  buscarGifs(query:string) {
    query=query.trim().toLocaleLowerCase();

    if(!this._historial.includes(query)){
      this._historial.unshift(query);
      this._historial = this._historial.splice(0,10);

      localStorage.setItem('historial', JSON.stringify(this._historial));

    }

    //para parametrizar la búsqueda de la petición http
    const parametros = new HttpParams()
            .set('api_key', this.apiKey)
            .set('limit','50')
            .set('q', query);

    //console.log(parametros);


    this.http.get<SearchGifsResponse>(`${this.servicioURL}/search`, {params: parametros} )
    .subscribe((resp) =>{
      //console.log(resp.data);
      this.resultado= resp.data;
      localStorage.setItem('resultado', JSON.stringify(this.resultado)); //para guardar
    })

    
  }


}

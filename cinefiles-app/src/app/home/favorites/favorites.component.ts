import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, Input, SimpleChanges } from '@angular/core';
import { HomeComponent } from '../home.component';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent {
  @Input() toggle:boolean | undefined;
constructor(private home:HomeComponent,private http:HttpClient,private router:Router){

  }
  movies:Array<any>=[];
  async ngOnInit(){
    this.router.navigateByUrl('home/refresh1', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/home/favorites']);
    }); 
    for(let i of this.home.userData.movies_liked){
      // this.http.get("http://localhost:9000/getMovieById/" + i).subscribe(async (resp) => {
      //   this.movies.push(resp);
      // })
      const movie = await this.http.get("http://localhost:9000/getMovieById/" + i).toPromise()
      this.movies.push(movie)
    }
  }

  // ngOnChanges(changes:SimpleChanges){
  //   this.movies=[]
  //   for(let i of this.home.userData.movies_liked){
  //     this.http.get("http://localhost:9000/getMovieById/"+i).subscribe((resp)=>{
  //       this.movies.push(resp)
  //     })
  //   }
  // }



}

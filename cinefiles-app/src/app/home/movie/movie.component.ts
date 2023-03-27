import { HomeComponent } from './../home.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent {
  @ViewChild('likeButton') likeButton: any;
  @ViewChild('watchlistButton') watchlistButton: any;
    constructor(private http:HttpClient,private route:ActivatedRoute,public router:Router, public home:HomeComponent){

    }
    movieId:any=""
    movieData:any
    type:string=""
    user:any
    review:any
    temp:any
    moviereviews:Array<any>=[]
    emptyreview:String=""
    ratingcontrol=new FormControl(0);
    rating:any


    async ngOnInit() {
      this.movieId = this.route.snapshot.paramMap.get('id');
      this.movieData = await this.http.get("http://localhost:9000/getMovieById/" + this.movieId).toPromise();    
      for (let i of this.movieData.reviews) {
        this.user = await this.http.get("http://localhost:9000/getUserByUserId/" + i.userId).toPromise();
        this.review = await this.http.get("http://localhost:9000/getReviewById/" + i.reviewId).toPromise();
        this.temp = {
          "userdata": this.user,
          "reviewdata": this.review
        };
        this.moviereviews.splice(0,0,this.temp)
      }

      for(let rating of this.home.userData.ratings){
        if(rating.movie==this.movieData._id){
          this.rating=rating.rating
          break
        }
      }
    }

    // async ngOnChanges(changes:SimpleChanges):Promise<void>{
    //   this.movieId = this.route.snapshot.paramMap.get('id');
    //   this.movieData = await this.http.get("http://localhost:9000/getMovieById/" + this.movieId).toPromise();    
    //   for (let i of this.movieData.reviews) {
    //     this.user = await this.http.get("http://localhost:9000/getUserByUserId/" + i.userId).toPromise();
    //     this.review = await this.http.get("http://localhost:9000/getReviewById/" + i.reviewId).toPromise();
    //     this.temp = {
    //       "userdata": this.user,
    //       "reviewdata": this.review
    //     };
    //     this.moviereviews.splice(0,0,this.temp)
    //   }
    // }
      addLike(id:string){
        this.http.put("http://localhost:9000/likeReview/"+this.home.userData.username+"/"+id,this.http).subscribe(resp=>{
          console.log(resp)
        })
      }
      addReview(reveiwstring:String){
        console.log(reveiwstring)
        console.log(this.home.userData.username)
        this.temp={"review":reveiwstring}
        this.http.post("http://localhost:9000/addReview/"+this.home.userData.username+"/"+this.movieData._id,this.temp).subscribe(resp=>{
          console.log("review added")
          
          //refreshing the page
          this.router.navigateByUrl('home/refresh1', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/home/movie/'+this.movieData._id]);
        }); 
        })
      }

    like(){
      console.log("this.likeButton.nativeElement.classList")
      if(this.likeButton.nativeElement.classList.contains("fa-regular")){
      this.likeButton.nativeElement.classList.remove("fa-regular")
      this.http.put("http://localhost:9000/likes/"+this.movieData._id+"/"+this.home.userData.username,{}).subscribe(resp=>{
        console.log(resp)
        this.home.likeToggle()
      })
      this.likeButton.nativeElement.classList.add("fa-solid")
      
    }
    else{
      this.likeButton.nativeElement.classList.remove("fa-solid")
      this.http.put("http://localhost:9000/unlikeMovie/"+this.movieData._id+"/"+this.home.userData.username,{}).subscribe(resp=>{
        console.log("ds"+this.home.userData.username)
        console.log(resp)
        this.home.likeToggle()
      })
      this.likeButton.nativeElement.classList.add("fa-regular")
    }
    
  }

  changeWatchlist(){
    if(this.watchlistButton.nativeElement.classList.contains("fa-regular")){
      this.watchlistButton.nativeElement.classList.remove("fa-regular")
      this.http.put("http://localhost:9000/watchlist/"+this.movieData._id+"/"+this.home.userData.username,{}).subscribe(resp=>{
        console.log(resp)
      })
      this.watchlistButton.nativeElement.classList.add("fa-solid")
      
    }
    else{
      this.watchlistButton.nativeElement.classList.remove("fa-solid")
      this.http.put("http://localhost:9000/removeFromWatchlist/"+this.movieData._id+"/"+this.home.userData.username,{}).subscribe(resp=>{
        console.log("ds"+this.home.userData.username)
        console.log(resp)
      })
      this.watchlistButton.nativeElement.classList.add("fa-regular")
    }
  }

  rateMovie(){
    console.log(this.ratingcontrol.value)
    this.http.put("http://localhost:9000/rateMovie/"+this.home.userData.username+"/"+this.movieData._id,{"rating":this.ratingcontrol.value}).subscribe(resp=>{
      console.log(resp)
  })
  }
}

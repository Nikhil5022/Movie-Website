import { HomeComponent } from './../home.component';
import { HttpClient } from '@angular/common/http';
import { Component,OnChanges, SimpleChanges,Input } from '@angular/core';
import {ActivatedRoute} from '@angular/router'

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnChanges {
  @Input() searchTerm:string | undefined;
  constructor(private http:HttpClient, private home:HomeComponent,private route:ActivatedRoute){

  }
  term:any
  ngOnChanges(changes: SimpleChanges): void {
    this.term=this.searchTerm
  }

  

  ngOnInit(){
    
  }




}
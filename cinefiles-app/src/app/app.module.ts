import { SearchResultsComponent } from './home/search-results/search-results.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import {HttpClientModule} from '@angular/common/http';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { WatchlistComponent } from './home/watchlist/watchlist.component';
import { FeedComponent } from './home/feed/feed.component';
import { FavoritesComponent } from './home/favorites/favorites.component';
import { MovieComponent } from './home/movie/movie.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Refresh1Component } from './home/refresh1/refresh1.component';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';



@NgModule({
  declarations: [ 
    AppComponent,
    HomeComponent,
    LandingComponent,
    RegistrationPageComponent,
    WatchlistComponent,
    SearchResultsComponent,
    FeedComponent,
    FavoritesComponent,
    MovieComponent,
    Refresh1Component,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    NgbModule,
    ShareButtonsModule,
    ShareIconsModule

    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

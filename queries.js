
const schemas = require('./schemas.js')

//const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');

mongoose.set("strictQuery", false);

const User = mongoose.model("User",schemas.user)
const Movie = mongoose.model("Movie",schemas.movie)
const Review =mongoose.model("Review",schemas.review)

async function addUser(userData){
    const newUser = new User(userData)
    const userExists = await User.findOne({username:newUser.username})
    if(userExists==null){
        newUser.displayName = newUser.firstName+" "+newUser.lastName
        if(newUser.dob!=undefined){
            birth_year=Number(newUser.dob.toISOString().substring(0, 4));
            var today = new Date();
            this_year=Number(today.toISOString().substring(0, 4));
            newUser.age=this_year-birth_year
        }
        newUser.save()
        return "User Added"
    }
    else{
        return "Provide a unique username"
    }
    
}
async function deleteUser(username){
    try{
        const user = await User.findOne({"username":username})
        if(user!=null){
            await User.deleteOne({"username":username})
            return "User deleted"
        }
        else{
            return "User not found"
        }
        
    }
    catch(e){
        return e.message
    }
    
} 
async function getUser(username){
    // const user=new User(userData)
    const user=await User.findOne({"username":username})
    if(user!=null){
        return user
    }
    else{
        return "User Not Found"
    }
}
async function getMoviebyId(movieid){
    const movie=await Movie.findById(movieid)
    if(movie!=null){
        return movie
    }
    else{
        return "Movie Not Found"
    }
}
async function addMovie(imdbID){
    url=`https://www.omdbapi.com/?i=${imdbID}&apikey=20284f8e`
    console.log(url)

    movieData = await fetch(url)
	.then(res => res.json())
	.then(json => {
        return json
    })
	.catch(err => console.error('error:' + err));
    
    body={
        "name":movieData.Title,
        "release":movieData.Released,
        "description":movieData.Plot,
        "genres":movieData.Genre,
        "poster":movieData.Poster,
        "cast":movieData.Actors,
        "directors":movieData.Director,
        "writers":movieData.Writer,
        "country":movieData.Country,
        "language":movieData.Language,
        "type":movieData.Type,
        "imdbID":movieData.imdbID,
        "seasons":movieData.totalSeasons
    }

    const newMovie = new Movie(body)
    const movieExists = await Movie.findOne({"imdbID":newMovie.imdbID})

    if(movieExists==null){
        newMovie.save()
        return "Movie added"
    }
    else{
        return "Movie exists"
    }
}

async function getMovieByFullName(name){
    const movie = await Movie.findOne({"name":name})

    if(movie==null){
        return "Can't find movie"
    }
    else{
        return movie
    }
}


async function addReview(username,movieId,review){
    const user=await User.findOne({"username":username})
    const movie=await Movie.findById(movieId);
    if(user==null)
    {
        return "User not found"
    }
    if(movie==null)
    {
        return "Movie not found"
    }
    body={
        "user":user._id,
        "movie":movieId,
        "review":review
    }
    const newReview=await new Review(body)
    newReview.save()
    user.reviews.push({"movieId":movieId,"reviewId":newReview._id})
    movie.reviews.push({"userId":user._id,"reviewId":newReview._id})
    user.save()
    movie.save()
    return [newReview,user,movie]
}
async function likes(movieid,username){
    const movie=await Movie.findById(movieid)
    const user=await User.findOne({"username":username})
    if(movie!=null && user!=null){
        movie.likes=movie.likes+1
        movie.likers.push(user.username)
        user.movies_liked.push(movie.id)
        movie.save()
        user.save()
        return "Liked movie "+movie.name
        
    }
    if(movie==null){
        return "no movie found"
    }
    if(user==null){
        return "no user found"
    }    
}

async function watchList(movieid,username){
    const movie=await Movie.findById(movieid)
    const user=await User.findOne({"username":username})
    if(user!=null && movie!=null){
        user.watchlist.push(movie.id)
        user.save()
        return "movie added to watchlist"
    }
    if(user==null){
        return "no user found"
    }
    if(movie==null){
        return "no movie found"
    }
    
}

module.exports.getUser=getUser
module.exports.deleteUser=deleteUser
module.exports.addUser = addUser
module.exports.addMovie = addMovie
module.exports.getMovieByFullName = getMovieByFullName
module.exports.getMoviebyId=getMoviebyId
module.exports.addReview=addReview
module.exports.likes=likes
module.exports.watchList=watchList

const schemas = require('./schemas.js')

//const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');

mongoose.set("strictQuery", false);

const User = mongoose.model("User",schemas.user)
const Movie = mongoose.model("Movie",schemas.movie)

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
        return e.mesage
    }
    
} 

async function addMovie(imdbID){
    url=`https://www.omdbapi.com/?i=${imdbID}&apikey=20284f8e`

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
module.exports.getUser=getUser
module.exports.deleteUser=deleteUser
module.exports.addUser = addUser
module.exports.addMovie = addMovie
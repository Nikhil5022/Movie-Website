
const schemas = require('./schemas.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const confidential = require('./confidential.js')

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
        await newUser.save()
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
    await user.save()
    await movie.save()
    // return [newReview,user,movie]
    return {message:"review posted"}
}
async function likes(movieid,username){
    const movie=await Movie.findById(movieid)
    const user=await User.findOne({"username":username})
    if(movie!=null && user!=null){
        if(movie.likers.includes(username)){
            return "Movie is already liked"
        }
        movie.likes=movie.likes+1
        movie.likers.push(user.username)
        user.movies_liked.push(movie.id)
        await movie.save()
        await user.save()
        return {"updated entries":[user,movie]}
        
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
        if(user.watchlist.includes(movieid)){
            return "Movie already exists"
        }
        user.watchlist.push(movie.id)
        await user.save()
        return "movie added to watchlist"
    }
    if(user==null){
        return "no user found"
    }
    if(movie==null){
        return "no movie found"
    }
    
}
 
async function followUser(username1,username2){   //user 1 following user2
    const user1=await User.findOne({"username":username1})
    const user2=await User.findOne({"username":username2})
    if(user1!=null && user2!=null){
        var index=user1.following.indexOf(user2.username)
        if(index==-1)
        {
            user1.following.push(user2.username)
            user2.followers.push(user1.username)
            user1.number_of_followings+=1
            user2.number_of_followers+=1
            await user1.save()
            await user2.save()
            return `${user1.username} following ${user2.username}`
        }
        else{
            return `Already following`
        }
    }
    else if(user1==null){
        return "no user found"
    }
    else if(user2==null){
        return "no user found"
    }
}

async function addCommentOnReview(username,reviewId,comment){
    const user=await User.findOne({"username":username})
    const review=await Review.findById(reviewId)
    if(user!=null && review!=null)
    {
        user.comments.push({"reviewId":reviewId,"comment":comment})
        review.comments.push({"username":username,"comment":comment})
        await user.save()
        await review.save()
        return {"updated entries":[user,review]}
    }
    else if(user==null){
        return "no user found"
    }
    else if(review==null)
    {
        return "no review found"
    }
}

async function addToFaves(username,movieId){
    const user=await User.findOne({"username":username})
    const movie=await Movie.findById(movieId)
    if(user==null){
        return "no user found"
    }
    if(movie==null){
        return "no movie found"
    }
    if(user.favorite_films.length<5)
    {
        if(user.favorite_films.includes(movieId))
        {
            return "Movie is already in the list"
        }
        user.favorite_films.push(movieId)
        await user.save()
        return {"updated entries": [user]}
    }
    return "List is Full"
}

async function removeFromFaves(username,movieId){
    const user=await User.findOne({"username":username})
    const movie=await Movie.findById(movieId)
    if(user==null){
        return "no user found"
    }
    if(movie==null){
        return "no movie found"
    }
    if(user.favorite_films.length>0)
    {
        if(user.favorite_films.includes(movieId))
        {
            index=user.favorite_films.indexOf(movieId)
            user.favorite_films.splice(index,1)
            await user.save()
            return {"updated entries": [user]}
        }
        return "Not in list"
    }
    return "List is Empty"
}

async function likeReview(username,reviewId){
    const user=await User.findOne({"username":username})
    const review=await Review.findById(reviewId)
    if(user!=null && review!=null)
    {
        if(review.likers.includes(username)){
            return "Already liked the post"
        }
        user.reviews_liked.push(reviewId)
        review.likers.push(username)
        review.likes+=1
        await user.save()
        await review.save()
        return {"updated entries":[user,review]}
    }
    else if(user==null){
        return "no user found"
    }
    else if(review==null)
    {
        return "no review found"
    }
}



async function unfollowuser(username_1,username_2){//username 1 unfollow username2
    const username1=await User.findOne({"username":username_1})
    const username2=await User.findOne({"username":username_2})
    
    if(username1!=null && username2!=null){
        var index=username1.following.indexOf(username2.username)
        if(index==-1){
            return "user does not exist in following list"
        }
        username1.following.splice(index,1)
        username1.number_of_followings=username1.number_of_followings-1
        var index=username2.followers.indexOf(username1.username)
        username2.followers.splice(index,1)
        username2.number_of_followers=username2.number_of_followers-1
        await username1.save()
        await username2.save()
        return username1.username+" unfollowed "+username2.username
    }
    if(username1==null||username2==null){
        return "user not found"
    }
}

async function rateMovie(username,movieID,rating){
    const user = await User.findOne({"username":username})
    const movie = await Movie.findById(movieID)
    console.log(user)

    for(let i of movie.ratings){
        if(i.username==user.username){
            oldRating=i.rating
            sumOfRatings=movie.avgRating*movie.ratings.length
            sumOfRatings=sumOfRatings-oldRating
            if(movie.ratings.length==1){
                movie.avgRating=0
            }
            else{
                movie.avgRating=sumOfRatings/(movie.ratings.length-1)
            }
            
            index=movie.ratings.indexOf(i)
            movie.ratings.splice(index,1)
            index=user.ratings.indexOf({"movie":movie._id,"rating":oldRating})
            user.ratings.splice(index,1)
            console.log(user)
            console.log(movie)
            break
        }
    }
    if(movie.ratings.length==0){sumOfRatings=0}
    else{
    sumOfRatings=movie.avgRating*movie.ratings.length
    }
    console.log("sr"+sumOfRatings)
    movie.avgRating=(sumOfRatings+Number(rating))/(movie.ratings.length+1)

    movie.ratings.push({"username":user.username,"rating":rating})
    user.ratings.push({"movie":movieId,"rating":rating})

    await user.save()
    await movie.save()
    return {"Updated Entries":[user,movie]}
}


async function removefromwatchlist(movieid,username){
    const user=await User.findOne({"username":username})
    if(user==null){
        return "user not found"
    }
    const movie=await Movie.findById(movieid)
    if(movie==null){
        return "movie not found"
    }
    var index=user.watchlist.indexOf(movieid)
    if(index!=-1){
        user.watchlist.splice(index,1)
        await user.save()
        return movie.name+" removed from watchlist"
    }
    else{
        return "movie not in watchlist"
    }
    
}

async function unlikeMovie(username,movieId){
    const movie=await Movie.findById(movieId)
    const user=await User.findOne({"username":username})
    if(user==null){
        return "User doesn't exist"
    }
    if(movie==null){
        return "Movie doesn't exist"
    }

    if(!movie.likers.includes(username)){
        return "User did not like this post"
    }

    userIndex = movie.likers.indexOf(username)
    movie.likers.splice(userIndex,1)
    movie.likes-=1
    movieIndex=user.movies_liked.indexOf(movieId)
    user.movies_liked.splice(movieIndex,1)
    await user.save()
    await movie.save()
    return {"updated entries":[user,movie]}
}


async function getReviewById(reviewId){
    review = await Review.findById(reviewId)

    if(review==null){
        return {"message":"Review not found"}
    }

    return review
}


async function getReviewOfUser(username){
    user=await User.findOne({"username":username})
    if(user==null){
        return {"message":"user not found"}
    }
    var allReviews=[]
    for(i of user.reviews){
        allReviews.push(i.reviewId)
    }
    return allReviews
}

async function getReviewsByMovieId(movieid){
    movie=await Movie.findById(movieid)
    if(movie==null){
        return {"message":"movie not found"}
    }
    allReviews=[]
    for(i of movie.reviews){
        allReviews.push(i.reviewId)
    }
    return allReviews
}

async function registerUser(registrationForm){
    var possibleUser1 = await User.findOne({email:registrationForm["email"]})
    var possibleUser2 = await User.findOne({username:registrationForm["username"]})
    if(possibleUser1){
        console.log(possibleUser1)
        return {message:"User already exists"}
    }
    else if(possibleUser2){
        return {message:"Username is already in use"}
    }
    else{
        
        
        try{
            registrationForm["password"]= await bcrypt.hash(registrationForm["password"],10)
            const newUser = await new User(registrationForm)
            if(!("displayName" in registrationForm) || registrationForm.displayName==""){
                newUser.displayName=newUser.firstName+" "+newUser.lastName
            }
            await newUser.save()
    
            const token = jwt.sign({email: newUser.email,id:newUser._id},confidential.SECRET_KEY)
            return {"message":"User Registered","token":token}
        }
        catch(err){
                console.log(err)
                return {"message":"Not enough details provided"}
        }
        
    }
}

async function loginUser(email,password){
    var possibleUser = await User.findOne({email:email})

    if(possibleUser==null){
        return {"message":"User doesn't exist"}
    }
    const matchPassword = await bcrypt.compare(password,possibleUser.password)

    if(!matchPassword){
        return {"message":"Wrong Password"}
    }

    const token = await jwt.sign({email:possibleUser.email,id:possibleUser._id},confidential.SECRET_KEY)
    return {"message":"User Logged In","token":token}
}

async function getUserByEmail(email){
    const user=await User.findOne({"email":email})
    if(user!=null){
        return user
    }
    return {"message":"User Not Found"}
}


async function getWatchlistOfUser(username){
    const user=await User.findOne({"username":username})
    if(user!=null){
        return user.watchlist
    }
    return {"message":"User Not Found"}
}

async function searchMovie(movie){
    const movies = await Movie.find({ 'name' : { '$regex' :movie, '$options' : 'i' }})

    if(movies.length==0){
        return {"message":"No Results Found"}
    }
    return movies
}

async function getUserByUserId(userid){
    const user=await User.findById(userid)
    if(user!=null){
        return user
    }
    return {"message":"User Not Found"}
}



module.exports.getUserByUserId=getUserByUserId
module.exports.getUser=getUser
module.exports.deleteUser=deleteUser
module.exports.addUser = addUser
module.exports.addMovie = addMovie
module.exports.getMovieByFullName = getMovieByFullName
module.exports.getMoviebyId=getMoviebyId
module.exports.addReview=addReview
module.exports.likes=likes
module.exports.watchList=watchList
module.exports.unfollowuser=unfollowuser
module.exports.followUser=followUser
module.exports.rateMovie=rateMovie
module.exports.addCommentOnReview=addCommentOnReview
module.exports.addToFaves=addToFaves
module.exports.removeFromFaves=removeFromFaves
module.exports.likeReview=likeReview
module.exports.removefromwatchlist=removefromwatchlist
module.exports.unlikeMovie=unlikeMovie
module.exports.getReviewById=getReviewById
module.exports.getReviewOfUser=getReviewOfUser
module.exports.getReviewsByMovieId=getReviewsByMovieId
module.exports.registerUser=registerUser
module.exports.loginUser=loginUser
module.exports.getUserByEmail=getUserByEmail
module.exports.getWatchlistOfUser=getWatchlistOfUser
module.exports.searchMovie=searchMovie
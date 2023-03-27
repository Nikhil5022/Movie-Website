
const schemas = require('./schemas.js')
const queries = require('./queries.js')
const fetch = require("node-fetch");
const confidential = require('./confidential.js')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const { response } = require('express');
const { json } = require('body-parser');
const port=9000
const app = express()
app.use(express.json())
app.use(cors({
    origin:'http://localhost:4200'
}
))


mongoose.connect(confidential.MONGODB_URI).then(()=>{
    console.log('connected to database')
}).catch((err)=>{console.log(err)})

app.use("/verify",(req,res,next)=>{
    try{
        
        let token=req.headers.authorization 

        if(token!=null){
            console.log(token)
            token=token.split(" ")[1]
            let user = jwt.verify(token,confidential.SECRET_KEY)
            console.log(user.email)
            req.userEmail=user.email
        }
        else{
            res.sendStatus(401).json({message:"unauthorised user"})
        }
        next()
    }
    catch(error){
        console.log(error)
        res.sendStatus(201).json({message:"Unauthorized user"})
    }
})

app.get("/verify",(req,res)=>{
    res.send({"userEmail":req.userEmail})
})


app.post("/addUser",(req,res)=>{
    userData=req.body 

    queries.addUser(userData).then(response=>{
        res.send("user added")
        res.send(response)
    }).catch(err=>{
        res.send(err)
    })
})

app.get("/getUser/:username",(req,res)=>{
    username=req.params.username
    queries.getUser(username).then(response=>{
        if(response=="User Not Found"){
            res.send({"message":response})
        }
        else{
            res.send(response)
        }
    })
})

app.get("/getUserByEmail/:email",(req,res)=>{
    email=req.params.email
    queries.getUserByEmail(email).then(response=>{
        
        res.send(response)
        
        
    })
})

app.get("/getMovieByFullName/:movieName",(req,res)=>{
    movieName=req.params.movieName
    queries.getMovieByFullName(movieName).then(response=>{
        if(response=="Can't find movie"){
             res.send({"message":response})
        }
        else{
            res.send(response)
        }
    })
})

app.get("/getReviewById/:reviewId",(req,res)=>{
    reviewId=req.params.reviewId
    queries.getReviewById(reviewId).then(response=>{
        res.send(response)
    })
})

//delete methods
app.delete("/deleteUser/:username",(req,res)=>{
    username=req.params.username
    queries.deleteUser(username).then(response=>{
        res.send({"message":response})
    })
})

app.get("/getMovieById/:id",(req,res)=>{
    ids=req.params.id
    console.log(ids)
    queries.getMoviebyId(ids).then(response=>{
        if(response=="Movie Not Found"){
            res.send({"message":response})
        }
        else{
            res.send(response)
        }
    })
})

app.post("/addReview/:userId/:movieId",(req,res)=>{
    userId=req.params.userId
    movieId=req.params.movieId
    review=req.body["review"]
    queries.addReview(userId,movieId,review).then(response=>{
        if(response=="User not found" || response=="Movie not found"){
            res.send({"message":response})
        }
        res.send(response)
    })
})

app.post("/addMovie/:imdbID",(req,res)=>{
    imdbID=req.params.imdbID
    queries.addMovie(imdbID).then(response=>{
        res.send(response)
    })
})


app.post("/registerUser",(req,res)=>{
    registrationForm=req.body 
    queries.registerUser(registrationForm).then(response=>{
        res.send(response)
    })
})

app.post("/loginUser",(req,res)=>{
    const {email,password} = req.body
    queries.loginUser(email,password).then(response=>{
        res.send(response)
    })
})


app.put("/likes/:movieid/:username",(req,res)=>{
    id=req.params.movieid
    username=req.params.username
    queries.likes(id,username).then(response=>{
        
        res.send({"message":response})
        
    })
})

app.put("/unlikeMovie/:movieId/:username",(req,res)=>{
    movieId=req.params.movieId
    username=req.params.username
    queries.unlikeMovie(username,movieId).then(response=>{
        res.send({"message":response})
    })
})




app.put("/watchlist/:movieid/:username",(req,res)=>{
    id=req.params.movieid
    username=req.params.username
    queries.watchList(id,username).then(response=>{
        if(response=="no movie found"|| response=="no user found"){
            res.send({"message":response})
        }
        res.send(response)
    })
})


app.put("/followUser/:user1/:user2",(req,res)=>{
    user1=req.params.user1
    user2=req.params.user2
    queries.followUser(user1,user2).then(response=>{
        if(response=="no user found"){
            res.send({"message":response})
        }
        res.send(response)
    })
})

app.put("/unFollowUser/:username1/:username2",(req,res)=>{
    user1=req.params.username1
    user2=req.params.username2
    queries.unfollowuser(user1,user2).then(response=>{
        if(response=="user not found"||response=="user does not exist in followers list"){
            res.send({"message":response})
        }
        res.send(response)
    })
})

app.post("/addComment/:username/:reviewId",(req,res)=>{
    username=req.params.username
    reviewId=req.params.reviewId;
    comment=req.body["comment"]
    queries.addCommentOnReview(username,reviewId,comment).then(response=>{
        res.send({"message":response})
    })
})


app.put("/rateMovie/:username/:movieId",(req,res)=>{
    username=req.params.username
    movieId=req.params.movieId
    rating=req.body["rating"]
    console.log("here")
    queries.rateMovie(username,movieId,rating).then(response=>{
        res.send({"message":response})
    })
})

app.put("/addToFaves/:username/:movieId",(req,res)=>{
    username=req.params.username
    movieId=req.params.movieId
    queries.addToFaves(username,movieId).then(response=>{
        res.send({"message":response})
    })
})

app.put("/removeFromFaves/:username/:movieId",(req,res)=>{
    username=req.params.username
    movieId=req.params.movieId
    queries.removeFromFaves(username,movieId).then(response=>{
        res.send({"message":response})
    })
})



app.put("/likeReview/:username/:reviewId",(req,res)=>{
    username=req.params.username
    reviewId=req.params.reviewId
    queries.likeReview(username,reviewId).then(response=>{
        res.send({"message":response})
    })
})



app.put("/removefromwatchlist/:movieid/:username",(req,res)=>{
    user=req.params.username
    movie=req.params.movieid
    queries.removefromwatchlist(movie,user).then(response=>{
        if(response=="movie not found"|| response=="user not found"|| response=="movie not in watchlist"){
            res.send({"message":response})
        }
        else{
            res.send(response)
        }
    })
})


app.get("/getReviewsOfUser/:username",(req,res)=>{
    user=req.params.username
    queries.getReviewOfUser(user).then(response=>{
        res.send(response)
    })
})


app.get("/getReviewsByMovie/:movieid",(req,res)=>{
    movie=req.params.movieid
    queries.getReviewsByMovieId(movie).then(response=>{
        res.send(response)
    })
})

app.get("/getWatchlistOfUser/:username",(req,res)=>{
    user1=req.params.username
    queries.getWatchlistOfUser(user1).then(response=>{
        res.send(response)
    })
})

app.get("/searchMovie/:movieName",(req,res)=>{
    movie=req.params.movieName

    queries.searchMovie(movie).then(response=>{
        res.send(response)
    })
})

app.get("/getUserByUserid/:userid",(req,res)=>{
    userid=req.params.userid
    queries.getUserByUserId(userid).then(response=>{
        res.send(response)
    })
})

app.listen(port,()=>{
    console.log('listening at port '+port)
})









const schemas = require('./schemas.js')
const queries = require('./queries.js')
const fetch = require("node-fetch");


const express = require('express')
const mongoose = require('mongoose')
const { response } = require('express');
const { json } = require('body-parser');
const port=9000
const app = express()
app.use(express.json())

mongoose.connect('mongodb+srv://poirot22:moviepro@moviesdb.6iptvma.mongodb.net/moviesite').then(()=>{
    console.log('connected to database')
}).catch((err)=>{console.log(err)})


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

app.get("/addMovie/:imdbID",(req,res)=>{
    imdbID=req.params.imdbID
    queries.addMovie(imdbID).then(response=>{
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
app.listen(port,()=>{
    console.log('listening at port '+port)
})
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const event = require('./data')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('styles'))


mongoose.connect("mongodb+srv://srudra1024:Ninja2789@cluster0.vf67anc.mongodb.net/?retryWrites=true&w=majority")

app.use(express.json())
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('donatep')
})


app.get('/new', (req, res) => {
    console.log('suc')
    res.send('Haji')
})

app.post('/new', makeEvent, (req, res) => {
    console.log(JSON.stringify(req.body.day));
    //console.log( req.body.month + req.body.day + req.body.time + req.body.location + req.body.swipes);
    res.send(req.body.month);
    
    
    
})

app.listen(3000, () => {
    console.log("HI")
})

async function makeEvent(req, res, next) {

    try{
        var tempEvent = await event.create({
            date: new Date(2023, req.body.month, req.body.day, req.body.time),
            location: req.body.location,
            swipes: req.body.swipes
        })
        console.log('Event made Succesfully')
    }catch(e) {
        console.log(e.message)
    }
    
    
    next()
}



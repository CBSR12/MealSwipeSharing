const express = require('express')
const app = express()
const mongoose = require('mongoose')
const event = require('./data')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('styles'))
var eventArray = [];


mongoose.connect("mongodb+srv://srudra1024:Ninja2789@cluster0.vf67anc.mongodb.net/?retryWrites=true&w=majority")

app.use(express.json())
app.set('view engine', 'ejs')

//Routes
app.get('/', (req, res) => {
    res.render('mainp')
})

app.get('/hungry', findEvent, (req, res) => {
    res.render('hungryp', {events: eventArray})
})

app.get('/donate', (req, res) => {
    
     res.render('donatep')
})

app.get('/event_made', (req, res) => {
    console.log('suc')
    res.send('Haji')
})

app.post('/event_made', makeEvent, (req, res) => {
    console.log(JSON.stringify(req.body.day));
    res.send(req.body.month);
})

app.post('/confirmation', (req,res) => {
    //hi
})

//Server Port
app.listen(3000, () => {
    console.log("HI")
})

//MiddleWare Functions

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

async function findEvent(req, res, next) {

    try{
        //For Final: use date.now
        var a = Date.now()
        console.log(a)
        var found = await event.find({date: {$gt: a}}).limit(4)
        eventArray = found;
        if(eventArray.length == 0) {
            console.log("No Events Available")
        } else {
            console.log("Successfully found events")
        }
        
    } catch(e) {
        console.log(e.message)
        console.log("Did not find successfully")
    }
    next();

}

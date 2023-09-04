if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { event, users } = require('./data')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const method_override = require('method-override')

const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users.findOne({email: email}),
    id =>  users.findById({_id: id})
)


app.use(express.urlencoded({ extended: false }))
app.use(express.static('styles'))

var eventArray = [];



mongoose.connect(`${process.env.DB_Link}`)

app.use(express.json())
app.set('view engine', 'ejs')
app.use(method_override('_method'))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())



//Routes
app.get('/', checkAuthenticated, async (req, res) => {
    console.log("User name: " + req.user.name)

    res.render('mainp', {name: req.user.name})
})

app.get('/hungry', checkAuthenticated, findEvent, (req, res) => {
    res.render('hungryp', {events: eventArray})
})

app.get('/donate', checkAuthenticated, (req, res) => {
     res.render('donatep')
})

app.get('/event_made', checkAuthenticated, (req, res) => {
    res.send('You have not created an event yet')
})

app.get('/profile', checkAuthenticated, async (req,res) => {
    var toDonate = await req.user.populate('donate')
    console.log(toDonate.donate)
    var collecting = await req.user.populate('collect')
    console.log(collecting.collect)
    res.render('profile', {donations: toDonate.donate, collections: collecting.collect})
})

app.post('/event_made', checkAuthenticated, makeEvent, (req, res) => {
    console.log("Month of Event is Shown on Screen");
    res.send(req.body.month);
})
//Needs Update for Mongoose Events: Swipes Remaining and Link Event to a user
app.post('/confirmation', checkAuthenticated, assignEvent, (req,res) => {
    try{
            console.log("Option Selected: ")
            console.log(req.body.confirm)
    } catch(e) {
        console.log(e.message)
    }
    
    res.send('Event Confirmed')
})

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register')
  })

app.get('/login', checkNotAuthenticated, (req , res) => {
    res.render('login')
})

app.get('/separate', checkAuthenticated, (req, res) => {
    res.send(req.user.name)
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try{
        const hashedPassword =  await bcrypt.hash(req.body.password, 10)
        users.create({
            name: req.body.name,
            email:req.body.email,
            password: hashedPassword
        }).then((tempUser, err) => {
            console.log(tempUser);
        });
        console.log("User Registered")
        
        res.redirect('/login')
    } catch(e) {
        console.log(e.message)
        res.redirect('/register')
    }
})

app.delete('/logout', (req,res) => {
    req.logOut( ()=> console.log("Logged Out"))
    res.redirect('/login')
})


//MiddleWare Functions

async function makeEvent(req, res, next) {

    try{
        var tempEvent = await event.create({
            date: new Date(2023, req.body.month, req.body.day, req.body.time),
            location: req.body.location,
            swipes: req.body.swipes,
            swipesRemaining: req.body.swipes
        })
        await users.findOneAndUpdate({_id: req.user._id}, {$push: {donate: tempEvent._id}})

        console.log('Event made Succesfully + User Profile Updated')
    }catch(e) {
        console.log(e.message)
    }
    
    next()
}

async function findEvent(req, res, next) {

    try{
        var a = Date.now()
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

    function checkAuthenticated(req, res, next) {
        if(req.isAuthenticated()) {
            return next()
        } else {
            res.redirect('/login')
        }
    }

    function checkNotAuthenticated(req, res, next) {
        if(req.isAuthenticated()) {
            return res.redirect('/')
        } 
        next()
    }

    async function assignEvent(req, res, next) {
        var tempEvent = await event.findOneAndUpdate({_id: eventArray[req.body.confirm]._id}, {swipesRemaining: eventArray[req.body.confirm].swipesRemaining-1})
        console.log("Event Swipes Updated")
        var lol = await users.findOneAndUpdate({_id: req.user._id}, {$push: {collect: tempEvent._id}})
        console.log("User profile updated")
        
        next()
    }

    //Server Port
    app.listen(3000, () => {
        console.log("HI! Running on Port 3000.")
    })

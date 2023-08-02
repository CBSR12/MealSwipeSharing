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
    id => users.findById({_id: id})
)


app.use(express.urlencoded({ extended: false }))
app.use(express.static('styles'))
var eventArray = [];



mongoose.connect("mongodb+srv://srudra1024:Ninja2789@cluster0.vf67anc.mongodb.net/?retryWrites=true&w=majority")

app.use(express.json())
app.set('view engine', 'ejs')
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(method_override('_method'))

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
    console.log(req.body.values)
    res.send(req.body.values)
})

app.get('/fakeHome', checkAuthenticated, (req, res) => {

    res.render('index', {name: req.user.name})
})

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register')
  })

app.get('/login', checkNotAuthenticated, (req,res) => {
    res.render('login')
})

app.get('/separate', (req, res) => {
    res.send(req.user.name)
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/fakeHome',
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
        console.log("WAZZUP")
        
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
        var a = new Date(2022, 6, 14)
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

    function checkAuthenticated(req, res, next) {
        if(req.isAuthenticated()) {
            return next()
        } else {
            res.redirect('/login')
        }
    }

    function checkNotAuthenticated(req, res, next) {
        if(req.isAuthenticated()) {
            return res.redirect('/fakeHome')
        } 
        next()
    }

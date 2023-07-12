const express = require('express')
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.static('styles'))

app.use(express.json())
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('donatep')
})


app.get('/new', (req, res) => {
    console.log('suc')
    res.send('Haji')
})

app.post('/new', (req, res) => {
    console.log(JSON.stringify(req.body.day));
    console.log( req.body.month + req.body.day + req.body.time + req.body.location + req.body.swipes);
    res.send(req.body.month);
    
    
    
})

app.listen(3000, () => {
    console.log("HI")
})

function makeEvent(month, day, time, swipes, location) {

}

const URL = ""
fetch('https://api.wheretheiss.at/v1/satellites/25544').then(res => {
return res.json()
}).then(data => {
    console.log(data.latitude
        )
})
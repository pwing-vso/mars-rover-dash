require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls


// example API call
app.get('/apod', async (req, res) => {
    try {
        let image = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ image })
    } catch (err) {
        console.log('error:', err);
    }
})

const rovers = ['curiosity', 'spirit', 'opportunity']
rovers.forEach(
    app.get(`/${rover}`, async (req, res) => {
        console.log("Making call")
        try {
            let photo = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=${process.env.API_KEY}`)
                .then(res => res.json())
            res.send({ photo })
        } catch (err) {
            console.log('Failed to fetch photos:', err)
        }
    })
)

// const rovers = ['curiosity','spirit','opportunity']
// const roversData = ()=>{rovers.forEach((rover)=> {
//     app.get(`/${rover}`, async (req,res) => {
//         try {
//             const roverApi = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${process.env.API_KEY}`
//             const roverImages = await fetch(roverApi)
//             .then(res => res.json())
//             res.send({roverImages})
//         } catch (error) {
//             console.log('Error!',error)
//         }
//     })
// })}

// roversData();


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
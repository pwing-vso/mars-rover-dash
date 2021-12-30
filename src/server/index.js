require('dotenv').config()
// require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 4500

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls
const rovers = ['curiosity', 'spirit', 'opportunity']


// retrieve max sol to determine most recent photos

rovers.forEach(
    function(rover) {
        app.get(`/maxsol/${rover}`, async (req, res) => {
            console.log(`Making call to ./maxsol/${rover}`)
            try {
                let manifest = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=54Sgt7yCq4WiDUakwxcKplr2tEk8bPh05spAHdVC`)
                    .then(res => res.json());
                manifest = manifest.photo_manifest.max_sol;
                res.send({ manifest }); // .photo_manifest.max_sol
            } catch (err) {
                console.log('Failed to fetch manifest:', err)
            }
        })
    }
)

// get most recent photo CURRENTLY JUST AT 1000
rovers.forEach(
    function(rover) {
        app.get(`/recent/${rover}`, async (req, res) => {
            console.log(`Making call to ./recent/${rover}`) // for computed max sol ${maxSol}.`)
            try {
                // const manifest = await fetch(`./maxsol/${rover}`).then(res => res.json());
                console.log("Index manifest:" + manifest);
                let roverGallery = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=1000&api_key=${process.env.API_KEY}`)
                    .then(res => res.json())
                    // .then(lastPhoto => {console.log("API Response" + lastPhoto); console.log("Index:" + lastPhoto.photos[0].img_src); return lastPhoto.photos[0].img_src})
                // console.log(roverGallery)
                    res.send({ roverGallery })
            } catch (err) {
                console.log('Failed to fetch photos:', err)
            }
        })
    }
)

// https://api.nasa.gov/mars-photos/api/v1/rovers/opportunity/photos?sol=5111&api_key=DEMO_KEY

// retrieve photo gallery

rovers.forEach(
    function(rover) {
        app.get(`/${rover}/latest`, async (req, res) => {
            console.log(`Making call to ./${rover}/latest`)
            try {
                const latest_photos = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${process.env.API_KEY}`)
                    .then(res => res.json())
                res.send({ latest_photos })
            } catch (err) {
                console.log('Failed to fetch photos:', err)
            }
        })
    }
)

// const rovers = ['curiosity','spirit','opportunity']
// const roversData = ()=>{rovers.forEach((rover)=> {
//     app.get(`/${rover}`, async (req,res) => {
//         try {
//             const roverApi = `https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/latest_photos?api_key=DEMO_KEY`
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


// test the api call https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity?api_key=54Sgt7yCq4WiDUakwxcKplr2tEk8bPh05spAHdVC

// sample manifest call https://api.nasa.gov/mars-photos/api/v1/manifests/Curiosity?api_key=54Sgt7yCq4WiDUakwxcKplr2tEk8bPh05spAHdVC

// .photo_manifest.max_sol

// probs wont need this
// if (latest_photos.length > 23) {
//     res.send({ latest_photos })
// } else {
//     do {
        
//     } while (latest_photos.length < 24);
//     let manifest = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${process.env.API_KEY}`)
//     .then(res => res.json());
//     manifest = manifest.photo_manifest.max_sol;
// }
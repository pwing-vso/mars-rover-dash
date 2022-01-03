const rovers = {
    curiosity: {
        launchDate: "7:02 a.m. PST, Nov. 26, 2011",
        landingDate: "10:32 p.m. PDT, Aug. 5, 2012",
        landingSite: "Gale Crater",
        missionDuration: "ongoing",
        NASAMissionStatement: "Did Mars ever have the right environmental conditions to support small life forms called microbes?"
    }, 
    opportunity: {
        NASAMissionStatement: "To study the history of climate and water at sites on Mars where conditions may once have been favorable to life.",
        launchDate: "July 8, 2003 / 03:18:15 UT",
        landingDate: "Jan. 25, 2004 / 04:54 UT",
        landingSite: "Meridiani Planum (Eagle Crater)",
        missionDuration: "14 years, 11 months, 1 day ",
    }, 
    spirit: {
        launchDate: "June 10, 2003 / 17:58:47 UT",
        landingDate: "04:26 UT Jan. 4, 2004",
        landingSite: "Gusev Crater",
        missionDuration: "7 years, 11 months, 13 days",
        NASAMissionStatement: "To study the history of climate and water at sites on Mars where conditions may once have been favorable to life.",
    }
}


let store = Immutable.Map({
    activeRover: '',
    maxSol: ''
}
)

// add our markup to the page
const root = document.getElementById('root')

async function updateStore(store, newState, doRender) {
    store = Object.assign(store, newState);
    if(doRender){render(root)} // , store
}


// replaces the filler content of root in index.html with the return value of App
const render = async (root) => { // , state
    root.innerHTML = App() // state
}

async function loading() {
    document.getElementById('gallery').innerHTML = "Loading . . ."
}

// retrieve the latest sol that has photos from Manifest API
async function getMaxSol() {
    const manifest = await fetch(`./maxsol/${store.toObject().activeRover}`).then(res => res.json());
    updateStore(store, Immutable.Map({
        activeRover: store.toObject().activeRover,
        maxSol: manifest.manifest
    }), false)
    // console.log("Manifest \n" + typeof manifest.manifest);
    // return document.getElementById("max-sol").innerHTML = `Max Sol: ${manifest.manifest.photo_manifest.max_sol  }`
    // return document.getElementById("max-sol").innerHTML = `Max Sol: ${manifest.manifest}`
}

// Higher-order function that returns another function
// Not 100% pure due to animations, however, a mentor has commented "It is a side effect, but working with the dom manipulations, 
// animations are side effect in nature. So you are not expected to purely write everything, but some parts of the project."
async function selectRover(activeRover) {
    await updateStore(store, Immutable.Map({
        activeRover: activeRover,
        maxSol: store.maxSol
    }), true)
    return true
}

async function activeRoverClass(activeRover) {
    console.log("hitting activeRoverClass for rover" + activeRover)
    const roverNames = ["curiosity", "spirit", "opportunity"];
    const deactivate = roverNames.filter((roverName) => !(roverName === activeRover));
    console.log(deactivate);
    document.getElementById(deactivate[0]).classList.remove("rover-button-active")
    document.getElementById(deactivate[1]).classList.remove("rover-button-active")
    document.getElementById(activeRover).classList.add("rover-button-active")
    console.log(document.getElementById("curiosity").classList)
    // do {
    // } while (true);
}

async function updateFactsBox() {
    const activeRover = store.toObject().activeRover
    return document.getElementById("facts").innerHTML = `
        <p>Mission</p>
            <ul>
                <li><span class="fact-list">NASA Directive  |   </span>${rovers[activeRover].NASAMissionStatement}</li>
                <li><span class="fact-list">Launch Date  |   </span>${rovers[activeRover].launchDate}</li>
                <li><span class="fact-list">Landing Date  |   </span>${rovers[activeRover].landingDate}</li>
                <li><span class="fact-list">Landing Site  |   </span>${rovers[activeRover].landingSite}</li>
                <li><span class="fact-list">Mission Duration  |   </span>${rovers[activeRover].missionDuration}</li>
            </ul>
        <p>Photos from most recent Mars sol (${store.toObject().maxSol})</p>
        `
    }

// async function getRecentPhoto(activeRover) {
//     const lastPhotoDate = await fetch(`./recent/${activeRover}`).then(res => res.json());
//     console.log("Last photo date data \n" + lastPhotoDate);
//     return document.getElementById("gallery").innerHTML = `Recent photo: ${lastPhotoDate["lastPhotoDate"]["photos"][0][0]["img_src"]}`
// }

async function getPhotoGallery() {
    const latestPhotoData = await fetch(`./${store.toObject().activeRover}/latest`).then(res => res.json());
    const photoSrcArr = latestPhotoData.latest_photos.latest_photos.map(data => data.img_src).slice(0,24);
    
    // const cols = [...document.getElementsByClassName("gallery-col")]
    // cols.forEach(col => col.innerHTML = "")
    gallery = document.getElementById("gallery");
    gallery.innerHTML = '';

    photoSrcArr.forEach(url => {
        const picWrapper = document.createElement("div");
        picWrapper.classList.add("picWrapper")
        
        const atag = document.createElement("a");
        atag.href = url;
        picWrapper.appendChild(atag);
        
        const img = document.createElement("img");
        img.src = url;
        img.classList.add("gallery-photo");
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        atag.appendChild(img)
        
        gallery.appendChild(picWrapper)
    })
}


// create content
const App = () => {

    async function isActive() {
        const arrStore = store.toObject()
        if(arrStore.activeRover) {
            await loading();
            await getMaxSol();
            await updateFactsBox();
            await getPhotoGallery();
            await activeRoverClass(arrStore.activeRover)
            return null
        } else {
            return null
        }
    }

    // if store has an active rover, store new facts div (store, maxSol as arg), store new gallery div (store), render both as constants below


    return `
        <header>
            <img src="assets/images/mars-favicon.png" height="40px" width="40px" style="margin:10px"/>
            <p>Mars Rover Dashboard</p>
        </header>
        <div id="rover-select">
            <div class="rover-button" id="curiosity" onclick="selectRover('curiosity')">
                <div class="rover-name">Curiosity</div>
                <div class="rover-image-wrapper">
                    <img src="./assets/images/curiosity.png" class="rover-image"></img>
                </div>
            </div>
            <div class="rover-button" id="spirit" onclick="selectRover('spirit')">
                <div class="rover-name">Spirit</div>
                <div class="rover-image-wrapper">
                    <img src="./assets/images/spirit.png" class="rover-image"></img>
                </div>
            </div>
            <div class="rover-button" id="opportunity" onclick="selectRover('opportunity')">
                <div class="rover-name">Opportunity</div>
                <div class="rover-image-wrapper">
                    <img src="./assets/images/opportunity.png" class="rover-image"></img>
                </div>
            </div>
        </div>
        <div id="facts"><span style="font-style:italic"> | Select a rover to view latest photos</span></div>
        <div id="gallery"></div>
    ${isActive()}
    `


}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS



// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
// const Greeting = (name) => {
//     if (name) {
//         return `
//             <h1>Welcome, ${name}!</h1>
//         `
//     }

//     return `
//         <h1>Hello!</h1>
//     `
// }

// Example of a pure function that renders infomation requested from the backend
// const ImageOfTheDay = (apod) => {

//     // If image does not already exist, or it is not from today -- request it again
//     const today = new Date()
//     const photodate = new Date(apod.date)
//     console.log(photodate.getDate(), today.getDate());

//     console.log(photodate.getDate() === today.getDate());
//     if (!apod || apod.date === today.getDate() ) {
//         getImageOfTheDay(store)
//     }

// check if the photo of the day is actually type video!
//     if (apod.media_type === "video") {
//         return (`
//             <p>See today's featured video <a href="${apod.url}">here</a></p>
//             <p>${apod.title}</p>
//             <p>${apod.explanation}</p>
//         `)
//     } else {
//         return (`
//             <img src="${apod.image.url}" height="350px" width="100%" />
//             <p>${apod.image.explanation}</p>
//         `)
//     }
// }

// ------------------------------------------------------  API CALLS

// Example API call
// const getImageOfTheDay = (state) => {
//     let {
//         apod
//     } = state

//     fetch(`./apod`)
//         .then(res => res.json())
//         .then(apod => updateStore(store, {
//             apod
//         }))

//     return data
// }

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


let store = {
    user: {
        name: "Student"
    },
    activeRover: '',
    maxSol: ''
}


// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}


// replaces the filler content of root in index.html with the return value of App
// and implements component logic
const render = async (root, state) => {
    root.innerHTML = App(state)
}


// Higher-order function that returns another function
// Not 100% pure, but mentor has commented "It is a side effect, but working with the dom manipulations, 
// animations are side effect in nature. So you are not expected to purely write everything, but some parts of the project."
function selectRover(activeRover) {
    const roverNames = ["curiosity", "spirit", "opportunity"];
    const deactivate = roverNames.filter((roverName) => !(roverName === activeRover));
    document.getElementById(deactivate[0]).classList.remove("rover-button-active")
    document.getElementById(deactivate[1]).classList.remove("rover-button-active")
    document.getElementById(activeRover).classList.add("rover-button-active")

    location.hash = activeRover
    
    return updateFactsBox(activeRover).then(
        document.getElementById("facts").style.display = "block"
    )
}

async function updateFactsBox(activeRover) {
    // await getMaxSol(activeRover);
    await getPhotoGallery(activeRover);
    return document.getElementById("facts").innerHTML = `
        <p>The Mission</p>
            <ul>
                <li><span class="fact-list">NASA Directive  |   </span>${rovers[activeRover].NASAMissionStatement}</li>
                <li><span class="fact-list">Launch Date  |   </span>${rovers[activeRover].launchDate}</li>
                <li><span class="fact-list">Landing Date  |   </span>${rovers[activeRover].landingDate}</li>
                <li><span class="fact-list">Landing Site  |   </span>${rovers[activeRover].landingSite}</li>
                <li><span class="fact-list">Mission Duration  |   </span>${rovers[activeRover].missionDuration}</li>
            </ul>
        <p>Most recent photos</p>
        `
    }

async function getRecentPhoto(activeRover) {
    const lastPhotoDate = await fetch(`./recent/${activeRover}`).then(res => res.json());
    console.log("Last photo date data \n" + lastPhotoDate);
    return document.getElementById("gallery").innerHTML = `Recent photo: ${lastPhotoDate["lastPhotoDate"]["photos"][0][0]["img_src"]}`
}

async function getPhotoGallery(activeRover) {
    const latestPhotoData = await fetch(`./${activeRover}/latest`).then(res => res.json());
    const photoSrcArr = latestPhotoData.latest_photos.latest_photos.map(data => data.img_src).slice(0,24)
    console.dir(photoSrcArr, {depth: null});
    
    photoSrcArr.forEach(url => {
        const picWrapper = document.createElement("div");
        picWrapper.classList.add("picWrapper")
        
        const atag = document.createElement("a");
        atag.href = url;
        picWrapper.appendChild(atag);
        
        const ind = photoSrcArr.indexOf(url);
        const img = document.createElement("img");
        img.src = url;
        img.classList.add("gallery-photo");
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        atag.appendChild(img)
        
        const cols = document.getElementsByClassName("gallery-col")
        const col = cols[(ind%4)];
        col.appendChild(picWrapper)
    })
}

// async function getGalleryPhotos()

// async function getMaxSol(activeRover) {
//     const manifest = await fetch(`./maxsol/${activeRover}`).then(res => res.json());
//     console.log("Manifest \n" + typeof manifest.manifest);
//     // return document.getElementById("max-sol").innerHTML = `Max Sol: ${manifest.manifest.photo_manifest.max_sol  }`
//     return document.getElementById("max-sol").innerHTML = `Max Sol: ${manifest.manifest}`
// }

// create content
const App = (state) => {
    // let {
    //     apod
    // } = state // rovers, 

    return `
        <header>
            <img src="assets/images/mars-favicon.png" height="40px" width="40px" style="margin:10px"/>
            <p>Mars Rover Dashboard</p>
        </header>
        <div id="rover-select">
            <div class="rover-button" id="curiosity" onclick="selectRover('curiosity')">
                <span>Curiosity</span>
                <img src="./assets/images/curiosity.png" height="100%"></img>
            </div>
            <div class="rover-button" id="spirit" onclick="selectRover('spirit')">
                <span>Spirit</span>
                <img src="./assets/images/spirit.png" height="100%"></img>
            </div>
            <div class="rover-button" id="opportunity" onclick="selectRover('opportunity')">
                <span>Opportunity</span>
                <img src="./assets/images/opportunity.png" height="100%"></img>
            </div>
        </div>
        <div id="facts">
        </div>
        <div id="gallery">
            <div class="gallery-col"></div>
            <div class="gallery-col"></div>
            <div class="gallery-col"></div>
            <div class="gallery-col"></div>
        </div>

        
    `
    // <p id="max-sol"></p>


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

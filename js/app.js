const movies = {
    "casino-royale": {
        title: "Casino Royale"
    },
    moonraker: {
        title: "Moonraker"
    },
    another1: {
        title: "Something"
    },
    another2: {
        title: "Something Else"
    }
};

function generateRandomNumber(min, max) { 
    return parseInt(Math.random() * (max - min) + min, 10);
} 

function goToRandomMovie() {
    const movieStubs = Object.keys(movies);
    const randomNumber = generateRandomNumber(0, movieStubs.length - 1);
    const id = movieStubs[randomNumber];
    window.location.href = `movie.html?id=${id}`;
    setButtonHidden(false);
}

function setButtonHidden(hide) {
    const button = document.getElementById("random-button");
    const loader = document.getElementById("bond-loading-animation");
    
    if (hide) {
        button.style.display = "none";
        loader.style.opacity = 1;
    } else {
        button.style.display = "block";
        loader.style.opacity = 0;
    }
}

function randomButtonWasClicked() {
    setButtonHidden(true);
    setTimeout(goToRandomMovie, 2000);
}
window.randomButtonWasClicked = randomButtonWasClicked;

function loadMovie() {
    var urlParams = new URLSearchParams(window.location.search);
    const movieStub = urlParams.get("id");
    const movie = movies[movieStub];
    
    const titleElement = document.getElementById("movie-title");
    
    if (movie) {
        const title = movie.title;
        titleElement.textContent = title;
    } else {
        titleElement.textContent = `Error loading '${movieStub}'`;
    }
}
window.loadMovie = loadMovie;


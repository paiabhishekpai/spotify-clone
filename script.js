console.log("script starts here");
let currentSong = new Audio();
let songs;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
}

//a function to get all the songs to play
async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}
const playMusic = (track, pause=false) => {
    let audio = new Audio();
    currentSong.src = "/songs/" + track;
    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};
async function main() {
    //get songs
    songs = await getSongs();
    playMusic(songs[0], true);
    let songUL = document
        .querySelector(".songList")
        .getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML =
            songUL.innerHTML +
            `<li><img class="invert" width="34" src="img/music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                <div>Abhi</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div> </li>`;
    }

    //to play the first song

    //attach event listener to song
    Array.from(
        document.querySelector(".songList").getElementsByTagName("li")
    ).forEach((e) => {
        e.addEventListener("click", (element) => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        });
    });

    //attach event listener to playbar buttons
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "img/play.svg";
        }
    });

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
            currentSong.currentTime
        )} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left =
            (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    //add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click" , (e)=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration*percent)/100;
    })

    //adding event listener for hamburger 
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
    })

    //adding event listener for close 
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-120%"
    })

    //adding event listener to previous and next
    previous.addEventListener("click",()=>{
        currentSong.pause();
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if((index-1)>=0){
            playMusic(songs[index-1])
        }
    })

    next.addEventListener("click",()=>{
        currentSong.pause();
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if((index+1)<songs.length){
            playMusic(songs[index+1])
        }
    })
}

main();

/*
Hey there, friend.
Checking out the scripts file, huh?
Hope you find everything you need.
If not feel free to drop me a line.
*/

console.log("%cHey there, friend. Checking out the developer panel, huh? Hope you find everything you need. If not feel free to drop me a line.","background-color:rebeccapurple;color:white");
let playingList = true;
const spinners = document.querySelectorAll('.spinner');
function unpauseSpinners(){
    spinners.forEach(spinner => {
        spinner.classList.remove('paused');
    });
}
function pauseSpinners(){
    spinners.forEach(spinner => {
        spinner.classList.add('paused');
    });
}

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function parametersForPlayer(){
    return {
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
            listType: 'playlist',
            list: 'PLmGLkpMXmmLMatr19kDma3hM2_RipkuoS',
            'playsinline': 1,
            'loop': 1,
            'disablekb': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    }
};
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', parametersForPlayer());
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    let volume = 15;
    player.setVolume(volume);
    volBarUpdate(volume);
    player.setShuffle(true);
    player.playVideoAt(0);
}

function onPlayerStateChange(event) {
    console.log(event.data);
    if(event.data === YT.PlayerState.PLAYING){
        unpauseSpinners();
    }else{
        pauseSpinners();
    }
    updateNowPlaying();
}

document.querySelector('.prev.button').addEventListener("click",previousButton);
function previousButton(){
    if(playingList){
        clearTitle();
        player.previousVideo();
    }else{
        singleVideoNext();
    }
}

document.querySelector('.next.button').addEventListener("click",nextButton);
function nextButton(){
    if(playingList){
        clearTitle();
        player.nextVideo();
    }else{
        singleVideoNext();
    }
}

function singleVideoNext(){
    player.seekTo(0);
}

document.querySelector('.pause.button').addEventListener("click",pauseButton);
function pauseButton(){
    if(player.getPlayerState() === YT.PlayerState.PLAYING){
        player.pauseVideo();
    }else{
        player.playVideo();
    }
}

document.querySelector('.restart.button').addEventListener("click",restartButton);
function restartButton(){
    player.playVideoAt(0);
}

document.querySelector('.eject.button').addEventListener("click",ejectButton);
function ejectButton(){
    document.querySelector('.newTape').style.display = "block";
}

document.querySelector('.ytButton.button').addEventListener("click",ytButton);
function ytButton(){
    player.pauseVideo();
    window.open(player.getVideoUrl() + "&t=" + player.getCurrentTime() + 's','_blank');
}

document.querySelector('.info.button').addEventListener("click",infoButton);
function infoButton(){
    document.querySelector('.information').style.display = "block";
}

const volSteps = 5;
document.querySelector('.volUp.button').addEventListener("click",volUpButton);
function volUpButton(){
    let volume = player.getVolume();
    volume -= volume % volSteps;
    if(volume < 100){
        volume += volSteps;
        player.setVolume(volume);
    }else{
        player.setVolume(100);
    }
    volBarUpdate(volume);
    console.log("Volume is " + volume);
}

document.querySelector('.volDown.button').addEventListener("click",volDownButton);
function volDownButton(){
    let volume = player.getVolume();
    volume -= volume % volSteps;
    if(volume > 0){
        volume -= volSteps;
        player.setVolume(volume);
    }else{
        player.setVolume(0);
    }
    volBarUpdate(volume);
    console.log("Volume is " + volume);
}

function volBarUpdate(volume){
    let col = 'red';
    if(volume < 25){
        col = '#7af551';
    }else if(volume < 50){
        col = 'yellow';
    }else if(volume < 80){
        col = 'orange';
    }
    document.querySelector('.volBar').style.backgroundColor = col;
    document.querySelector('.volBar').style.height = volume + '%';
}

document.querySelectorAll('.closeButton').forEach(item => {
    item.addEventListener('click', function(){hideDiv()});
});
document.querySelectorAll('.outerPop').forEach(item => {
    item.addEventListener('click', function(){hideDiv()});
});
function hideDiv(){
    console.log('Hide Div butt pushed');
    document.querySelector('.newTape').style.display = 'none';
    document.querySelector('.information').style.display = 'none';
}

function updateNowPlaying(){
    let currentTitle = player.videoTitle;
    if(currentTitle != ""){
        document.getElementsByClassName('videoTitle')[0].innerHTML = currentTitle;
        document.getElementsByClassName('videoTitleTape')[0].innerHTML = currentTitle;
        document.querySelector('title').innerHTML = currentTitle + " - Darlo's YouTube Mixtape - Darlo's World.co.uk";
        console.log("Now Playing: " + player.videoTitle);
        if(player.getPlaylistIndex() % 2 === 1){
            document.querySelector('.sideLabel').innerHTML = "B";
        }else{
            document.querySelector('.sideLabel').innerHTML = "A";
        }
    };
    timeUpdate();
    playFlash();
}

function playFlash(){
    /*
    BUFFERING: 3
    CUED: 5
    ENDED: 0
    PAUSED: 2
    PLAYING: 1
    UNSTARTED: -1
    */
    let state = player.getPlayerState();
    if(state === 3 ||
        state === 1){
        document.querySelector('.pause.button').classList.remove('readyToPlay');
    }else{
        document.querySelector('.pause.button').classList.add('readyToPlay');
    }
}

function clearTitle(){
    document.getElementsByClassName('videoTitle')[0].innerHTML = "Loading ...";
    document.getElementsByClassName('videoTitleTape')[0].innerHTML = "Loading ...";
}

myInterval = setInterval(timeUpdate, 500);
function timeUpdate(){
    let currentTime = player.getCurrentTime();
    const duration = player.getDuration();
    document.getElementsByClassName('duration')[0].innerHTML = secToTime(duration);
    document.getElementsByClassName('current')[0].innerHTML = secToTime(currentTime);
    tapeReel();
}

function secToTime(secs){
    if(secs < 1){
        return "0:00";
    }
    secs = Math.floor(secs);
    mins = Math.floor(secs / 60);
    secs = secs - (mins * 60);
    if(secs < 10){
        secs = "0" + secs;
    }
    return mins + ":" + secs;
}

function tapeReel(){
    let currentTime = Math.floor(player.getCurrentTime());
    const duration = Math.floor(player.getDuration());
    const minPix = 60;
    const maxPix = 150;
    let percentDone = Math.floor(currentTime / duration * 100);
    /*
    -- Scale Notes --
    0% = 60 (+0)
    50% = 105 (+45)
    100% = 150 (+90)
    
    90/100 * percentDone = amount to add
    90/100 * 0 = 0
    90/100 * 50 = 45
    90/100 * 100 = 90
    */
    let pixelChange = Math.floor(90/100 * percentDone);
    let newPixelsLeft = pixelChange + minPix;
    let newPixelsRight = maxPix - pixelChange;
    document.querySelector('.leftTape .tapeReel').style.width = newPixelsLeft+'px';
    document.querySelector('.rightTape .tapeReel').style.width = newPixelsRight+'px';
}

windowSizeCheck();
window.addEventListener("resize", windowSizeCheck);
function windowSizeCheck(){
    let windowWidth = window.innerWidth;
    if(windowWidth < 500){
        let newScale = windowWidth / 5 / 100;
        document.querySelector('.cassetteDeck').style.transform = 'translate(0, -50%) scale(' + newScale + ')';
    }else{
        document.querySelector('.cassetteDeck').style.transform = 'translate(0, -50%) scale(1)';
    }
    /*
    -- Scale Notes --
    500px = 100%
    100px = 20%
    50px = 10%
    5px = 1%
    x / 5 = y
    */
};

if(mobileAndTabletCheck()){
    //Volume adjustments don't work on mobile
    document.querySelector('.volUp.button').style.display = "none";
    document.querySelector('.volDown.button').style.display = "none";
    document.querySelector('.volBar').style.display = "none";
}
function mobileAndTabletCheck(){
    //https://stackoverflow.com/a/11381730/5448001
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

document.querySelector('.newTape .submit').addEventListener("click",newTape);
function newTape(){
    let tapeURL = document.querySelector('#newTapeURL').value;
    //playlist or solo video
    //playlist eg - https://www.youtube.com/playlist?list=PLcIDqHah6ZnDfckv4K6epvr3i6TbExM_8
    //solo video eg - https://www.youtube.com/watch?v=kT8cX2-_7pQ&ab_channel=NinjaSexParty
    //solo video from a playlist eg - https://www.youtube.com/watch?v=IHEpGHsKdV0&list=PLcIDqHah6ZnDfckv4K6epvr3i6TbExM_8&index=5&ab_channel=NinjaSexParty
    let target = tapeURL.split("list=");
    let isList = true;
    let listIndex = 0;
    if(target.length <= 1){
        //no list parameter, check for song
        isList = false;
        target = target[0].split("v=");
    }
    if(target.length <= 1){
        //no song either, end here
        console.log('Poor entry');
        return;
    }
    if(isList){
        //get the index of the song if it is from a playlist
        let indexTarget = tapeURL.split("index=");
        if(indexTarget.length > 1){
            indexTarget = indexTarget[1].split('&')[0];
            listIndex = indexTarget - 1;
            //URL indexes from 1, API indexes from 0.
            //If URL has been manually changed, the index may not match the intended video
        }
    }
    target = target[1].split('&')[0];//clear up other parameters
    let regexCheck = /^[a-zA-Z0-9-_]+$/.test(target);
    if(regexCheck === false){
        console.log('Poor entry');
        return;
    }
    console.log('NEW TAPE - ' + target + " - index is " + listIndex + " - " + tapeURL);
    
    //For some reason I have to load something or stop the video before the new playlist, otherwise the new playlist needs to be loaded twice
    // player.loadVideoById('kT8cX2-_7pQ');
    player.stopVideo();
    if(isList){
        player.loadPlaylist({
            list:target,
            listType:'playlist',
            index:listIndex,
            startSeconds:0,
            playsinline: 1,
            loop: 1,
            disablekb:1
        });
        player.setLoop(1);
        playingList = true;
    }else{
        //load single video as a playlist so it will repeat. Note the use of 'playlist' rather than 'list'
        player.loadPlaylist({
            playlist: target,
            listType:'playlist',
            index:listIndex,
            startSeconds:0,
            playsinline: 1,
            loop: 1,
            disablekb:1
        });
        player.setLoop(1);
    }
    document.querySelector('#newTapeURL').value = '';
    document.querySelector('.closeButton').click();
}

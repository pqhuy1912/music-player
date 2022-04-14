var songs = [
    {
        name: 'Anhs & Ems',
        singer: 'QNT, RZMAS, WXRDIE',
        path: '../music/anhsems.mp3',
        image: '../img/anhsems.jpg'
    },
    {
        name: 'Ái Nộ',
        singer: 'Masew, Khôi Vũ',
        path: '../music/aino.mp3',
        image: '../img/aino.jpg'
    },
    {
        name: 'Phi Hành Gia',
        singer: 'Renja, Slow T, Lil Wuyn, Sugar Cane',
        path: '../music/phihanhgia.mp3',
        image: '../img/phihanhgia.jpg'
    },
    {
        name: 'Sugar',
        singer: 'RPT JasonDilla, RPT Orijinn',
        path: '../music/sugar.mp3',
        image: '../img/sugar.jpg'
    },
    {
        name: 'Tay To',
        singer: 'MCK, RPT PhongKhin',
        path: '../music/tayto.mp3',
        image: '../img/tayto.jpg'
    },
    {
        name: 'Bật Nhạc Lên',
        singer: 'HIEUTHUHAI, Harmonie',
        path: '../music/batnhaclen.mp3',
        image: '../img/batnhaclen.jpg'
    },
    {
        name: 'Lời Đường Mật',
        singer: 'Lyly, HIEUTHUHAI',
        path: '../music/loiduongmat.mp3',
        image: '../img/loiduongmat.jpg'
    },
    {
        name: 'Crush 2',
        singer: 'W/n, Tez, Tiên',
        path: '../music/crush2.mp3',
        image: '../img/crush2.jpg'
    },
    {
        name: 'Tương 3+1',
        singer: 'W/n, Titie',
        path: '../music/tuong31.mp3',
        image: '../img/tuong31.jpg'
    },
    {
        name: '3107',
        singer: 'W/n, Nâu, Duongg',
        path: '../music/3107.mp3',
        image: '../img/3107.jpg'
    },
    {
        name: 'Cưới Thôi',
        singer: 'Masew, Bray, Tap',
        path: '../music/cuoithoi.mp3',
        image: '../img/cuoithoi.jpg'
    },
]

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $('.player')
const playListBtn = $('.playlist-btn')
const playList = $('.playlist')
const closePlayList = $('.close-playlist')
const listSong = $('.list-song')
const cdThumb = $('.cd-thumb')
const nameSong = $('.current-song-name')
const nameSiger = $('.current-singer-name')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')


let currentIndex = 0
let isPlaying = false
let isRandom = false
let isRepeat = false

function start(){
    loadCurrentSong()
    render()
}
start()

function render(){
    const htmls = songs.map((song, index) => {
        return `
            <div class="song ${index === currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
            </div>
        `
    })
    listSong.innerHTML = htmls.join('')
}

function loadCurrentSong(){
    cdThumb.style.backgroundImage = `url('${songs[currentIndex].image}')`
    nameSong.innerText = songs[currentIndex].name
    nameSiger.innerText = songs[currentIndex].singer
    audio.src = songs[currentIndex].path
}

// Bật tắt playlist
playListBtn.onclick = function(){
    playList.classList.add('active')
}
closePlayList.onclick = function(){
    playList.classList.remove('active')
}

// Xử lý play / pause
playBtn.onclick = function(){
    if (isPlaying) {
        audio.pause()      
    } else {
        audio.play()       
    }
}

audio.onplay = function(){
    isPlaying = true
    player.classList.add('playing')
    // activeSong()
}

audio.onpause = function(){
    isPlaying = false
    player.classList.remove('playing')
    // activeSong()
}

// Xử lý seek
function timeUpdate(e){
    if (audio.duration) {
        const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100)
        progress.value = progressPercent
        progress.style.background = `linear-gradient(to right, #ffe695 0%, #ffe695 ${progressPercent}%, #d3d3d3 ${progressPercent}%, #d3d3d3 100%)`
    }

    let musicCurrentTime = $('.current')
    let musicDurationTime = $('.duration')

    audio.addEventListener('loadedmetadata', function(){
        let totalMin = Math.floor(audio.duration / 60)
        let totalSec = Math.floor(audio.duration % 60)
        if (totalSec < 10) {
            totalSec = `0${totalSec}`
        }
        musicDurationTime.innerText = `${totalMin}:${totalSec}`
    })

    let currentMin = Math.floor(audio.currentTime / 60)
    let currentSec = Math.floor(audio.currentTime % 60)
    if (currentSec < 10) {
        currentSec = `0${currentSec}`
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`
}

audio.addEventListener('timeupdate', timeUpdate)

progress.oninput = function(e){
    audio.removeEventListener('timeupdate', timeUpdate)
}

progress.onchange = function(e){
    const seekTime = ((audio.duration / 100) * e.target.value)
    audio.currentTime = seekTime
    audio.addEventListener('timeupdate', timeUpdate)
}

// Bật / tắt randomBtn
randomBtn.onclick = function(){
    isRandom = !isRandom
    randomBtn.classList.toggle('active', isRandom)
}

// Bật / tắt repeatBtn
repeatBtn.onclick = function(){
    isRepeat = !isRepeat
    repeatBtn.classList.toggle('active', isRepeat)
    isRepeat ? audio.loop = true : audio.loop = false
}

// Xử lý prev / next song
nextBtn.onclick = function(){
    if (isRandom) {
        randomSong()
    } else {
        nextSong()
    }
    audio.play()
    activeSong()
}

prevBtn.onclick = function(){
    if (isRandom) {
        randomSong()
    } else {
        prevSong()
    }
    audio.play()
    activeSong()
}

// Xử lý next song khi audio ended
audio.onended = function(){
    nextBtn.click()
}

function nextSong(){
    currentIndex++
    if (currentIndex >= songs.length) {
        currentIndex = 0
    }
    loadCurrentSong()
}

function prevSong(){
    currentIndex--
    if (currentIndex < 0) {
        currentIndex = songs.length - 1
    }
    loadCurrentSong()
}

function randomSong(){
    let newIndex
    do {
        newIndex = Math.floor(Math.random() * songs.length)
    } while (newIndex === currentIndex);
    currentIndex = newIndex
    loadCurrentSong()
}

const allSongs = $$('.song')
function activeSong(){
    // const allSongs = $$('.song')
    allSongs.forEach((item, index) => {
        if (index === currentIndex) {
            item.classList.add('active')
        } else {
            item.classList.remove('active')
        }
    });
}

// const listSongs = $$('.song')
allSongs.forEach((item) => {
    item.onclick = function(){
        if (!item.classList.contains('active')) {
            currentIndex = +item.dataset.index
            loadCurrentSong()
            activeSong()
            audio.play()
        }
    }
});
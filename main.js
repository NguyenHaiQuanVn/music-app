const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const PlAYER_STORAGE_KEY='MUSIC_PLAYER'
const player=$('.player')
const playlist=$('.playlist')
const heading=$('header h2')
const cdThumb=$('.cd-thumb')
const audio=$('#audio')
const btnPlay=$('.btn-toggle-play')
const progress=$('.progress')
const prevBtn=$('.btn-prev')
const nextBtn=$('.btn-next')
const randomBtn=$('.btn-random')
const repeatBtn=$('.btn-repeat')
const app = {
    currentIndex: 0,
    isPlaying:false,
    isRandom:false,
    isRepeat:false,
    config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    songs: [{
            name: "Đau Hơn Chữ Đau",
            singer: "Phạm Nguyên Ngọc",
            path: "./assets/music/bai1.mp3",
            image: "./assets/img/anh1.png"
        },
        {
            name: "Tình Yêu Sài Gòn, Hà Nội",
            singer: "Freaky x Will x Xesi",
            path: "./assets/music/bai2.mp3",
            image: "./assets/img/anh2.png"
        },
        {
            name: "Hạ Tan",
            singer: "Sean ft. Tweny",
            path: "./assets/music/bai3.mp3",
            image: "./assets/img/anh3.png"
        },
        {
            name: "Vì Mình",
            singer: "Phú Quí x Riown",
            path: "./assets/music/bai4.mp3",
            image: "./assets/img/anh4.png"
        },
        {
            name: "Hỏi Thăm",
            singer: "Vincent ft. C'Mad",
            path: "./assets/music/bai5.mp3",
            image: "./assets/img/anh5.png"
        },
        {
            name: "Không Yêu Đừng Gây Thương Nhớ",
            singer: "nmhuon ft. Godthic",
            path: "./assets/music/bai6.mp3",
            image: "./assets/img/anh6.png"
        },
        {
            name: "Sao Cô Ấy Không Yêu Tôi",
            singer: "Freaky x Lyhan x CM1X",
            path: "./assets/music/bai7.mp3",
            image: "./assets/img/anh7.png"
        }
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function () {
        const html = this.songs.map((song,index) => {
            return `<div class="song ${index===this.currentIndex?'active':''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`
        })
        playlist.innerHTML = html.join('');
    },
    //dinh nghia cac thuoc tinh cho obj
    defineProperties:function(){
        Object.defineProperty(this, 'currentSong',{
            get:function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    //thu nho cd, viet cd.offsetWidth la lay cai gia tri ban dau mac dinh cua no
    handleEvents: function () {
        const cdWidth = $('.cd').offsetWidth
        const cdThumbSnimate=cdThumb.animate([
            { transform: 'rotate(360deg' }
          ], {
            duration: 10000,
            iterations: Infinity
          })
          cdThumbSnimate.pause()
        document.onscroll = function () {
            const newcdWidthh = cdWidth - document.documentElement.scrollTop
            $('.cd').style.width = newcdWidthh > 0 ? newcdWidthh + 'px' : 0
            $('.cd').style.opacity = newcdWidthh / cdWidth
        },
        //ban đầu là false ấn nó sẽ lưu biến isPlaying là true, ấn lại thì thực thi ra true mà trong bộ nhớ lại là false
        btnPlay.onclick=function () {
            if(app.isPlaying){
                audio.onpause()
            }
            else{
                audio.onplay()
            }
        },
        //phai co su kien choi dung thi nhung cai lien quan moi anh huong dc
        audio.onplay=function(){
            app.isPlaying=true,
            audio.play()
            cdThumbSnimate.play()
            player.classList.add('playing')
        }
        audio.onpause=function(){
            app.isPlaying=false,
            audio.pause()
            cdThumbSnimate.pause()
            player.classList.remove('playing')
        }
        audio.ontimeupdate=function(){
            progress.value=audio.currentTime
            progress.max=audio.duration
        }
        audio.onended=function(e){
            if(app.isRepeat){
                audio.play()
                e.preventDefault(app.randomBtn.click())
            }
            else{
                nextBtn.click()
            }
        }
        progress.oninput=function(){
            audio.currentTime=progress.value
        }
        //mỗi lần ấn nó sẽ cộng 1 vào currentindex(cái cộng 1 nó ở hàm nextSong),vì trong currentSong có currentindex
        nextBtn.onclick=function(){
            if(app.isRandom){
                app.randomSong()
            }
            else{
                app.nextSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }
        prevBtn.onclick=function(){
            if(app.isRandom){
                app.randomSong()
            }
            else{
                app.prevSong()

            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }
        randomBtn.onclick=function(){
            app.isRandom=!app.isRandom
            randomBtn.classList.toggle('active', app.isRandom)
            app.setConfig('isRandom',app.isRandom)
        }
        repeatBtn.onclick=function(){
            app.isRepeat=!app.isRepeat
            repeatBtn.classList.toggle('active', app.isRepeat)
            app.setConfig('isRepeat',app.isRepeat)
        }
        playlist.onclick=function(e){
            const songNode=e.target.closest('.song:not(.active)')
            if(songNode)
            {
                app.currentIndex=Number(songNode.getAttribute('data-index'))
                app.loadCurrentSong()
                app.render()
                audio.play()
            }
        }
    },
    loadCurrentSong: function () {
        heading.textContent =this.currentSong.name;
        cdThumb.style.backgroundImage =`url('${this.currentSong.image}')`;
        audio.src=this.currentSong.path
    },
    loadConfig:function () {
        this.isRandom=this.config.isRandom
        this.isRepeat=this.config.isRepeat
    },
    nextSong:function(){
        this.currentIndex++;
        if(this.currentIndex>=this.songs.length){
            this.currentIndex=0
        }
        this.loadCurrentSong()
    },
    prevSong:function(){
        this.currentIndex--;
        if(this.currentIndex<0){
            this.currentIndex=this.songs.length-1
        }

        this.loadCurrentSong()
    },
    randomSong:function(){
        
        this.currentIndex=Math.floor(Math.random() * this.songs.length)
        this.loadCurrentSong()
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
          if (this.currentIndex <= 3) {
            $('.song.active').scrollIntoView({
              behavior: 'smooth',
              block: 'end',
            });
          } else {
            $('.song.active').scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }
        }, 300);
      },
    start: function () {
        this.loadConfig();
        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSong();
        this.render()
        randomBtn.classList.toggle('active', app.isRandom)
        repeatBtn.classList.toggle('active', app.isRepeat)
    }
}
app.start();

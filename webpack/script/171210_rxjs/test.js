let getTopRatedFilms = user =>
    user.videoLists
    .map(videoList =>
        videoList.videos
        .filter(video => video.rating === 5.0)
    ).concatAll()

getTopRatedFilms(currentUser)
    .forEach(film => console.log(film))


let getElemenetDrags = el =>
    el.mouseDowns
    .map(mouseDown =>
        document.mouseMoves.takeUntil(document.mouseUps)
    )
    .concatAll()

getElementDrags(div).forEach(position => img.position = position)



let search =
    keyPresses
    .debounce(250) // 原文是 throttle，但我个人认为原文写错了，我已经在 Twitter 上询问了演讲者，尚未得到回复
    .map(key =>
        getJSON('/search?q=' + input.value)
        .retry(3)
        .takeUntil(keyPresses)
    )
    .concatAll()
search.forEach(
    results => updateUI(results),
    error => showMessage(error)
)


function play(movieId, cancelButton, callback){
    let movieTicket
    let playError
    let tryFinish = () =>{
        if(playError){
            callback(null, playError)
        }else if(movieTicket && player.initialized){
            callback(null, movieTicket)
        }
    }
    cancelButton.addEventListener('click', ()=>{ playError = 'cancel' })
    if(!player.initialized){
        player.init((error)=>{
            playError = error
            tryFinish()
        })
    }
    authorizeMovie(movieId, (error, ticket)=>{
        playError = error
        movieTicket = ticket
        tryFinish()
    })
}

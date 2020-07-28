const URL = 'http://localhost:3000/'
const [itemURL, charURL, advItmURL, recURL, roomURL, invURL] = [URL+'items', URL+'characters', URL+'advanced_items', URL+'recipes', URL+'rooms', URL+'inventories'];

const getItems = () => {
    fetch(itemURL)
    .then(response => response.json())
    .then(items => {
        console.log(items)
    })
}

const getRooms = () => {
    fetch(roomURL)
    .then(response => response.json())
    .then(rooms => {
        console.log(rooms)
        renderRoom(rooms[0])
    })
}

const renderRoom = room => {
    const div = document.querySelector('.game-div')
    console.log(room.img_url)
    div.style.backgroundImage = `url('${room.img_url}')`
}

const getAdvItems = () => {
    fetch(advItmURL)
    .then(response => response.json())
    .then(advItms => {
        console.log(advItms)
    })
}

const getChar = () => {
    fetch(charURL)
    .then(response => response.json())
    .then(char => {
        console.log(char)
    })
}

const getRecs = () => {
    fetch(recURL)
    .then(response => response.json())
    .then(recipes => {
        console.log(recipes)
    })
}

const getInvetory = () => {
    fetch(invURL)
    .then(response => response.json())
    .then(inventory => {
        console.log(inventory)
    })
}

const main = () => {
    getRooms()
    getItems()
    getAdvItems()
    getRecs()
    getChar()
    getInvetory()
}


document.addEventListener('DOMContentLoaded', main)
const URL = 'http://localhost:3000/'
const [itemURL, charURL, advItmURL, recURL, roomURL, invURL] = [URL+'items', URL+'characters', URL+'advanced_items', URL+'recipes', URL+'rooms', URL+'inventories'];
let roomNumber = 0

const getItems = () => {
    fetch(itemURL)
    .then(response => response.json())
    .then(items => {
    })
}

const getRooms = () => {
    fetch(roomURL)
    .then(response => response.json())
    .then(rooms => {
        renderRoom(rooms[roomNumber])
        const arrows = document.querySelectorAll(".arrow")
        arrows.forEach(arrow => arrowEventLister(arrow, rooms))
    })
}

const arrowEventLister = (arrow, rooms) => {
    arrow.addEventListener("mouseover", (e) => {
        e.target.style.background = 'rgba(0,0,0,0.4)';
    }),
    arrow.addEventListener("mouseout", (e) => {
        e.target.style.background = 'rgba(0,0,0,0)';
    }),
    arrow.addEventListener("click", (e) => {
        if (e.target.className === "arrow right"){
            if (roomNumber < 3) {
                roomNumber ++
                renderRoom(rooms[roomNumber])
            }
        }
        else if (e.target.className === "arrow left"){
            if (roomNumber > 0) {
                roomNumber --
                renderRoom(rooms[roomNumber])
            }
        }
    })
}

const renderRoom = room => {
    const div = document.querySelector('.game-div')
    div.id = room.name
    div.style.backgroundImage = `url('${room.img_url}')`


}

const getAdvItems = () => {
    fetch(advItmURL)
    .then(response => response.json())
    .then(advItms => {
    })
}

const getChar = () => {
    fetch(charURL)
    .then(response => response.json())
    .then(char => {
    })
}

const getRecs = () => {
    fetch(recURL)
    .then(response => response.json())
    .then(recipes => {
    })
}

const getInvetory = () => {
    fetch(invURL)
    .then(response => response.json())
    .then(inventory => {
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
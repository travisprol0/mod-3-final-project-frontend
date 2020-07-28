const URL = 'http://localhost:3000/'
const [itemURL, charURL, advItmURL, recURL, roomURL, invURL] = [URL+'items', URL+'characters', URL+'advanced_items', URL+'recipes', URL+'rooms', URL+'inventories'];
let roomNumber = 0

const getItems = () => {
    fetch(itemURL)
    .then(response => response.json())
    .then(items => {
        renderItems(items)
    })
}

const renderItems = (items) => {
    const div = document.querySelector('.img-div');
    document.querySelectorAll('img').forEach(e=>e.remove())
    //console.log(item.room_id, parseInt(div.id, 10))
    items.forEach(item => {
        const img = document.createElement('img');
        img.src = item.img_url
        img.id = item.name
        if (item.room_id === parseInt(div.id, 10)) {
            div.appendChild(img)
        }
    })
}

const getRooms = () => {
    fetch(roomURL)
    .then(response => response.json())
    .then(rooms => {
        renderRoom(rooms[roomNumber])
        getItems()
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
            if (roomNumber < 2) {
                roomNumber ++
                renderRoom(rooms[roomNumber])
            }
        } else if (e.target.className === "arrow left"){
            if (roomNumber > 0) {
                roomNumber --
                renderRoom(rooms[roomNumber])
            }
        }
    })
}

const renderRoom = room => {
    const div = document.querySelector('.game-div')
    const imgDiv = document.querySelector('.img-div')
    div.id = room.id
    imgDiv.id = room.id
    div.setAttribute('data-name', room.name)
    div.style.backgroundImage = `url('${room.img_url}')`
    getItems()
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
    getAdvItems()
    getRecs()
    getChar()
    getInvetory()
}


document.addEventListener('DOMContentLoaded', main)
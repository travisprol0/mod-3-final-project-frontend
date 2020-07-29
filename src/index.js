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
        img.dataset.id = item.id
        //quickly get the inventory here to make sure the item isn't in there
        inventoryCheck(item, div, img)
    })
    getInventory()
}

//this is different from getInventory, I swear
const inventoryCheck = (item, div, img) => {
    fetch(invURL)
    .then(response => response.json())
    .then(inventory => {
        if (item.room_id === parseInt(div.id, 10)&&(item.inventory_id != inventory.id)) {
            div.appendChild(img)
        }          
    })
}

//the proper inventory get here
const getInventory = () => {
    fetch(invURL)
    .then(response => response.json())
    .then(inventory => {
        itemClickHandler(inventory)
        renderInventory(inventory)        
    })
}
const getInventoryNoClick = () => {
    fetch(invURL)
    .then(response => response.json())
    .then(inventory => {
        renderInventory(inventory)        
    })
}

const itemClickHandler = inventory => {
    const imgs = document.querySelectorAll('.game-div img') //img that are direct children of .game-div
    imgs.forEach(img => {
        img.addEventListener('click', (e) => {
            object = {inventory_id: inventory.id}
            //console.log(e.target.getAttribute('data-id'));
            fetch(itemURL + '/' + e.target.getAttribute('data-id'), {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify (object)
            })
            .then(response => response.json())
            .then(item => {
                img.remove()
                //can't just render inventory with the same inventory object again, but don't want more event listeners for the same stuff
                getInventoryNoClick()
            })
        })
    })
}

const renderInventory = inventory => {
    invDiv = document.querySelector('.inventory-div')
    itemsDivs = invDiv.children
    for (let i = 0; i < itemsDivs.length; i++) {
        itemsDivs[i].innerHTML = "";
    }
    //console.log(itemsDivs)
    items = inventory.items
    for (let i = 0; i < items.length; i++) {
        img = document.createElement('img')
        img.src = items[i].img_url
        img.id = items[i].id
        itemsDivs[i].appendChild(img);
    }
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


const main = () => {
    getRooms()
    getAdvItems()
    getRecs()
    getChar()
}


document.addEventListener('DOMContentLoaded', main)
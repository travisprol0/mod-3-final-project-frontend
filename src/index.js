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
                pickupMessage(item)
            })
        })
    })
}

const pickupMessage = item => {
    const div = document.querySelector('.game-div')
    const textDiv = document.createElement('div')
    textDiv.className = 'text-div'
    const p = document.createElement('p')
    p.className = 'text'
    if (item.name === "Stick" || item.name === "Hammer" || item.name === "Rod"){
        p.textContent = `I picked up a ${item.name.toLowerCase()}`
    } else {
        p.textContent = `I picked up ${item.name.toLowerCase()}`
    }
    textDiv.append(p)
    div.append(textDiv)
    setTimeout(function(){ p.remove(); textDiv.remove() }, 2500);
}

const throwAwayMessage = item => {
    const div = document.querySelector('.game-div')
    const textDiv = document.createElement('div')
    textDiv.className = 'text-div'
    const p = document.createElement('p')
    p.className = 'text'
    if (item.name === "Matches") {
        p.textContent = `I don't need these ${item.name.toLowerCase()} anymore!`
    } else {
        p.textContent = `I don't need this ${item.name.toLowerCase()} anymore!`
    }
        textDiv.append(p)
    div.append(textDiv)
    setTimeout(function(){ p.remove(); textDiv.remove() }, 2500);
}

const invClickHandler = (inventory) => {
    const menu = document.querySelectorAll('.menu')
    menu.forEach(clicky => {
        clicky.addEventListener('click', e => {
            switch (e.target.innerText) {
                case 'throw away':
                    object = {inventory_id: inventory.id+1}
                    fetch(itemURL+'/'+e.target.id, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify (object)
                    })
                    .then(response => response.json())
                    .then(item => {
                        renderRoomByID(item.room_id)
                        getInventoryNoClick()
                        throwAwayMessage(item)
                    })
                    break;
            }
        })
    })
}

const renderRoomByID = (id) => {
    fetch(roomURL)
    .then(response => response.json())
    .then(rooms => {
        for (let i=0; i<rooms.length; i++){
            if(parseInt(rooms[i].id, 10) == id){
                roomNumber = i
                renderRoom(rooms[i])
            }
        }
        getChar()
    })
}

const renderInventory = inventory => {
    invDiv = document.querySelector('.inventory-div')
    items = inventory.items
    itemsDivs = invDiv.children
    
    for (let i = 0; i < itemsDivs.length; i++) {
        if (items[i]){
                itemsDivs[i].innerHTML = `
                <div class="dropup-content">
                    <p class='menu' id=${items[i].id}>throw away</p>
                    <p class='menu' id=${items[i].id}>combine</p>
                </div>
            `;
        } else {
            itemsDivs[i].innerHTML = ''
        }
    }

    for (let i = 0; i < items.length; i++) {
        img = document.createElement('img')
        img.src = items[i].img_url
        img.id = items[i].id
        itemsDivs[i].className = 'item'
        itemsDivs[i].appendChild(img);
    }
    invClickHandler(inventory)
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
    getChar()
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
    .then(character => {
        renderChar(character)
    })
}

const renderChar = character => {
    const gameDiv = document.querySelector('.game-div')

    const img = document.createElement('img');
    img.src = character.img_url
    img.id = character.name
    img.className = 'character'
    img.dataset.id = character.id
    gameDiv.append(img)
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
}


document.addEventListener('DOMContentLoaded', main)
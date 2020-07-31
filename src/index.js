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
            if (img.className != 'character'){
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
            })}
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
                case 'craft':
                    getRecipe(e.target.id, inventory)
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
    const invDiv = document.querySelector('.inventory-div')
    const items = inventory.items
    const advancedItems = inventory.advanced_items
    const itemsDivs = invDiv.children
    
    for (let i = 0; i < itemsDivs.length; i++) {
        if (items[i]){
                itemsDivs[i].innerHTML = `
                <div class="dropup-content">
                    <p class='menu' id=${items[i].id}>throw away</p>
                    <p class='menu' id=${items[i].id}>craft</p>
                </div>
            `;
        } else {
            itemsDivs[i].innerHTML = ''
        }
    }

    const allItems = items.concat(advancedItems);

    for (let i = 0; i< allItems.length; i++){
        img = document.createElement('img')
        img.src = allItems[i].img_url
        img.id = allItems[i].id
        img.dataset.name = allItems[i].name
        img.dataset.room = allItems[i].room_id
        itemsDivs[i].className = 'item'
        itemsDivs[i].appendChild(img);
    }

    invClickHandler(inventory)
}

const getRooms = () => {
    document.querySelector('.inventory-div').style.visibility = 'visible'
    document.querySelector('.game-div span').style.visibility = "visible"
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

const getRecipe = (itemId, inventory) => {
    fetch(recURL)
    .then(response => response.json())
    .then(recipes => {
        recipes.forEach(recipe => {
            recipe.items.forEach(item => {
                if (item.id == itemId){
                    renderRecipe(recipe, inventory)
                }
            })
        })
    })
}

const hideMenu = () => {
    if (document.querySelector('.craft')) {
        const content = document.querySelectorAll('.dropup-content')
        content.forEach(menu => {
            menu.style.visibility = 'hidden'
        })
    }
}


const renderRecipe = (recipe, inventory) => {
    const div = document.querySelector('.game-div')
    const craftDiv = document.createElement('div')
    craftDiv.className = 'craft'

    const nameDiv = document.createElement('div')
    nameDiv.className = 'name-div'
    nameDiv.id = recipe.advanced_item.name
    nameDiv.innerHTML = `<p>${recipe.advanced_item.name}</p>`

    const firstIngDiv = document.createElement('div')
    firstIngDiv.className = 'crafting'
    firstIngDiv.id = 'first'

    const secondIngDiv = document.createElement('div')
    secondIngDiv.className = 'crafting'
    secondIngDiv.id = 'second'

    const advancedItemDiv = document.createElement('div')
    advancedItemDiv.className = 'crafting'
    advancedItemDiv.id = 'advancedItem'

    const invItemOneDiv = document.createElement('div')
    invItemOneDiv.className = 'crafting'
    invItemOneDiv.id = 'one'

    const invItemTwoDiv = document.createElement('div')
    invItemTwoDiv.className = 'crafting'
    invItemTwoDiv.id = 'two'

    const createButtonDiv = document.createElement('div')
    createButtonDiv.className = 'button'
    createButtonDiv.innerHTML = '<p><span>craft</span></p>'
    
    const clearButtonDiv = document.createElement('div')
    clearButtonDiv.className = 'clear'
    clearButtonDiv.innerHTML = '<p><span>clear</span></p>'

    const plusDiv = document.createElement('div')
    plusDiv.className = 'plus-equals'
    plusDiv.id = 'plus'
    plusDiv.textContent = '+'

    const equalsDiv = document.createElement('div')
    equalsDiv.className = 'plus-equals'
    equalsDiv.id = 'equals'
    equalsDiv.textContent = '='

    const xButtonDiv = document.createElement('div')
    xButtonDiv.className = 'x-button'
    xButtonDiv.innerHTML = '<p><span>X</span></p>'

    const itemOne = document.createElement('img')
    itemOne.src = recipe.items[0].img_url
    itemOne.dataset.name = recipe.items[0].name
    firstIngDiv.appendChild(itemOne)

    const itemTwo = document.createElement('img')
    itemTwo.src = recipe.items[1].img_url
    itemTwo.dataset.name = recipe.items[1].name
    secondIngDiv.appendChild(itemTwo)

    // const invItemOne = document.createElement('img')
    // const invItemTwo = document.createElement('img')

    // recipeInventoryClick(invItemOne, invItemTwo)

    // invItemOneDiv.appendChild(invItemOne)
    // invItemTwoDiv.appendChild(invItemTwo)

    const advancedItem = document.createElement('img')
    advancedItem.src = recipe.advanced_item.img_url
    advancedItem.dataset.name = recipe.advanced_item.name
    advancedItemDiv.appendChild(advancedItem)

    craftDiv.append(xButtonDiv, nameDiv, firstIngDiv, secondIngDiv, advancedItemDiv, plusDiv, equalsDiv, invItemOneDiv, invItemTwoDiv, createButtonDiv, clearButtonDiv)
    div.append(craftDiv)

    
    recipeInventoryClick(recipe, createButtonDiv, inventory)
    removeItemFromCraft(itemOne, itemTwo, recipe, inventory, clearButtonDiv)
    closeRecipe(xButtonDiv, craftDiv)
    hideMenu()
}

const craftIt = (recipe, itemOne, itemTwo, inventory) => {
    const one = recipe.items[0]
    const two = recipe.items[1]

    if (((itemOne.firstChild.getAttribute('data-name') === one.name)||(itemOne.firstChild.getAttribute('data-name') === two.name))&&((itemTwo.firstChild.getAttribute('data-name') === one.name)||(itemTwo.firstChild.getAttribute('data-name') === two.name))) {
        const itemId = recipe.advanced_item.id
        getAdvItems(itemId, inventory, itemOne, itemTwo)
        document.querySelector('.craft').remove()
        showMenu()
    } else {
        const crafting = document.querySelector('.craft')
        crafting.style.visibility = 'hidden'
        failMessage()
        setTimeout(function(){crafting.style.visibility='visible'}, 2500)
    }
}

const removeItemFromCraft = (itemOne, itemTwo,  recipe, inventory, clearButtonDiv) => {
    const divOne = document.getElementById('one')
    const divTwo = document.getElementById('two')

    clearButtonDiv.addEventListener('click', e => {
        divOne.innerHTML = ""
        divTwo.innerHTML = ""
    })       
    
}

const failMessage = () => {
    const div = document.querySelector('.game-div')
    const textDiv = document.createElement('div')
    textDiv.className = 'text-div'
    const p = document.createElement('p')
    p.className = 'text'
    const num = Math.floor(Math.random() * Math.floor(3))
    switch (num) {
        case 0:
            p.textContent = `...That's not quite right`
            break;
        case 1:
            p.textContent = `Try harder next time`
            break;
        case 2:
            p.textContent = `You're bad and you should feel bad`
            break;
    }
    textDiv.append(p)
    div.append(textDiv)
    setTimeout(function(){ p.remove(); textDiv.remove() }, 2500);
}

const getAdvItems = (itemId, inventory, itemOne, itemTwo) => {
    const object = {inventory_id: inventory.id}
    fetch(advItmURL + '/' + itemId, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(object)
    })
    .then(response => response.json())
    .then(response => deleteItems(itemOne, itemTwo))
}

const deleteItems = (itemOne, itemTwo) => {
    items = {itemOne, itemTwo}
    const itemOneId = itemOne.firstChild.id
    const itemTwoId = itemTwo.firstChild.id
    console.log(itemOne)
    
    fetchDeleteItems(itemOneId)
    fetchDeleteItems(itemTwoId)
}

const fetchDeleteItems = (itemId) => {
    fetch(itemURL + '/' + itemId, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(response => {getInventoryNoClick()})
}

const closeRecipe = (xButtonDiv, craftDiv) => {
    xButtonDiv.addEventListener('click', () => {
        craftDiv.remove();
        showMenu();
    })
}

const showMenu = () => {
    const content = document.querySelectorAll('.dropup-content')
    content.forEach(menu => {
        menu.style.visibility = 'visible'
    })
}

const recipeInventoryClick = (recipe, createButtonDiv, inventory) => {
    const inventoryItems = document.querySelectorAll('.item img')
    const one = document.getElementById('one')
    const two = document.getElementById('two')
    inventoryItems.forEach(item => {
        item.addEventListener('click', e => {
            if (one.innerHTML === ""){
                const imgOne = document.createElement('img')
                imgOne.src = e.target.src
                imgOne.dataset.name = e.target.getAttribute('data-name')
                imgOne.id = e.target.id
                imgOne.dataset.room = e.target.getAttribute('data-room')
                one.append(imgOne)
            
            } else if (two.innerHTML === "") {
                const imgTwo = document.createElement('img')
                imgTwo.src = e.target.src
                imgTwo.dataset.name = e.target.getAttribute('data-name')
                imgTwo.id = e.target.id
                imgTwo.dataset.room = e.target.getAttribute('data-room')
                two.append(imgTwo)
                }
            })
        })
        craftClick(recipe, createButtonDiv, inventory, one, two)
}
const craftClick = (recipe, createButtonDiv, inventory, one, two) => {
    createButtonDiv.addEventListener('click', () =>{
        craftIt(recipe, one, two, inventory)
    })
}


const main = () => {
    document.querySelector('.inventory-div').style.visibility = 'hidden'
    document.querySelector('.game-div span').style.visibility = "hidden"

    const start = document.createElement('div')
    start.className = 'start'
    start.innerHTML = '<p><span>START</span></p>'

    const div = document.querySelector('.game-div')
    div.appendChild(start)
    div.style.backgroundImage = "url('images/background.png')"

    start.addEventListener('click', () => {
        start.remove()
        getRooms()
    })
}

document.addEventListener('DOMContentLoaded', main)
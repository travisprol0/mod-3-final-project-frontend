const URL = 'http://localhost:3000/'
const [itemURL, charURL, advItmURL, recURL] = [URL+'items', URL+'characters', URL+'advanced_items', URL+'recipes'];

const getItems = () => {
    fetch(itemURL)
    .then(response => response.json())
    .then(items => {
        console.log(items)
    })
}




const main = () => {
    getItems()
}

document.addEventListener('DOMContentLoaded', main)
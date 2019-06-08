const dotenv = require('dotenv').config()
const API_KEY = process.env.API_KEY
const TOKEN = process.env.TOKEN
const boardName = process.env.Board_name
const Trello = require("trello")
const axios = require('axios');

const url_all_boards = `https://api.trello.com/1/members/me/boards?key=${API_KEY}&token=${TOKEN}`
const trello = new Trello(API_KEY, TOKEN)

const label = process.argv[2]

store_card_urls = []

const resUrl = async function () {
    let MemeberShipID
    try {
        const get_all_boards = await axios(url_all_boards)
        for (ele in get_all_boards.data) {
            if (get_all_boards.data[ele].name == boardName) {
                MemeberShipID = get_all_boards.data[ele].memberships[0].idMember
            }
        }
        const board = await trello.getBoards(MemeberShipID)
        const listOnBoard = await trello.getListsOnBoard(board[0].id)
        const cardOnList = await trello.getCardsOnList(listOnBoard[0].id)
        return cardOnList
    } catch (error) {
        console.log(error)
    }

}
const get_label_url = resUrl()


get_label_url.then(cards => {
    for (ele in cards) {
        for (i in cards[ele].labels) {
            if (cards[ele].labels[i].name == label) {
                store_card_urls.push(cards[ele].shortUrl)
            }
        }
    }
    if (store_card_urls.length == 0) {
        console.log("Can't not the find the card with this label")
    } else {
        console.log(store_card_urls)
    }
})


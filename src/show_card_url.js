'use strict';

require('dotenv').config();
const API_KEY = process.env.API_KEY;
const TOKEN = process.env.TOKEN;
const BOARD_NAME = process.env.BOARD_NAME;
const Trello = require('trello');
const axios = require('axios');

const urlAllBoard = `https://api.trello.com/1/members/me/boards?key=${API_KEY}&token=${TOKEN}`;
const trello = new Trello(API_KEY, TOKEN);

let storeCardUrls = [];

const resUrl = async function () {
  try {
    const getAllBoards = await axios(urlAllBoard);

    const board = getAllBoards.data.filter((board) => board.name === BOARD_NAME)[0];

    const listOnBoard = await trello.getListsOnBoard(board.id);

    const cards = await trello.getCardsOnList(listOnBoard[0].id);
    for (let ele in cards) {
      for (let i in cards[ele].labels) {
        if (cards[ele].labels[i].name === process.argv[2]) {
          storeCardUrls.push(cards[ele].shortUrl);
        }
      }
    }
    if (storeCardUrls.length === 0) {
      console.log("Can't not the find the card with this label");
    } else {
      console.log(storeCardUrls);
      return storeCardUrls;
    }
  } catch (error) {
    console.log(error);
  }
};
resUrl();

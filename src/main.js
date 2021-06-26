
//require and imports

import 'regenerator-runtime/runtime'
require('dotenv').config()

//// API keys
import { steamApi } from './keys.js'; 

//// steam IDs
import { playerOneId } from './keys.js';
import { playerTwoId } from './keys.js';
import { playerThreeId } from './keys.js';


// start - steamAPI data pull

async function callSteamApi(brother) {

  console.log("start calling API")

const steamUrl = new URL('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/');
const steamParams = {
    'key': steamApi,
    'steamids': brother,
  };

  // add query string to URL
  steamUrl.search = new URLSearchParams(steamParams).toString();
  // fetch resource
  const rawResponse = await fetch(steamUrl);
  const json = await rawResponse.json();

  if (!rawResponse.ok) {
    alert('failed to load API', steamUrl);
    // we want to stop execution if there is an error
    return;
  }
  if (rawResponse.ok) {
    console.log('Success for ', steamUrl);
  }
  
  console.log("data here->", json)
  return json;
  

};

// end - steam API data pull


async function onlineStatus(id, personastate, personaname, gameextrainfo) {
  
  if (personastate === 0) {
    console.log(`${personaname} is offline, last seen at..`);
    document.getElementById(id).classList.remove("defaultBadge");
    document.getElementById(id).classList.add("offlineBadge");
    return
  } 
  if (personastate === 1) {
    console.log(`${personaname} is online`);
    document.getElementById(id).classList.remove("defaultBadge");
    
    // start - detect if playing a game
        if (gameextrainfo === undefined) {
          document.getElementById(id).classList.add("chatBadge");
        }
        else {
          document.getElementById(id).classList.add("onlineBadge");
        }
    // end - detect if playing a game
    return
  }
  if  (personastate === 2) {
    console.log(`${personaname} is busy`);
    return
  }
  if (personastate === 3) {
    console.log(`${personaname} is away`);
    return
  }
  if (personastate === 4) {
    console.log(`${personaname} is snoozin`);
    return
  }
  if (personastate === 5) {
    console.log(`${personaname} is looking to trade`);
    return
  }
  if (personastate === 6) {
    console.log(`${personaname} is looking to play`);
    return
  }
  else {
    console.log("bye");
  }
  
};

// sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
// sleep


// start - code runs on page load
async function onLoadHandler() {
  
  console.log("the page loaded");


  await sleep(10);

  const playerOneData = await callSteamApi(playerOneId);

  onlineStatus(1, playerOneData.response.players[0].personastate, playerOneData.response.players[0].personaname, playerOneData.response.players[0].gameextrainfo)



  await sleep(10);
  const playerTwoData = await callSteamApi(playerTwoId);
  
  
  onlineStatus(2, playerTwoData.response.players[0].personastate, playerTwoData.response.players[0].personaname, playerTwoData.response.players[0].gameextrainfo)

  await sleep(10);

  const playerThreeData = await callSteamApi(playerThreeId);

  onlineStatus(3, playerThreeData.response.players[0].personastate, playerThreeData.response.players[0].personaname, playerThreeData.response.players[0].gameextrainfo)

  console.log(playerThreeData.response.players[0].gameextrainfo)
  console.log(playerOneData.response.players[0].gameextrainfo)
  
  
};


// end - code runs on page load

// button listener for user input


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onLoadHandler);
} else {
  onLoadHandler();  
}
"use strict"

// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------
// Posting the Total
// Initiating new round
// 
// player total (score, shows whether they're up or down based on the bank account they started with) --- create, edit actions.
// player Bank account --- create, edit
// player name ----create, edit, update, destroy.

// rounds ---- create

// bots ------ bank account? 
// bots ------ total (score, shows whether they're up or down based on the bank account they started with)

// house ------ we could show whether the house won or lost the round.

// after playing around with the FE logic of the game, I'm wondering I actually need a card, deck, or hand model on the backend. 
// The generation of cards and hands can happen on the FE and cards in any given round don't necessarily need to be recorded, only the total matters.
// It'll be more optimized that way as well.

function placeBet(){
  //click event happens on clicking place bet.
  //sends fetch event creating the user's bet for that round: 
  //document.querySelector(".users_bet").value
  // .then(startGame())
}

function findUser(data, name){
  data.forEach((player) => {
    if (player[name] === name){
      return player
    }
  })
}

document.getElementById("New_Round").addEventListener('click', function(){
  toggleNewRoundButton()
  startGame()
})


let placeBetButton = document.getElementById("place_bet")

placeBetButton.addEventListener('click', function(event){
  event.preventDefault();
    let formData = {
       bet_amount: document.getElementById("bet_amount").value,
       user_id: document.getElementById("player_id").innerText
      }

  fetch('http://localhost:3000/user_bets/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({formData})
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("player_bet_id").innerHTML = `${data.id}`
      document.getElementById("player_bet").innerHTML = `Your Wager: ${data.bet_amount}`
    })

  
  startGame()

})


let createUserButton = document.getElementById("create_user")

createUserButton.addEventListener('click', function(event){
  event.preventDefault();
    let formData = {
      name: document.querySelector(".user_name").value,
      bank_account: document.querySelector(".user_bank").value
    }
  console.log(formData)
  fetch('http://localhost:3000/users/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({formData})
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("player_id").innerHTML = `${data.id}`
      document.getElementById("player_bank_account").innerHTML = `Your Bank Account: ${data.bank_account}`
    })
  fetchBots()
  toggleBetForm()
  toggleUserForm()

})




function toggleUserForm(){
  if (document.getElementById("New_User").style.display === 'none'){
    document.getElementById("New_User").style.display = 'inline'
  } else {
    document.getElementById("New_User").style.display = 'none'
  }
}

// function createFormListener(){
//   const form = document.getElementById('create_user_form')
//   form.addEventListener('sumbit', function(event){
//     event.preventDefault()
//     const formData = {
//       name: event.target[0].value,
//       bank_account: event.target[1].value
//     }

// function createUser(){
//     let formData = {
//       name: document.querySelector(".user_name").value,
//       bank_account: document.querySelector(".user_bank").value
//     }
//   console.log(formData)
//   fetch('http://localhost:3000/users/', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({formData})
//   })
//     .then(res => res.json())
//     .then(data => console.log(data))
//   fetchBots()
//   toggleBetForm()
//   toggleUserForm()
// }




function listify(data, number){
  let html = ''
  if (number > 1){
  data.forEach(bot => html+= 
  `<div id='${bot.name}_hand'>
  
  </div>
  <div id="${bot.name}_total"></div>
  <div id='${bot.name}_bank_account'>
  <h4>${bot.name}'s Bank Account: ${bot.bank_account}</h4></div>
  <div id="${bot.name}_wager"></div>`)
  document.getElementById("bot_container").innerHTML = html
  } else if (number === '1'){
  html += `<div id='${data[1].name}_hand'>
  
  </div>
<div id="${data[1].name}_total"></div>
<div id='${data[1].name}_bank_account'>
<h4>${data[1].name}'s Bank Account: ${data[1].bank_account}</h4>
</div>
<div id="${data[1].name}_wager"></div>`
document.getElementById("bot_container").innerHTML = html
  }
};



    // function drawCard(){
    //   //randomizing the index ensures the deck is always 'shuffled.'
    //   let cardIndex = Math.floor(Math.random() * deck.length)
    //   let card = deck[cardIndex]
    //   deck.splice(cardIndex, 1)
    //   return card
    // }



function fetchBots(){
  let numPlayers = document.querySelector(".other_players").value
    fetch('http://localhost:3000/bots/')
      .then(res => res.json())
      .then(data => listify(data, numPlayers))
}





function calculateWhoWon(){

  
  let userId = parseInt(document.getElementById("player_id"))
  let playerBankAccount = parseInt(document.getElementById("player_bet").innerHTML.split(" ")[2])
  let wager = parseInt(document.getElementById("player_bank_account").innerHTML.split(" ")[3])



  hitMeButton.style.display = 'none'
  stayButton.style.display = 'none'
  doubleDownButton.style.display = 'none'


  const userTotal = calculateTotal(userHand)
  const dealerTotal = calculateTotal(dealerHand)
  if (userTotal > dealerTotal && userTotal <= 21){
    document.getElementById("Won").style.display = "inline"
    fetch(`http://localhost:3000/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({bank_account: wager + playerBankAccount})
  })
    .then(res => res.json())
    .then(data => document.getElementById("player_bank_account").innerHTML = `Your Bank Account: ${data.bank_account}`)
  

  } else if (userTotal === dealerTotal && userTotal <= 21) {
    document.getElementById("tie").style.display = "inline"
    document.getElementById("Blackjack!").style.display = 'none'

  } else if (userTotal < dealerTotal && dealerTotal <= 21){
    document.getElementById('dealer_won').style.display = 'inline'

    fetch(`http://localhost:3000/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({bank_account: wager - playerBankAccount})
    })
      .then(res => res.json())
      .then(data => document.getElementById("player_bank_account").innerHTML = `Your Bank Account: ${data.bank_account}`)

  } else if (dealerTotal > 21 && userTotal <= 21){
    document.getElementById("dealer_busted").style.display = 'inline'
    document.getElementById("Won").style.display = "inline"
    toggleNewRoundButton()

    fetch(`http://localhost:3000/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({bank_account: wager + playerBankAccount})
    })
      .then(res => res.json())
      .then(data => document.getElementById("player_bank_account").innerHTML = `Your Bank Account: ${data.bank_account}`)
  }
  // toggleNewRoundButton() <-- Putting this here should cause it to happen automatically no matter what condition in my understanding. But for some reason it's not doing so.
}

// function calculateBotWin(){
  //implements the same logic for each bot. Called at bottom of "calculateWhoWon"
// }

function dealBotsIn(){
  if (document.getElementById("Wild Bill Hickok_hand")){
    wildBillHand.push(drawCard())
    let value = wildBillHand[wildBillHand.length-1].value
    let suit = wildBillHand[wildBillHand.length-1].suit
    let card = document.getElementById(`hickok_${value}_${suit}`)
    card.style.display = 'inline'
    document.getElementById('Wild Bill Hickok_total').innerHTML = `Wild Bill Hickok's Total: ${calculateTotal(wildBillHand)}`
  }
  if (document.getElementById("Wyatt Earp_hand")){
    wyattHand.push(drawCard())
    let value = wyattHand[wyattHand.length-1].value
    let suit = wyattHand[wyattHand.length-1].suit
    let card = document.getElementById(`wyatt_${value}_${suit}`)
    card.style.display = 'inline'
    document.getElementById('Wild Bill Hickok_total').innerHTML = `Wild Bill Hickok's Total: ${calculateTotal(wildBillHand)}`
  }
}




// ------------------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------------------

function toggleGameButtons(){
  if (hitMeButton.style.display === 'none'){
    hitMeButton.style.display = 'inline'
    stayButton.style.display = 'inline'
    doubleDownButton.style.display = 'inline'
  } else {
    stayButton.style.display = 'none'
    doubleDownButton.style.display = 'none'
    hitMeButton.style.display = 'none'
  }
}



let playerContainer = document.getElementById("player_hand")
let dealerContainer = document.getElementById("dealer_hand")
let wyattContainer = document.getElementById("Wyatt Earp_hand")
let hickokContainer = document.getElementById("Wild Bill Hickok_hand")


//calls when 'fetching' new round. Alternatively, could call initially before anything happens, and then a separate function hiding all displays could be called when starting new round.
//new round will also have to reset player total.

function generateDeck(){

  let suits = ["Hearts", "Spades", "Clubs", "Diamonds"]
  let values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "J", "Q", "A"]
  let playerHTML = ''
  let dealerHTML = ''
  let deck = []
  for (let suit of suits){
    for (let value of values){
      deck.push({suit: suit, value: value})
      playerHTML += `<img src="images/${suit}${value}.png" alt="${value} of ${suit}" id="player_${value}_${suit}" style="display: none;" class="playing_card"></img>`
      dealerHTML += `<img src="images/${suit}${value}.png" alt="${value} of ${suit}" id="dealer_${value}_${suit}" style="display: none;" class="playing_card"></img>`
      if (document.getElementById("Wild Bill Hickock_hand")){
        document.getElementById("Wild Bill Hickock_hand").innerHTML += `<img src="images/${suit}${value}.png" alt="${value} of ${suit}" id="hickok_${value}_${suit}" style="display: none;"></img>`
      }
      if (document.getElementById("Wyatt Earp_hand")){
        document.getElementById("Wyatt Earp_hand").innerHTML += `<img src="images/${suit}${value}.png" alt="${value} of ${suit}" id="wyatt_${value}_${suit}" style="display: none;"></img>`
      }
    }
  }

  dealerHTML += `<img src="images/card_back.png" alt="Card Back" id="card_back" style="display: none;"></img>`
  playerContainer.innerHTML = playerHTML
  dealerContainer.innerHTML = dealerHTML
  return deck
};











// ------------------------------------------
//  EVENT LISTENERS
// ------------------------------------------


const hitMeButton = document.getElementById("hit_me")
const stayButton = document.getElementById("stay")
const doubleDownButton = document.getElementById("double_down")

doubleDownButton.addEventListener('click', function(e){
  e.preventDefault()
  let wager = parseInt(document.getElementById("player_bank_account").innerHTML.split(" ")[3])
  let player_bet_id = document.getElementById("player_bet_id").innerHTML

  fetch(`http://localhost:3000/user_bets/${player_bet_id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id: parseInt(player_bet_id), user_bet: wager * 2})
  })

    .then(res => res.json())
    .then(data => document.getElementById("player_bet").innerHTML = `Your Wager: ${data.bet_amount}`)

})


hitMeButton.addEventListener('click', hitMe)
stayButton.addEventListener('click', userStayed)
document.getElementById('split').addEventListener('click', split)



let playerTotal = document.getElementById("player_total")
let dealerTotalContainer = document.getElementById("dealer_total")


function calculateTotal(hand){
  let total = 0
  hand.forEach(card => {
    if (parseInt(card.value) > 0){
      total += parseInt(card.value)
    } else if (card.value === "A" && total <= 10){
      total += 11
    } else if (card.value === "A" && total > 10) {
      total += 1
      card.value = 1
    } else {
      total += 10
    }
  })
};









//hit me:
//event listener. Targets card in player card.


//when a user presses a stay button, the dealer's turn begins.

// need to have buttons for 'hit-me', 'stand,' 'double down,' etc. These will be click events linked to buttons with specific IDs.
// Hit Me Button: identifier.addEventListener('click', hitMe)
// Etc


//------------------------------------------
// General BlackJack Rules
//------------------------------------------
let wildBillHand = []
let wyattHand = []

let dealerHand = []
let userHand = []
let userHand2 = []
let userHand3 = []
let userHand4 = []
//RE: splitting.
//Most casinos allow three splits.
//This means a user can have a total of four hands.
//As the project deadline is creeping up fast, I might have to nix it and come back to it later. It's more important to get my backend running to attain minimum viable product at this point.
// have to add a function that calls whenever a user takes an action to see if the length of these hands is > 0, to check if user split or not.
// if length is greater than 0, user gets another turn playing that hand.
// I guess in the backend there could be a true/false bool, saying whether hand has been played on the associated round or not.
// if round.hand.been_played is set to true, it moves on.

//*Some casinos only allow one split, so that could be a place to start on this and still make 'mvp.' Some other casinos allow infinite, so that could be a way to grow it in the future.


class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }
}








//Once we implement everything, we need to call GenerateDeck for every round, to ensure the deck never runs out. 
let deck = generateDeck()
//Calls when fetching round, but for now, it's just "deck" as defined above.

function drawCard(){
  //randomizing the index ensures the deck is always 'shuffled.'
  let cardIndex = Math.floor(Math.random() * deck.length)
  let card = deck[cardIndex]
  deck.splice(cardIndex, 1)
  return card
}
//function initiateRound(){

  //buttons greyed or hidden except 'place bet.'
//}

// console.log(drawCard())
// console.log(deck.length)

// (pseudoCode):
// function aces(card){
//   if (card.value === 'A' && hand.total <= 11){
//     card.value = 10
//   } else {
//     card.value = 1
//   }
// }

function calculateTotal(hand){
  let total = 0
  hand.forEach(card => {
    if (parseInt(card.value) > 0){
      total += parseInt(card.value)
    } else if (card.value === "A" && total <= 10){
      total += 11
    } else if (card.value === "A" && total > 10) {
      total += 1
      card.value = 1
    } else {
      total += 10
    }
  })
  return total
};




function swapAceValue(){
  if (userHand.find(card => card.value ==="A")){  
  let ace = userHand.find(card => card.value === "A")
  ace.value = 1
  }
}

function checkIfBust(){
  let aces = []
  aces.push(userHand.find(card => card.value === "A"))
  let bust = document.getElementById("busted")
  let total = calculateTotal(userHand)
  console.log(typeof aces[0])
  if (total > 21 && typeof aces[0] != "undefined"){
    swapAceValue(userHand)
    total = calculateTotal(userHand)
    return total
  } else if (total > 21 && typeof aces[0] === "undefined"){
    bust.style.display = "inline"
    toggleGameButtons()
    toggleNewRoundButton()
    //fetch request, pushing data back to the database.
    //end round, player loses all money they bet.
  }
}




// console.log(calculateTotal(userHand))

//Will be linked to player click event:
function hitMe(){
  console.log(userHand)
  userHand.push(drawCard())
  let value = userHand[userHand.length-1].value
  let suit = userHand[userHand.length-1].suit
  let card = document.getElementById(`player_${value}_${suit}`)
  card.style.display = 'inline'
  checkIfBust()
  playerTotal.innerHTML = `<h4>${calculateTotal(userHand)}</h4>`
  if (calculateTotal(userHand) === 21){
    document.getElementById("Blackjack!").style.display = "inline"
  } else if (calculateTotal(userHand) != 21){
    document.getElementById("Blackjack!").style.display = "none"
    //There's no reason for a person to bet on a 'soft' 21, but as it isn't forbidden it is a possibility. The above line is responsible for re-hiding the 'blackjack' div.
  }
  document.getElementById("double_down").style.display = 'none'
  return userHand
}




//split will activate on a click event.

//The button for split will have it's display set to hidden unless player has two of the same card in his hand.

//I was thinking initially that 'split' would add a new array into UserHand, but this messes up the way calculateTotal works.

//So a better way to do it with the code I've already written is to add arrays.

//Looked up rules on splitting and some casinos only allow one split, most allow three, and a few allow six.

function checkIfSplitPossible(){
  if (userHand.length === 2 && userHand[0].value === userHand[1].value){
    //(split button selector goes here).style.display = 'block'
    //will have to replace userHand with currentHand, once I figure out how to alternate which hand is in play, but this is the gist of it.
  }
}


function split(event){
  // userHand1.push(userHand[0])
  // userHand.unshift(userHand[0])
  document.getElementById("splitting?").style.display = 'inline'
}



// ---------------------------------------------------------------
// Known minor bugs and planned fixes once mvp is reached.
// ---------------------------------------------------------------

//when player hits, card order is set in the order they're visually displayed.
//Could try setting their order in an ordered list.
//Have them all render as they usually do, set to hidden, and in an ordered list, and then mutate the order every time hitme is called.
//After the round, this would have to reset.

//could condense divs for 'win,' 'blackjack,' and 'busted,' to one 'end condition' div with dynamic HTML determined by the functions.
//"BlackJack!" should disappear if someone bets on a 'soft' blackjack. No one would ever do this, but in theory it's not forbidden, so I may as well account for it.

//checkForAces is a little esoteric after coming back to it a few days later. It needs to be better commented.

//learn about modules--create a separate file with all the bulky blackjack stuff in it, import that into this.

//condense "hitMe" and "dealerDraw" functions into one function, to adhere to DRY.

//stretch goal: instead of rendering all cards and hiding them in player_hand and dealer_hand, render them in one container and position them 
//based on other divs linked to other parts of the page. This is probably easy but CSS is a personal weak point I need more practice with, 
//so I'm doing the thing I know will work first, rather than the thing I might have to spend extra time figuring out.

//Put all the buttons in a single div, use bubbling so I have less memory dedicated to event listeners.

//Fix console error for when ace values are swapped out. I can't think of a scenario where the issue will break the user experience, but it lingers at the back of the mind.

//if User stays on a very low hand, there is a chance the dealer will bug out and won't show his cards or begin betting.
//I suspect if dealer starts at '17' this glitch might happen as well.

//when initially implementing bots they'll use the same logic as the dealer, in later builds I can look at blackjack charts and turn them into conditionals for the bots.

//stretch goal: rework bots to vote according to conditionals set in blackjack betting charts. Have a deck that persists until it runs out of cards before 'reshuffling,' and have one bot's logic 
//count cards. 


function dealerDraw(){
  dealerHand.push(drawCard())
  let value = dealerHand[dealerHand.length-1].value
  let suit = dealerHand[dealerHand.length-1].suit
  let card = document.getElementById(`dealer_${value}_${suit}`)

  if (dealerHand.length > 1){
    card.style.display = 'inline'
  } else if (dealerHand.length > 2){
    document.getElementById("card_back").style.display = 'none'
    calculateTotal(dealerHand)
    dealerHand.forEach(card => {
      document.getElementById(`dealer_${card.value}_${card.suit}`).style.display = 'inline'
    })
  } else if (dealerHand.length === 2 && calculateTotal(dealerHand) === 21 && 21 > calculateTotal(userHand)){
    document.getElementById("card_back").style.display = 'none'
    calculateWhoWon()
    dealerHand.forEach(card => {
      document.getElementById(`dealer_${card.value}_${card.suit}`).style.display = 'inline'
    //div showing that the dealer has blackjack.
    //This condition is similar to a later one, but this one is here in case the dealer has blackjack from the start.
    toggleGameButtons()
    //request fetch patching a user loss.
    //add button asking if you wish to play again. When this initiates, you place your bet.
    }) 
  } else if (calculateTotal(dealerHand) === 21 && calculateTotal(userHand) === 21) {
    document.getElementById("tie").style.display = 'inline'

  }
}
//I can't remember if this is Ruby or Javascript, but I think the above can be refactored into a "Case" statement in future update.



//links to click event on a stay button
function userStayed(){
  toggleGameButtons()
  toggleNewRoundButton()
  dealerTotalContainer.style.display = 'inline'
  dealerHand.forEach(card => {
    document.getElementById(`dealer_${card.value}_${card.suit}`).style.display = 'inline'
  })
  dealerTotalContainer.innerHTML = calculateTotal(dealerHand)
  //the above has to stay here in case the dealer stays at two, it is not redundant.
  dealerTotalContainer.style.display = 'inline'
  document.getElementById("card_back").style.display = 'none'
  //Future refactoring reminder: I put the above two line in other places, but there's a glitch where it isn't applying when it needs to. P
  //Realized I could just put it here, which makes those other spots obsolete. 
  //I'll have to add a conditional to make sure this doesn't run until the user exhausted options down the line, when splitting is introduced.
  while (calculateTotal(dealerHand) < 17){
    dealerDraw()
    dealerTotalContainer.innerHTML = calculateTotal(dealerHand)
    //the above has to stay here to ensure the total updates correctly. Refactor note: turn it into a helper function.
  }
  calculateWhoWon()
}


function startGame(){
  playerContainer.querySelectorAll(".playing_card").forEach(card => card.style.display = 'none')
  dealerContainer.querySelectorAll(".playing_card").forEach(card => card.style.display = 'none')
  document.getElementById("Won").style.display = "none"
  document.getElementById("tie").style.display = "none"
  document.getElementById("dealer_busted").style.display = 'none'
  document.getElementById("tie").style.display = "none"
  document.getElementById("Blackjack!").style.display = 'none'
  document.getElementById("busted").style.display = 'none'
  document.getElementById("dealer_won").style.display = 'none'

  while (userHand.length > 0){
    userHand.shift()
  }
  while (dealerHand.length > 0){
    dealerHand.shift()
  }

  hitMe()
  hitMe()
  dealerDraw()
  dealerDraw()
  toggleGameButtons()
  faceDown()

  //function for bots to draw, if bots exist.
}

// Must be a HTML/CSS/JS frontend with a Rails API backend. 
// All interactions between the client and the server should be handled asynchronously (AJAX) and use JSON 
// as the communication format.
//-------> I'm not sure if rendering cards counts as a client interaction so I think I can have them rendered as is. 
//-------> If not, I can create a card object on the backend and render them up with Fetch, but they won't have a relation with anything else as that wouldn't be well optimized and would cause bugs in my current schema.


// Backend must render a resource with at least one has-many relationship. 
// ------> user has many hands because of splitting. If I can't get to splitting, then:
// ------> user has many Transactions, through rounds. This can display on a user 'transactions history' list or 'high score' list. The route would be an index showing all Users and their properties.

// For example, if we were building Instagram, we might display a list of photos with associated comments.

// The backend and frontend must collaborate to demonstrate Read, Create, and either Update or 
//Delete for at least two of your models. 

// ------> user can be created, name/bank account value can be updated, and history can be 'read' on previously mentioned score list.

// ------> Raza said he was willing to let the second model condition slide because of all the logic involved in blackjack, but if I get creative and have time I can come back to this.
// ------> was thinking maybe I could add bot players, update their names, see their histories, etc. That would be a lot of work but doable if I put a few days into this after the project is complete, just to make the portfolio more impressive.
// ------> 

//The results of each action should be diplayed to the user without a page refresh.
//--------> "new round" should wipe the slate clean. That's the last 'refresh' replacement I need to implement, but I need to knit the backend together with the front first


function toggleNewRoundButton(){
  let newRoundButton = document.getElementById("New_Round")
    if (newRoundButton.style.display === 'none'){
      newRoundButton.style.display = 'inline'
  } else {
    newRoundButton.style.display = 'none'
  }
}



//call this function when player posts create data for user
function toggleUserForm(){
  
  if (document.getElementById("New_User").style.display === 'none'){
    document.getElementById("New_User").style.display ='inline'
  } else {
    document.getElementById("New_User").style.display = 'none'
  }
};

//call this function when player clicks new round
function toggleBetForm(){
  if (document.getElementById("Placing_Bet").style.display === 'none'){
    document.getElementById("Placing_Bet").style.display = 'inline'
  } else {
    document.getElementById("Placing_Bet").style.display = 'none'
  }
};

//call this function when total is calculated
function toggleNewRoundButton(){
  const newRoundButton = document.getElementById("New_Round")
  if (newRoundButton.style.display === 'none'){
    newRoundButton.style.display = 'inline'
  } else {
    newRoundButton.style.display = 'none'
  }
}

//call this function when starting a new round.
function faceDown(){
  const cardBack = document.getElementById("card_back")
  if (cardBack.style.display === 'none'){
    cardBack.style.display = 'inline'
  } else {
    cardBack.style.display = 'none'
  }
}

//number of bots:
document.querySelector(".other_players").value
//amount of money in user bank account:
document.querySelector(".user_bank").value 
//player name:
document.querySelector(".user_name").value
//player bet:
document.querySelector(".users_bet").value


function toggleBots(){
  let botContainer = document.getElementById('bot_container')
  if (botContainer.style.display === 'none'){
    botContainer.style.display = 'inline'
  } else {
    botContainer.style.display = 'none'
  }
}
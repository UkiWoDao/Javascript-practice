/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var scoreLimit, scores, roundScore, activePlayer, dice, lastDice, player0Input, player1Input;

scores = [0, 0];
roundScore = 0;
activePlayer = 0;
scoreLimit = 100;

// TODO: clear input field text on load

// get name text field inputs
player0Input = document.getElementById('player-0-input').value;
player1Input = document.getElementById('player-1-input').value;

// create DOM var shorthand
var formDOM = document.querySelector('form');

document.getElementById('start').addEventListener('click', function() {
    // fade then hide start game screen
    formDOM.style.opacity = '0';
    formDOM.addEventListener('transitionend', function() {
        formDOM.style.display = 'none';
    });
    // display name text field inputs as names
    document.getElementById('name-0').textContent = player0Input;
    document.getElementById('name-1').textContent = player1Input;
    // allow players to manually set the score limit
    scoreLimit = document.getElementById('score-limit').value;
    document.getElementById('final-score').textContent = scoreLimit;
});

newGame();
//document.querySelector('#current-' + activePlayer).textContent = dice;
//document.querySelector('#current-' + activePlayer).innerHTML = '<em>' + dice + '</em>';

function newGame() {
  // reset scores in UI, hide dice
  document.querySelector('.dice').style.display = 'none';
  document.getElementById('score-0').textContent = '0';
  document.getElementById('score-1').textContent = '0';
  document.getElementById('current-0').textContent = '0';
  document.getElementById('current-1').textContent = '0';
  //document.getElementById('name-0').textContent = 'Player 1';
  //document.getElementById('name-1').textContent = 'Player 2';
  // mark active player in UI
  document.querySelector('.player-0-panel').classList.add('active');
  document.querySelector('.player-1-panel').classList.remove('active');
  // blur player 2 panel by default
  document.querySelector('.player-1-panel').classList.add('inactive');
  document.querySelector('.player-0-panel').classList.remove('inactive');
  // reset scores
  scores = [0, 0];
  roundScore = 0;
  activePlayer = 0;
}

function nextPlayer() {
  activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
  document.getElementById('current-0').textContent = '0';
  document.getElementById('current-1').textContent = '0';

  roundScore = 0;

  document.querySelector('.player-0-panel').classList.toggle('active');
  document.querySelector('.player-1-panel').classList.toggle('active');
  document.querySelector('.player-0-panel').classList.toggle('inactive');
  document.querySelector('.player-1-panel').classList.toggle('inactive');
}


document.querySelector('.btn-roll').addEventListener('click', function(){
  // 1. random number
  var dice = Math.floor(Math.random() * 6) + 1;

  // 2.display the result
  var diceDOM = document.querySelector('.dice');
  diceDOM.style.display = 'block';
  diceDOM.src = 'dice-' + dice + '.png';

  // 3.update the round score IF the rolled number was NOT a 1
  if (dice !== 1) {
    // Add score
    roundScore += dice;
    document.querySelector('#current-' + activePlayer).textContent = roundScore;
  } else {
    // Next player
    nextPlayer();
  }

  // 4. update the score IF the player didn't roll two 6's in a row
  if (dice === 6 && lastDice === 6) {
    // player loses current and global score
    scores[activePlayer] = 0;
    document.querySelector('#score-' + activePlayer).textContent = '0';
    nextPlayer();
  }
  lastDice = dice;
});

document.querySelector('.btn-hold').addEventListener('click', function() {
  // add current score to global scores
  scores[activePlayer] += roundScore;

  // update the UI
  document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];

  // check if player won the game
  if (scores[activePlayer] >= scoreLimit) {
    document.querySelector('#name-' +  activePlayer).textContent = 'WINNER!';
    document.querySelector('.dice').style.display = 'none';
    document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
    document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');

    // remove the buttons in case of victory
    document.querySelector('.btn-roll').style.display = 'none';
    document.querySelector('.btn-hold').style.display = 'none';
  } else {
    nextPlayer();
  }
});

document.querySelector('.btn-new').addEventListener('click', newGame);

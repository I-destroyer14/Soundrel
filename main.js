const room = [
];
document.getElementById('help-button').addEventListener('click', () => {
  document.getElementById('help').style.display = 'block';
});
document.getElementById('help-close').addEventListener('click', () => {
  document.getElementById('help').style.display = 'none';})
function waitUntilDeckIsReady() {
  return new Promise(resolve => {
    const checkInterval = setInterval(() => {
      if (shuffledCards.length === 44) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 50);
  });
}
async function death() {
  alert('You have died!');
  GameVariables.health = 0;
  GameVariables.health = 20;
  GameVariables.maxHealth = 20;
  GameVariables.weapon = 'none';
  GameVariables.taint = 'none';
  GameVariables.CanRun = true;
  GameVariables.isfilling = false;
  room.length = 0;
  shuffledCards.length = 0;
  shuffledCards.push(...shuffle(cards));
  await waitUntilDeckIsReady();
  updateWeaponDisplay();
  updateHealthDisplay();
  gameLoop();
}
function updateWeaponDisplay() {
  const weaponDiv = document.getElementById('weapon-display');
  const taintDiv = document.getElementById('taint-display');

  if (GameVariables.weapon === 'none') {
    weaponDiv.innerHTML = '<h1>No Weapon</h1>';
    taintDiv.innerHTML = '';
  } else {
    const weaponFilename = `card-diamonds-${GameVariables.weapon}.png`;
    weaponDiv.innerHTML = `
      <h1>Your Weapon:</h1>
      <img src="PlayingCards/${weaponFilename}" alt="Weapon" style="width: 160px;">
    `;

    if (GameVariables.taint === 'none') {
      taintDiv.innerHTML = `<p><strong>No Taint</strong></p>`;
    } else {
      taintDiv.innerHTML = `
        <h1><strong>Tainted by:</strong></h1>
        <img src="PlayingCards/${cardToFilename(rankToName(GameVariables.taint) + ' spade')}" alt="Taint" style="width: 80px;">
      `;
    }
  }
}
function updateHealthDisplay() {
  const healthDiv = document.getElementById('health-display');
  healthDiv.innerHTML = `
    HEALTH: ${GameVariables.health} / ${GameVariables.maxHealth} 
    <img src="heart.jpg" alt="Heart" />
  `;
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function updateRunButton() {
  if (!GameVariables.CanRun) {
    document.getElementById('run').classList.add('runFalse');
  } else {
    document.getElementById('run').classList.remove('runFalse');
  }
}
function rankToName(rank) {
  const rankMap = {
    14: 'Ace',
    13: 'King',
    12: 'Queen',
    11: 'Jack'
  };
  return rankMap[rank] || rank.toString();
}
const cards = [
  // 2–10 of all suits
  '2 club', '2 diamond', '2 spade', '2 heart',
  '3 club', '3 diamond', '3 spade', '3 heart',
  '4 club', '4 diamond', '4 spade', '4 heart',
  '5 club', '5 diamond', '5 spade', '5 heart',
  '6 club', '6 diamond', '6 spade', '6 heart',
  '7 club', '7 diamond', '7 spade', '7 heart',
  '8 club', '8 diamond', '8 spade', '8 heart',
  '9 club', '9 diamond', '9 spade', '9 heart',
  '10 club', '10 diamond', '10 spade', '10 heart',

  // Face cards (only club and spade)
  'Jack club', 'Jack spade',
  'Queen club', 'Queen spade',
  'King club', 'King spade',
  'Ace club', 'Ace spade'
];
function shuffle(deck) {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
}
const shuffledCards = shuffle(cards);
// Convert card string to image filename with plural suits
function cardToFilename(card) {
  const [rank, suit] = card.split(' ');
  const rankMap = {
    'Ace': '1',
    'Jack': '11',
    'Queen': '12',
    'King': '13'
  };
  const rankNum = rankMap[rank] || rank;
  const suitPluralMap = {
    'club': 'clubs',
    'diamond': 'diamonds',
    'spade': 'spades',
    'heart': 'hearts'
  };
  const suitPlural = suitPluralMap[suit.toLowerCase()] || suit.toLowerCase();
  return `card-${suitPlural}-${rankNum}.png`;
}
function displayRoomCards() {
  const container = document.getElementById('room-cards');
  container.innerHTML = ''; // Clear old cards

  room.forEach(card => {
    const img = document.createElement('img');
    img.src = `PlayingCards/${cardToFilename(card)}`;  // Folder name with space
    img.alt = card;
    img.addEventListener('click', () => {
      const [rank, suit] = card.split(' ');
      UseCard(rank, suit);
    });
    container.appendChild(img);
  });
}

var GameVariables = {
  health: 20,
  maxHealth: 20,
  weapon: 'none',
  taint: 'none',
  CanRun: true,
  isfilling: false
}
async function Run() {
  if (GameVariables.CanRun && !GameVariables.isfilling) {
    GameVariables.CanRun = false;
    for (let i = room.length - 1; i >= 0; i--) {
      shuffledCards.unshift(room[i]);
    }
    room.length = 0;
    displayRoomCards();

  updateRunButton();
  if (room.length <= 1) {
  GameVariables.isfilling = true;
  while (room.length < 4) {
      await sleep(200);
      room.push(shuffledCards.pop());
      displayRoomCards()
    }
  }
  GameVariables.isfilling = false;
}
}
async function Turn() {
  if (room.length <= 1 && !GameVariables.isfilling) {
    GameVariables.isfilling = true;
    while (room.length < 4) {
      GameVariables.CanRun = true;
      await sleep(200);
      room.push(shuffledCards.pop());
      displayRoomCards()
    }
    GameVariables.isfilling = false;
  }
}
function UseCard(rank, suit) {
  if (GameVariables.isfilling) {
    console.log("Wait for room to finish filling!");
    return;
  }
  const rankValueMap = {
    'Ace': 14,
    'Jack': 11,
    'Queen': 12,
    'King': 13
  };
  rank = rankValueMap[rank] || parseInt(rank) || 0;
  if (suit === 'heart') {
    GameVariables.health = Math.min(GameVariables.health + rank, GameVariables.maxHealth);
    updateHealthDisplay();
  } else if (suit === 'diamond') {
    // ask if player wants to replace weapon; if they have one
    if (GameVariables.weapon !== 'none') {
      const replace = confirm(`Replace weapon ${GameVariables.weapon} with ${rank}?`);
      if (replace) {
        GameVariables.weapon = rank;
        GameVariables.taint = 'none';
        console.log(`Replacing weapon: ${rank}`);
      }
      else {
        console.log(`Keeping weapon: ${GameVariables.weapon}`);
        return
      }
      }
    else {
      GameVariables.weapon = rank;
      console.log(`Using card: ${rank} of ${suit}`);
  }} else if (suit === 'spade' || suit === 'club') {
    const fight = confirm(`Fight Enemy?\nEnemy rank: ${rank}`); //ask if player wants to fight
    if (fight) {
      if (GameVariables.weapon !== "none" && (GameVariables.taint === "none" || GameVariables.taint > rank)) {
        const useWeapon = confirm(`Use weapon ${GameVariables.weapon} of diamonds?`); //ask if player wants to use weapon
        if (useWeapon) {
          GameVariables.taint = rank;
          const damage = Math.max(rank - GameVariables.weapon, 0);
          GameVariables.health = Math.max(GameVariables.health - damage, 0);
          updateWeaponDisplay()
          if (GameVariables.health <= 0) {
            death()
            return;
          }
          updateHealthDisplay()
        }
        else {
          GameVariables.health = GameVariables.health - rank;
          if (GameVariables.health <= 0) {
            death()
            return;
            }
          updateHealthDisplay()
          }
        }
      else {
        GameVariables.health = GameVariables.health - rank;
        if (GameVariables.health <= 0) {
          death()
          return;
          }
        updateHealthDisplay()
        }
      }
    else {
      return;
      }
}
  console.log(`taint: ${GameVariables.taint}`);
  const cardString = `${rankToName(rank)} ${suit}`;
  const index = room.indexOf(cardString);
  if (index !== -1) {
  room.splice(index, 1);
  displayRoomCards();
  }
  updateWeaponDisplay();
}
async function gameLoop() {
  while (room.length > 0 || shuffledCards.length > 0) {
    await Turn();
    updateRunButton()
    await sleep(20);
  }
  if (room.length === 0 && shuffledCards.length === 0) {
    alert('Game Over! No more cards left.');
    GameVariables.health = 20;
    GameVariables.weapon = 'none';
    GameVariables.taint = 'none';
    GameVariables.CanRun = true;
    GameVariables.isfilling = false;
    room.length = 0;
    shuffledCards.length = 0;
    shuffledCards.push(...shuffle(cards));
    await waitUntilDeckIsReady();
  }
}
updateWeaponDisplay();
gameLoop();
updateHealthDisplay();
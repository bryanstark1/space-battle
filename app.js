
// ==============
// =====SHIPS====
// ==============

// HERO SHIP
const hero = {
    name: 'Hero Ship',
    hull: 4,
    firepower: 5,
    accuracy: .7,
    missiles: 3
  };


// ENEMY SHIPS
// Function to randomize alien ship stats
// https://www.w3schools.com/js/js_random.asp
const randomStat = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Single Alien Ship for testing
const alienShip1 = {
  name: 'Alien Ship',
  hull: 6,
  firepower: 4,
  accuracy: .8
}

// Alien ship constructor
// https://www.youtube.com/watch?v=DaUFyK8M4WY
class alienShip {
  constructor(num) {
  this.name = `Alien Ship ${num}`
  this.hull = randomStat(3, 6);
  this.firepower = randomStat(2, 4);
  this.accuracy = parseFloat(`.${randomStat(6, 8)}`);
  };
};

// Function to construct a random number of alien ships (between 5-10) and add them to the shipArr
let shipNum = 1;
const constructShips = () => {
  for (let i = 0; i < Math.floor(Math.random() * 6) + 5; i++) {
    let newShipObject = `alienShip${shipArr.length + 1}`;
    newShipObject = new alienShip(shipNum);
    shipArr.push(newShipObject);
    // Add icon to enemy container
    const $enemyImg = $('<img>').attr({'src': '/files/enemy.png', 'class': 'ship-icon'});
    $('#enemy-container').append($enemyImg);
    shipNum += 1;
  };
};

// Enemy ship array
let shipArr = [];
// Dead ship array
let graveyard = [];




// =========================
// =====GLOBAL VARIABLES====
// =========================

// GAME STATS
// Defeated Count
let defeatedCount = 0;
// Hit Count
let hitCount = 0;
// Miss Count
let missCount = 0;
// Damage Count
let totalDmg = 0;
// Missiles Used Count
let missileUsedCount = 0;
// Alien Hit Count
let totalAlienHits = 0;
// Alien Damage Count
let totalAlienDmg = 0;




// ==================
// =====FUNCTIONS====
// ==================

// Function to START game
const startGame = () => {
  // Fill in Hero stats
  $('#hero .health .stat-value').text(hero.hull);
  $('#hero .firepower .stat-value').text(hero.firepower);
  $('#hero .accuracy .stat-value').text(hero.accuracy);
  $('#hero .missiles .stat-value').text(hero.missiles);
  // Create Hero icon and move to icon container
  const $heroImg = $('<img>').attr({'src': '/files/hero.png', 'class': 'ship-icon'});
  $('#hero .icon-container').append($heroImg);
  // Generate fleet of Enemy ships
  constructShips();
  $('#enemy-container').css('display', 'flex')
  // Show/hide applicable buttons
  $('#start').css('display', 'none');
  $('#commence').css('display', 'flex');
  $('#reset').css('display', 'flex');
};



// Function to CLEAR finished battle
const clearBattle = () => {
  shipArr.shift();
  // Remove dead Enemy from icon container, replace with explosion
  $('#enemy .icon-container').empty();
  $('#enemy .icon-container').append($('<img>').attr('src', '/files/explosion.png').css('height', '100%'));
  // Clear Enemy stats
  enemyStatsClear();
  // Hide applicable buttons
  $('#attack').css('display', 'none');
  $('#missile').css('display', 'none');
};



// Function to SETUP next battle
const setupBattle = () => {
  // Show applicable buttons
  $('#retreat').css('display', 'flex');
  $('#commence').css('display', 'flex');
};



// Function to COMMENCE war
const commenceWar = () => {
  // Hide Commence button
  $('#commence').css('display', 'none');
  $('#retreat').css('display', 'none');
  // Fill in next Enemy stats
  enemyStatsFill();
  // Move next Enemy from enemy container to icon container
  $('#enemy .icon-container').append($('#enemy-container').children().eq(0));
  // Show applicable buttons
  $('#attack').css('display', 'flex');
  $('#missile').css('display', 'flex');
};

// Function to ATTACK
const attack = (attShip, defShip) => {
  // On successful hit
  if (Math.random() <= attShip.accuracy) {
    defShip.hull -= attShip.firepower;
    // Create laser icon
    const $shot = $('<img>').attr('src', '/files/laser.png').css('width', '40px')
    // Remove laser icon from screen
    setTimeout(() => {
      $('#viewport').children().eq(0).remove();
    }, 1000);
    // If defShip is Hero
    if (defShip === hero) {
      // Display laser on screen
      $('#viewport').append($shot.css('transform', 'rotate(90deg)'));
      // Update Hero health on screen
      $('#hero .health .stat-value').text(defShip.hull);
      if (defShip.hull <= 0) {
        // Remove Hero icon from icon container
        $('#hero .icon-container').children().eq(0).remove();
        // Add explosion icon to icon container
        $('#hero .icon-container').append($('<img>').attr('src', '/files/explosion.png').css('height', '100%'));
        setTimeout(() => {
          $('#hero .icon-container').children().eq(0).remove();
          endGame();
        }, 2000);
      };
    // If defShip is Enemy
    } else {
      // Display laser on screen
      $('#viewport').append($shot.css('transform', 'rotate(270deg)'))
      // Remove shot image from screen
      setTimeout(() => {
        $('#viewport').children().eq(0).remove();
      }, 1000);
      // Update Enemy health on screen
      $('#enemy .health .stat-value').text(defShip.hull);
    };
  } else {
    console.log(`${attShip.name} missed!`);
  };
};

// Function to fire MISSILE
const fireMissile = () => {
  // Create missile icon
  const $missile = $('<img>').attr('src', '/files/missile.png').css({'width':'500px', 'height':'500px'})
  // Display missile on screen
  $('#viewport').append($missile.css('transform', 'rotate(270deg)'));
  // Remove missile image from screen
  setTimeout(() => {
    $('#viewport').children().eq(0).remove();
  }, 3000);
  shipArr[0].hull = 0;
  $('#enemy .health .stat-value').text(shipArr[0].hull);
  hero.missiles -= 1;
  $('#hero .missiles .stat-value').text(hero.missiles);
  missileUsedCount++;
};


// Function to RESET game
const resetGame = () => {
  shipArr = [];
  graveyard = [];
  hero.hull = 20;
  hero.firepower = 5;
  hero.missiles = 3;
  $('.stat-container .stat-value').text('-');
  $('.icon-container').empty();
  $('#enemy-container').empty();
  $('button').css('display', 'none');
  // prop() should be used instead of attr() when setting properties (vs attributes)
  // https://stackoverflow.com/questions/13626517/how-to-remove-disabled-attribute-using-jquery
  $('#missile').prop('disabled', false);
  $('#start').css('display', 'flex');
  defeatedCount = 0;
  hitCount = 0;
  missCount = 0;
  totalDmg = 0;
  missileUsedCount = 0;
  totalAlienHits = 0;
  totalAlienDmg = 0;
  stopGame = true;
};

// Function to END game
const endGame = () => {
  console.log('Game Over!')
  $('#start').css('display', 'none');
  $('#commence').css('display', 'none');
  $('#attack').css('display', 'none');
  $('#missile').css('display', 'none');
  $('#retreat').css('display', 'none');
  $('#reset').css('display', 'flex');
};


// Function to fill in Enemy stats
const enemyStatsFill = () => {
  $('#enemy .health .stat-value').text(shipArr[0].hull);
  $('#enemy .firepower .stat-value').text(shipArr[0].firepower);
  $('#enemy .accuracy .stat-value').text(shipArr[0].accuracy);
};


// Function to clear Enemy stats
const enemyStatsClear = () => {
  setTimeout(() => {
    $('#enemy .health .stat-value').text('-');
    $('#enemy .firepower .stat-value').text('-');
    $('#enemy .accuracy .stat-value').text('-');
    // Remove explosion
    $('#enemy .icon-container').children().eq(0).remove();
  }, 1000);
};

const enemyTurn = () => {
// If Enemy is still alive
  if (shipArr[0].hull > 0) {
    // Attack Hero
    attack(shipArr[0], hero);
  // Else if Enemy is dead
  } else {
    // Clear battle field
    clearBattle();
    // If there are Enemies left (shipArr still contains dead enemy at this point)
    if (shipArr.length > 1) {
      // Setup next battle
      setupBattle();
    // Else if there are no Enemies left
    } else {
      // Remove dead ship from enemy container
      $('#enemy-container').children().eq(0).remove();
      // Hide enemy container
      $('#enemy-container').css('display', 'none')
      // End the game
      endGame();
    };
  };
};


// ===============
// =====JQUERY====
// ===============
$(() => {

  // START BUTTON CLICK
  $('#start').on('click', () => {
    // Reset stopGame variable
    stopGame = false;
    // Invoke startGame function
    startGame();
  });


  // COMMENCE BUTTON CLICK
  $('#commence').on('click', () => {
    // Invoke commenceWar function
    commenceWar();
  });
  

  // ATTACK BUTTON CLICK
  $('#attack').on('click', () => {
    // Invoke attack function
    attack(hero, shipArr[0]);
    // Invoke enemyTurn function after 2 second delay
    setTimeout(() => {
      enemyTurn();
    }, 2000);
  });


  // MISSILE BUTTON CLICK
  $('#missile').on('click', () => {
    // Invoke fireMissile function
    fireMissile();
    // Disable missile button if no missiles left
    if (hero.missiles <= 0) {
      // prop() should be used instead of attr() when setting properties (vs attributes)
      // https://stackoverflow.com/questions/13626517/how-to-remove-disabled-attribute-using-jquery
      $('#missile').prop('disabled', true);
    };
    // Invoke enemyTurn function after 2 second delay
    setTimeout(() => {
      enemyTurn();
    }, 2000);
  });


  // RETREAT BUTTON CLICK
  $('#retreat').on('click', () => {
    // Update stopGame variable to true
    stopGame = true;
  });


  // RESET BUTTON CLICK
  $('#reset').on('click', () => {
    // Invoke resetGame function
    resetGame();
  });
  if (hero.hull <= 0) {
    endGame();
  };
});
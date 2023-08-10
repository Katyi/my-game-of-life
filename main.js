// let rows = 40;
// let cols = 20;
let cellSize = 10; // размер клетки

const area = document.querySelector('.game');
const canvas = document.querySelector('.game__area');
canvas.width = area.offsetWidth;
canvas.height = area.offsetHeight;
let cols = Math.round(area.offsetWidth / cellSize);
let rows = Math.round(area.offsetHeight / cellSize);

// console.log(cols, rows)


// define field for game
const grid = [];
for (let y = 0; y < cols; y++) {
  grid[y] = [];
  for (let x = 0; x < rows; x++) {
    grid[y][x] = false;
    // draw(y,x, 'yellow')
  }
};

let playing = false;
console.log(playing)

// define neighbors and make torus
const getNeighbors = (x, y, grid) => {
  let prevX = x - 1;
  if (prevX < 0) {
    prevX = grid[0].length - 1;
  }

  let nextX = x + 1;
  if (nextX === grid[0].length) {
    nextX = 0;
  }

  let prevY = y - 1;
  if (prevY < 0) {
    prevY = grid.length - 1;
  }

  let nextY = y + 1
  if (nextY === grid.length) {
    nextY = 0;
  }

  return [
    grid[prevY][prevX],
    grid[prevY][x],
    grid[prevY][nextX],
    grid[y][prevX],
    grid[y][nextX],
    grid[nextY][prevX],
    grid[nextY][x],
    grid[nextY][nextX],
  ]
};

// cheking rules of game
const getDeadOrAlive = (x, y, grid) => {
  const neighbors = getNeighbors(x, y, grid);
  const numberOfAliveNeighbors = neighbors.filter(Boolean).length;

  if (grid[y][x]) {
    if (numberOfAliveNeighbors < 2 || numberOfAliveNeighbors > 3) {
      return false
    }
    return true
  }

  if (numberOfAliveNeighbors === 3) {
    return true
  }
  return false
};

const drawField = grid => {
  const context = canvas.getContext('2d');
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      if (grid[y][x]) {
        context.fillStyle = 'red'
        context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
      } else {
        context.fillStyle = 'teal'
        context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
      }
    }
  }
};

let nextGrid = grid;

drawField(grid);

const step = () => {
  nextGrid = nextGrid.map((row, y) => row.map((_, x) => {
    return getDeadOrAlive(x, y, nextGrid);
  }))
  drawField(nextGrid)
};

let interval = null

const setupControlButtons = () => {
  //button to start 
  let startButton = document.getElementById("start");
  // startButton.onclick = startButtonHandler;
  startButton.addEventListener("click", startButtonHandler);

  //button to clear selection
  let clearButtton = document.getElementById("clear");
  // clearButtton.onclick = clearButttonHandler;
  clearButtton.addEventListener("click", clearButttonHandler);

  let randomButton = document.getElementById("random");
  // randomButton.onclick = randomButttonHandler;
  randomButton.addEventListener('click', randomButttonHandler);
};

const startButtonHandler = (e) => {
  if (playing) {
    console.log("Pause the game");
    playing = false;
    console.log(playing)
    // this.innerHTML = "continue";
    // e.target.innerHTML = 'continue';
    // clearTimeout(timer);
    clearInterval(interval);
  } else {
    console.log("continue the game");
    playing = true
    
    // this.innerHTML = "pause";
    // e.target.innerHTML = "pause";
    interval = setInterval(step, 80);
    // play();
  }
};


document.getElementById('glider').addEventListener('click', () => {
  nextGrid = grid
})


document.getElementById('step').addEventListener('click', step);


document.getElementById('start').addEventListener('click', () => {
  if (!playing) {
    interval = setInterval(step, 80);
    playing = true;
    console.log(playing)
  }
});


// if (playing === true) {
  document.getElementById('stop').addEventListener('click', () => {
    clearInterval(interval);
    playing = false;
    console.log(playing)
  });
// };




document.getElementById('reset').addEventListener('click', () => {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid[y][x] = false;
    }
  }

  nextGrid = grid;

  drawField(grid);
})

document.querySelector('#glider').addEventListener('click', () => {
  for (let y = 0; y < 100; y++) {
    for (let x = 0; x < 100; x++) {
      grid[y][x] = false
    }
  }

  grid[20][20] = true
  grid[20][21] = true
  grid[20][22] = true
  grid[19][22] = true
  grid[18][21] = true

  nextGrid = grid

  drawField(grid)
})

document.getElementById('random').addEventListener('click', () => {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid[y][x] = Math.random() * 100 > 65
    }
  }

  nextGrid = grid

  drawField(grid)
})

document.querySelector('.game__area').addEventListener('click', event => {
  const x = Math.floor(event.offsetX / cellSize)
  const y = Math.floor(event.offsetY / cellSize)
  // let x = Math.floor((e.pageX - e.currentTarget.offsetLeft) / cellSize);
  // let y = Math.floor((e.pageY - e.currentTarget.offsetTop) / cellSize);

  grid[y][x] = !grid[y][x]

  nextGrid = grid

  drawField(grid)
})

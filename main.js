let cellSize = 10;
const area = document.querySelector('.game');
const canvas = document.querySelector('.game__area');
canvas.width = area.offsetHeight;
canvas.height = area.offsetHeight;
let cols = Math.round(area.offsetHeight / cellSize);
let rows = Math.round(area.offsetHeight / cellSize);
let gridChanged = false;

// defining default field for game
let grid = [];
for (let y = 0; y < cols; y++) {
  grid[y] = [];
  for (let x = 0; x < rows; x++) {
    grid[y][x] = false;
  }
};

// defining new scale of filed
function handleSubmit() {
  grid=[];
  const sizeOfFiled = document.querySelector('input').value;
  let prevCols = cols;
  cols = sizeOfFiled;
  rows = sizeOfFiled;
  if (cols < prevCols) {
    cellSize = Math.round(area.offsetHeight / cols);
    // cols = Math.round(area.offsetHeight / cellSize);
    // rows = Math.round(area.offsetHeight / cellSize);
  }
   else if (cols > prevCols) {
    cellSize = Math.round(area.offsetHeight / cols);
    // cols = Math.round(area.offsetHeight / cellSize);
    // rows = Math.round(area.offsetHeight / cellSize);
  }
  for (let y = 0; y < cols; y++) {
    grid[y] = [];
    for (let x = 0; x < rows; x++) {
      grid[y][x] = false;
    }
  };
  drawField(grid);
  // console.log(grid);
};

let playing = false;

// defining neighbors and make torus
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
      if (grid.length !== 0 && grid[y][x]) {
        context.fillStyle = 'red'
        context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
      } else {
        context.fillStyle = 'teal'
        context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
      }
    }
  }
  //  console.log(grid);
};

let nextGrid = grid;
drawField(grid);

const step = () => {
  nextGrid = nextGrid.map((row, y) => row.map((_, x) => {
    currentState = grid[y][x];
    let nextState = getDeadOrAlive(x, y, nextGrid);
    // console.log('nexState '+nextState + ' currentState '+ currentState);
    if (nextState !== currentState){
      gridChanged = true;
    }
    return nextState;
  }))
  if (gridChanged){
    drawField(nextGrid);
    gridChanged = false;
  } else {
    console.log('игра остановилася');
    // clearInterval(interval)
    clearInterval(interval);
    playing=false;
  }
  

  grid = nextGrid;
};

let interval = null;
let timerInterval = null;

// button to show next step
document.getElementById('step').addEventListener('click', step);

// button to play game
document.getElementById('play').addEventListener('click', () => {
  if (!playing) {
    interval = setInterval(step, 80);
    playing = true;
  }
});

// button to pause game
document.getElementById('pause').addEventListener('click', () => {
  playing = false;
  clearInterval(interval);
});

// button to clear field
  document.getElementById('clear').addEventListener('click', () => {  
  playing = false;
  clearInterval(interval);
  clearInterval(timerInterval);
  document.getElementById("timer").innerHTML = '';
    
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid[y][x] = false;
    }
  }

  nextGrid = grid;

  drawField(grid);
});

// button to make random field
document.getElementById('random').addEventListener('click', () => {
  const todayInMilliseconds = Date.now();
  function timerRun () {
    const seconds = 'timer: ' + Math.floor((Date.now() - todayInMilliseconds) / 1000);
    document.getElementById("timer").innerHTML = seconds;
  };
    clearInterval(timerInterval);
    timerInterval = setInterval(timerRun, 1000);
     
  for (let y = 0; y < cols; y++) {
    for (let x = 0; x < rows; x++) {
      grid[y][x] = Math.random() * 100 > 65;
    }
  }
  
  nextGrid = grid;
  drawField(grid);
})

// button to draw one cell with mouse
document.querySelector('.game__area').addEventListener('click', (event) => {
  const x = Math.floor(event.offsetX / cellSize)
  const y = Math.floor(event.offsetY / cellSize)
  grid[y][x] = !grid[y][x]
   
  // if (canvas.getContext) {
  //   const ctx = canvas.getContext("2d");
  //   ctx.fillStyle = 'red';
  //   ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  // }
  drawField(grid);
  nextGrid = grid
});

// if (grid === nextGrid) {
  
// }

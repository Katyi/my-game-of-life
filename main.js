let rows = 40;
let cols = 20;
let cellSize = 20;
let isPlay = false;

const area = document.querySelector('.game');
const canvas = document.querySelector('.game__area');

canvas.width = area.offsetWidth;
canvas.height = area.offsetHeight;

let x = Math.round(area.offsetWidth / cellSize);
let y = Math.round(area.offsetHeight / cellSize);

console.log(x ,y)

let grid = new Array(x);
let nextGrid = new Array(x);

let playing = false;

let timer;
let reproductionTime = 100;

/* inicialize game */
const initialize = () => {
  // createTable();
  initializeGrids();
  resetGrids();
  setupControlButtons();
  canvas.addEventListener('click', cellClickHandler);
};

const initializeGrids = () => {
  for (let i = 0; i < x; i++) {
    grid[i] = new Array(y);
    nextGrid[i] = new Array(y);
  }
};



const randomGrids = () => {
  for (let i = 0; i < x; i++) {
    for (let j = 0; j < y; j++) {
      // grid[i][j] =  Math.floor(Math.random() * 2);
      grid[i][j] =  (Math.random() / Math.random()) > 0.3 ? 0 : 1;
      // console.log(grid)
    }
  }
  console.log(grid)
  console.log(x)
  console.log(y)
};

const resetGrids = () => {
  for (let i = 0; i < x; i++) {
    for (let j = 0; j < y; j++) {
      grid[i][j] = 0;
      nextGrid[i][j] = 0;
    }
  }
  // console.log(grid)
  // console.log(nextGrid)
};

const copyAndResetGrid = () => {
  for (let i = 0; i < x; i++) {
    for (let j = 0; j < y; j++) {
      grid[i][j] = nextGrid[i][j];
      nextGrid[i][j]=0;
    }
  }
};

/* lay out your board */
const createTable = () => {
  // let gridContainer = document.getElementById("gridContainer");
  // if (!gridContainer) {
  //   console.error("Problem: no div for the grid table!");
  // }

  
  let table = document.createElement("table");

  for (let i = 0; i < rows; i++) {
    let tr = document.createElement("tr");
    for (let j = 0; j < cols; j++) {
      let cell = document.createElement("td");
      cell.style.width =`${x}px`;
      cell.style.height =`${y}px`;

      // cell.setAttribute("style.height", y);
      // cell.setAttribute("style.width", x);
      cell.setAttribute("id", i + "_" + j);
      cell.setAttribute("class", "dead");
      cell.addEventListener("click", cellClickHandler);
      tr.appendChild(cell);
    }
    table.appendChild(tr);
  }
  // gridContainer.appendChild(table);
  
};
/* drow with mouse */
const draw = (x, y, color) => {
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = `${color}`;
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  }
};

const cellClickHandler = (e) => {
  let x = Math.floor((e.pageX - e.currentTarget.offsetLeft) / cellSize);
  let y = Math.floor((e.pageY - e.currentTarget.offsetTop) / cellSize);
  console.log(x)
  console.log(y)
  // this.stop();
  // e.area[y][x] = !e.area[y][x];
  draw(x, y, "red");
};

const updateView = () => {
  for (let i = 0; i < x; i++) {
    for (let j = 0; j < y; j++) {
      if (grid[i][j] ===  1) {
        draw(i, j, 'red');
      } else {
        draw(i, j, "teal");
      }
    }
  }
};

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

const randomButttonHandler = () => {
  console.log("random game");
  randomGrids();
  updateView();
};

const startButtonHandler = (e) => {
  if (playing) {
    console.log("Pause the game");
    playing = false;
    // this.innerHTML = "continue";
    e.target.innerHTML = 'continue';
    clearTimeout(timer);
  } else {
    console.log("continue the game");
    playing = true
    // this.innerHTML = "pause";
    e.target.innerHTML = "pause";
    play();
  }
};

const clearButttonHandler = () => {
  console.log("Clear the game: stop playing, clear the grid");
  playing = false;
  let startButton = document.getElementById("start");
  startButton.innerHTML = "start";

  clearTimeout(timer);
  for (let i = 0; i < x; i++) {
    for (let j = 0; j < y; j++) {
      draw(i,j,'teal');
    }
    
  }
  resetGrids();
};

const play = () => {
  console.log("Play the game");
  computeNextGen();

  if (playing) {
    timer = setTimeout(play, reproductionTime);
  }
};


/* run next life game */
const computeNextGen = () => {
  for (let i = 0; i < x; i++) {
    for (let j = 0; j < y; j++){
      applyRules(i,j);
      console.log(i,j)
    }
  }
  //copy nextGrid to grid, and reset nextGrid
  copyAndResetGrid();
  //copy all 1 value to "live" in the table
  updateView();
};

/* cheking rules of game */
const applyRules = (row, col) => {
  let numNeighbors = countNeighbors(row, col);
  if (grid[row][col] == 1) {
    if (numNeighbors < 2) {
      nextGrid[row][col] = 0;
    } else if (numNeighbors == 2 || numNeighbors == 3) {
      nextGrid[row][col] = 1;
    } else if (numNeighbors > 3) {
      nextGrid[row][col] = 0;
    }
  } else if (grid[row][col] == 0) {
    if (numNeighbors == 3) {
      nextGrid[row][col] = 1;
    }
  }
};

const countNeighbors = (row, col) => {
  let count = 0;
  if (row-1>=0) {
    if (grid[row-1][col] == 1) count++;
  }
  if (row-1 >=0 && col-1 >=0) {
    if (grid[row-1][col-1] == 1) count++;
  }
  if (row-1 >=0 && col+1 < cols) {
    if(grid[row-1][col+1] == 1) count++;
  }
  if (col-1>=0) {
    if (grid[row][col-1] == 1) count++;
  }
  if (col+1 < cols) {
    if (grid[row][col+1] == 1) count++;
  }
  if (row+1 < rows) {
    if (grid[row+1][col] == 1) count++;
  }
  if (row+1 < rows && col-1>=0) {
    if (grid[row+1][col-1] == 1) count++;
  }
  if (row+1 < rows && col+1<cols) {
    if (grid[row+1][col+1]==1) count++;
  }
  console.log(count)
  return count;
}

/* let's start game */
window.onload = initialize;
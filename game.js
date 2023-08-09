let rows = 70;
let cols = 70;

const area = document.getElementById('gridContainer');
let width = 1200;
let height = 700;
console.log(width);
console.log(height);
const x = Math.round(width / cols);
const y = Math.round(height / rows);
console.log(x);
console.log(y);

let playing = false;
let grid = new Array(rows);
let nextGrid = new Array(rows);

let timer;
let reproductionTime = 100;

/* inicialize game */
const initialize = () => {
  createTable();
  initializeGrids();
  
  resetGrids();
  setupControlButtons();
};

const initializeGrids = () => {
  for (let i = 0; i < rows; i++) {
    grid[i] = new Array(cols);
    nextGrid[i] = new Array(cols);
  }
};

const randomGrids = () => {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] =  Math.floor(Math.random() * 2);
    }
  }
};

const resetGrids = () => {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = 0;
      nextGrid[i][j] = 0;
    }
  }
};

const copyAndResetGrid = () => {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = nextGrid[i][j];
      nextGrid[i][j]=0;
    }
  }
};

/* lay out your board */
const createTable = () => {
  let gridContainer = document.getElementById("gridContainer");
  if (!gridContainer) {
    console.error("Problem: no div for the grid table!");
  }

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
  gridContainer.appendChild(table);
  
};

const cellClickHandler = (e) => {
  let rowcol = e.target.id.split("_");
  let row = rowcol[0];
  let col = rowcol[1];

  let classes = e.target.getAttribute("class");
  if (classes.indexOf("live") >- 1) {
    e.target.setAttribute("class", "dead");
    grid[row][col] = 0;     
  } else {
    e.target.setAttribute("class", "live");
    grid[row][col] = 1;
  }
  console.log("click")
};

const updateView = () => {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let cell = document.getElementById(i+"_"+j);
      if (grid[i][j] ==  0) {
        cell.setAttribute("class", "dead"); 
      } else {
        cell.setAttribute("class", "live");
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

  let cellslist = document.getElementsByClassName("live");
  let cells = [];

  for (let i = 0 ; i < cellslist.length; i++) {
    cells.push(cellslist[i]);    
  }

  for (i = 0; i < cells.length; i++) {
    cells[i].setAttribute("class", "dead");
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
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++){
      applyRules(i,j);
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
  return count;
}

/* let's start game */
window.onload = initialize;
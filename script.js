const grid = document.querySelector('.grid');
const scoreDisplay = document.getElementById('score');
const width = 8;
const squares = [];
const candyImages = [
  'red.jpeg',    // Image for red
  'yellow.jpeg', // Image for yellow
  'orange.jpeg', // Image for orange
  'purple.jpeg', // Image for purple
  'green.jpeg',  // Image for green
  'blue.jpeg'    // Image for blue
];
let score = 0;

// Create the grid
function createBoard() {
  for (let i = 0; i < width * width; i++) {
    const square = document.createElement('div');
    const randomImage = candyImages[Math.floor(Math.random() * candyImages.length)];
    square.style.backgroundImage = `url(${randomImage})`;
    square.setAttribute('draggable', true);
    square.setAttribute('id', i);
    grid.appendChild(square);
    squares.push(square);
  }
}
createBoard();

let imageBeingDragged;
let imageBeingReplaced;
let squareIdBeingDragged;
let squareIdBeingReplaced;

// Dragging functionality
squares.forEach(square => {
  square.addEventListener('dragstart', dragStart);
  square.addEventListener('dragend', dragEnd);
  square.addEventListener('dragover', dragOver);
  square.addEventListener('dragenter', dragEnter);
  square.addEventListener('dragleave', dragLeave);
  square.addEventListener('drop', dragDrop);
});

function dragStart() {
  imageBeingDragged = this.style.backgroundImage;
  squareIdBeingDragged = parseInt(this.id);
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
}

function dragLeave() {
  this.style.backgroundImage = '';
}

function dragDrop() {
  imageBeingReplaced = this.style.backgroundImage;
  squareIdBeingReplaced = parseInt(this.id);
  this.style.backgroundImage = imageBeingDragged;
  squares[squareIdBeingDragged].style.backgroundImage = imageBeingReplaced;
}

function dragEnd() {
  let validMoves = [
    squareIdBeingDragged - 1,
    squareIdBeingDragged + 1,
    squareIdBeingDragged - width,
    squareIdBeingDragged + width
  ];

  let validMove = validMoves.includes(squareIdBeingReplaced);

  if (squareIdBeingReplaced && validMove) {
    squareIdBeingReplaced = null;
  } else if (squareIdBeingReplaced && !validMove) {
    squares[squareIdBeingReplaced].style.backgroundImage = imageBeingReplaced;
    squares[squareIdBeingDragged].style.backgroundImage = imageBeingDragged;
  } else {
    squares[squareIdBeingDragged].style.backgroundImage = imageBeingDragged;
  }
}

// Check for matches
function checkRowForThree() {
  for (let i = 0; i < width * width; i++) {
    let rowOfThree = [i, i + 1, i + 2];
    let decidedImage = squares[i].style.backgroundImage;
    const isBlank = decidedImage === '';

    if (rowOfThree.every(index => squares[index]?.style.backgroundImage === decidedImage && !isBlank)) {
      score += 3;
      scoreDisplay.textContent = score;
      rowOfThree.forEach(index => squares[index].style.backgroundImage = '');
    }
  }
}

function checkColumnForThree() {
  for (let i = 0; i < width * (width - 2); i++) {
    let columnOfThree = [i, i + width, i + width * 2];
    let decidedImage = squares[i].style.backgroundImage;
    const isBlank = decidedImage === '';

    if (columnOfThree.every(index => squares[index]?.style.backgroundImage === decidedImage && !isBlank)) {
      score += 3;
      scoreDisplay.textContent = score;
      columnOfThree.forEach(index => squares[index].style.backgroundImage = '');
    }
  }
}

function moveDown() {
  for (let i = 0; i < width * (width - 1); i++) {
    if (squares[i + width].style.backgroundImage === '') {
      squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
      squares[i].style.backgroundImage = '';
    }
  }
  for (let i = 0; i < width; i++) {
    if (squares[i].style.backgroundImage === '') {
      squares[i].style.backgroundImage = `url(${candyImages[Math.floor(Math.random() * candyImages.length)]})`;
    }
  }
}

// Game loop
window.setInterval(() => {
  moveDown();
  checkRowForThree();
  checkColumnForThree();
}, 100);

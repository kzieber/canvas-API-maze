const { Engine, Render, Runner, World, Bodies } = Matter;

const width = 600;
const height = 600;
const cells = 3;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: true,
    width,
    height,
  },
});

Render.run(render);
Runner.run(Runner.create(), engine);

//Walls
const walls = [
  Bodies.rectangle(width / 2, 0, width, 40, {
    isStatic: true,
  }),
  Bodies.rectangle(width / 2, height, width, 40, {
    isStatic: true,
  }),
  Bodies.rectangle(0, height / 2, 40, height, {
    isStatic: true,
  }),
  Bodies.rectangle(width, height / 2, 40, height, {
    isStatic: true,
  }),
];

World.add(world, walls);

// Maze Generation

const shuffleArray = (arr) => {
  let counter = arr.length;
  while (counter > 0) {
    const idx = Math.floor(Math.random() * counter);
    counter--;
    const temp = arr[counter];
    arr[counter] = arr[idx];
    arr[idx] = temp;
  }
  return arr;
};

const grid = Array(cells)
  .fill(null)
  .map(() => Array(cells).fill(false));

const verticals = Array(cells)
  .fill(null)
  .map(() => Array(cells - 1).fill(false));

const horizontals = Array(cells - 1)
  .fill(null)
  .map(() => Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

const stepThroughCell = (row, column) => {
  //If I have visited the cell at [row, column], then return
  if (grid[row][column] === true) return;

  //else, mark the cell being visited as true
  grid[row][column] = true;

  //Assemble randomly-ordered list of neighbors
  const neighbors = shuffleArray([
    [row - 1, column],
    [row, column + 1],
    [row + 1, column],
    [row, column - 1],
  ]);
  //For each neighbor...
  //Check to see if that neighbor is out of bounds
  //If we have visited that neighbor, continue to next neighbor
  //Remove a wall from either the horizontals or verticals
  //Visit that next cell
};

stepThroughCell(1, 1);

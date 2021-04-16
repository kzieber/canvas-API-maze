const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

// Maze dimensions and config vars
const width = 600;
const height = 600;
const cells = 3;
const unitLength = width / cells;

const engine = Engine.create();
//gravity disabled on the Y axis
engine.world.gravity.y = 0;
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

// Maze Walls
const walls = [
  Bodies.rectangle(width / 2, 0, width, 4, {
    isStatic: true,
  }),
  Bodies.rectangle(width / 2, height, width, 4, {
    isStatic: true,
  }),
  Bodies.rectangle(0, height / 2, 4, height, {
    isStatic: true,
  }),
  Bodies.rectangle(width, height / 2, 4, height, {
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
    [row - 1, column, 'up'],
    [row, column + 1, 'right'],
    [row + 1, column, 'down'],
    [row, column - 1, 'left'],
  ]);

  //For each neighbor...
  for (let neighbor of neighbors) {
    //array destructuring
    const [nextRow, nextColumn, direction] = neighbor;
    //Check to see if that neighbor is out of bounds
    if (
      nextRow < 0 ||
      nextRow >= cells ||
      nextColumn < 0 ||
      nextColumn >= cells
    ) {
      //If we have visited that neighbor, continue to next neighbor
      continue;
    }
    if (grid[nextRow][nextColumn]) continue;

    //Remove a wall from either the horizontals or verticals
    switch (direction) {
      case 'left':
        verticals[row][column - 1] = true;
        break;
      case 'right':
        verticals[row][column] = true;
        break;
      case 'up':
        horizontals[row - 1][column] = true;
        break;
      case 'down':
        horizontals[row][column] = true;
        break;
    }

    //Visit that next cell
    stepThroughCell(nextRow, nextColumn);
  }
};

stepThroughCell(startRow, startColumn);

//Draw walls of maze
horizontals.forEach((row, rowIdx) => {
  row.forEach((open, columnIdx) => {
    if (open) return;

    const wall = Bodies.rectangle(
      columnIdx * unitLength + unitLength / 2,
      rowIdx * unitLength + unitLength,
      unitLength,
      10,
      {
        label: 'wall',
        isStatic: true,
      }
    );

    World.add(world, wall);
  });
});

verticals.forEach((row, rowIdx) => {
  row.forEach((open, columnIdx) => {
    if (open) return;

    const wall = Bodies.rectangle(
      columnIdx * unitLength + unitLength,
      rowIdx * unitLength + unitLength / 2,
      10,
      unitLength,
      {
        label: 'wall',
        isStatic: true,
      }
    );
    World.add(world, wall);
  });
});

// Finishing Point of the Maze
const goal = Bodies.rectangle(
  width - unitLength / 2,
  height - unitLength / 2,
  unitLength * 0.7,
  unitLength * 0.7,
  {
    label: 'goal',
    isStatic: true,
  }
);
World.add(world, goal);

// Ball config
const ball = Bodies.circle(unitLength / 2, unitLength / 2, unitLength / 4, {
  label: 'player ball',
});
World.add(world, ball);

document.addEventListener('keydown', (evt) => {
  const { x, y } = ball.velocity;

  switch (evt.keyCode) {
    case 87:
      //move ball up
      Body.setVelocity(ball, { x, y: y - 5 });
      break;
    case 68:
      //move ball right
      Body.setVelocity(ball, { x: x + 5, y });
      break;
    case 83:
      // move ball down
      Body.setVelocity(ball, { x, y: y + 5 });
      break;
    case 65:
      // move ball left
      Body.setVelocity(ball, { x: x - 5, y });
      break;
  }
});

// Win condition:

Events.on(engine, 'collisionStart', (evt) => {
  evt.pairs.forEach((collision) => {
    const labels = ['player ball', 'goal'];

    if (
      labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)
    ) {
      world.gravity.y = 1;
      world.bodies.forEach((body) => {
        if (body.label === 'wall') {
          Body.setStatic(body, false);
        }
      });
    }
  });
});

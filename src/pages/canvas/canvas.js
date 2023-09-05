const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const canvasContainer = document.getElementById('canvas-container');
const imageUpload = document.getElementById('image-upload');
const undoButton = document.getElementById('undo-button');
const redoButton = document.getElementById('redo-button');
const saveButton = document.getElementById('save-button');
const loadButton = document.getElementById('load-button');
const MAX_POINTS = 4;
const paths = [];
const colors = ['#FF6633', '#FF33FF', '#FFFF99', '#00B3E6',
  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933'
];

let image;
let points = [];
let pointCount = 0;
let actualColor = 0;
let currentColor = colors[actualColor];

let undoStack = [];
let redoStack = [];

function drawSinglePoint (point) {
  ctx.beginPath();
  ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
  ctx.fillStyle = point.color;
  ctx.fill();
}

function drawPoints () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);

  for (const path of paths) {
    drawPathOutline(path.color, path.points);
  }

  for (const point of points) {
    drawSinglePoint(point);
  }
}

function drawPathOutline (color, path) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(path[path.length - 1].x, path[path.length - 1].y);

  for (const point of path) {
    ctx.lineTo(point.x, point.y);
  }

  ctx.closePath(); // Close the path to form a coherent contour
  ctx.stroke();
  ctx.lineWidth = 1;
}

function openFile (event) {
  const file = event.target.files[0];

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = () => {
      image = new Image();
      image.src = reader.result;
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.style.display = 'inline';
        // canvasContainer.style.display = 'none';
        ctx.drawImage(image, 0, 0);
      };
    };
    reader.readAsDataURL(file);
  }
}

function addPointListener (mouseEvent) {
  const x = mouseEvent.clientX - canvas.getBoundingClientRect().left;
  const y = mouseEvent.clientY - canvas.getBoundingClientRect().top;

  pointCount++;
  points.push({ x, y, color: currentColor });
  drawPoints();

  console.log(`Cord x: ${x}; Cord y: ${y}; Cor: ${currentColor}`);

  if (pointCount === MAX_POINTS) {
    organizePoints();
    createPath();
    pointCount = 0;
    currentColor = colors[++actualColor];
  }

  // Clear redo stack when adding new points
  redoStack = [];
}

function organizePoints () {
  // Sort points by angle to create a coherent contour
  const center = calculateCenter(points);
  points.sort((a, b) => {
    const angleA = Math.atan2(a.y - center.y, a.x - center.x);
    const angleB = Math.atan2(b.y - center.y, b.x - center.x);
    return angleA - angleB;
  });
}

function calculateCenter (points) {
  let centerX = 0;
  let centerY = 0;

  for (const point of points) {
    centerX += point.x;
    centerY += point.y;
  }

  return { x: centerX / points.length, y: centerY / points.length };
}

function createPath () {
  paths.push({ color: currentColor, points: [...points] });
  undoStack.push([...points]);
  points = [];
}

function undo () {
  if (undoStack.length > 0) {
    redoStack.push([...points]);
    points = undoStack.pop();
    paths.pop();
    drawPoints();
  }
}

function redo () {
  if (redoStack.length > 0) {
    undoStack.push([...points]);
    points = redoStack.pop();
    createPath();
    drawPoints();
  }
}

function savePoints () {
  const dataToSave = JSON.stringify(paths);

  const blob = new Blob([dataToSave], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'saved_points.json';
  a.click();

  URL.revokeObjectURL(url);
}

function loadPoints () {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.addEventListener('change', handleFileSelect);
  input.click();
}

function handleFileSelect (event) {
  const file = event.target.files[0];

  if (!file) return;

  if (!file.name.endsWith('.json')) {
    alert('Por favor, selecione um arquivo JSON válido.');
    return;
  }

  const reader = new FileReader();

  reader.onload = function (event) {
    const loadedData = event.target.result;
    try {
      const parsedData = JSON.parse(loadedData);

      // Clear existing points and paths
      points = [];
      paths.length = 0;

      for (const path of parsedData) {
        paths.push(path);
        for (const point of path.points) {
          points.push(point);
        }
      }

      drawPoints();
    } catch (error) {
      alert('O arquivo selecionado não é um JSON válido.');
    }
  };

  reader.readAsText(file);
}

imageUpload.addEventListener('change', openFile);
canvas.addEventListener('click', addPointListener);
undoButton.addEventListener('click', undo);
redoButton.addEventListener('click', redo);
saveButton.addEventListener('click', savePoints);
loadButton.addEventListener('click', loadPoints);

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageUpload = document.getElementById('imageUpload');
const MAX_POINTS = 4;

let image;
let paths = [];
let points = [];
let colorPointCount = 0;
let actualColor = 0;
let colors = ['#FF6633', '#FF33FF', '#FFFF99', '#00B3E6',
  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933'
];
let currentColor = colors[actualColor];

function drawSinglePoint(point) {
  ctx.beginPath();
  ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
  ctx.fillStyle = point.color;
  ctx.fill();
}

function drawPoints() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);

  for (const path of paths) {
    drawPathOutline(path.color, path.points);
  }

  for (const point of points) {
    drawSinglePoint(point);
  }
}

function drawPathOutline(color, path) {
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

function openFile(event) {
  const file = event.target.files[0];

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = () => {
      image = new Image();
      image.src = reader.result;
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
      };
    };
    reader.readAsDataURL(file);
  }
}

function addPointListener(mouseEvent) {
  const x = mouseEvent.clientX - canvas.getBoundingClientRect().left;
  const y = mouseEvent.clientY - canvas.getBoundingClientRect().top;

  colorPointCount++;
  points.push({ x, y, color: currentColor });
  drawPoints();

  console.log(`Cord x: ${x}; Cord y: ${y}; Cor: ${currentColor}`);

  if (colorPointCount === MAX_POINTS) {
    organizePoints();
    createPath();
    colorPointCount = 0;
  }
}

function organizePoints() {
  // Sort points by angle to create a coherent contour
  const center = calculateCenter(points);
  points.sort((a, b) => {
    const angleA = Math.atan2(a.y - center.y, a.x - center.x);
    const angleB = Math.atan2(b.y - center.y, b.x - center.x);
    return angleA - angleB;
  });
}

function calculateCenter(points) {
  let centerX = 0;
  let centerY = 0;

  for (const point of points) {
    centerX += point.x;
    centerY += point.y;
  }

  return { x: centerX / points.length, y: centerY / points.length };
}

function createPath() {
  paths.push({ color: currentColor, points: [...points] });
  points = [];
}

imageUpload.addEventListener('change', openFile);
canvas.addEventListener('click', addPointListener);

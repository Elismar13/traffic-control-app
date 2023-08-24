const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageUpload = document.getElementById('imageUpload');

const MAX_POINTS = 4;
let image;
let boxes = [];
let points = [];
let colorPointCount = 0;
let actualColor = 0;
let colors = ['#FF6633', '#FF33FF', '#FFFF99', '#00B3E6',
  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933'
];

function drawSinglePoint(point) {
  ctx.beginPath();
  ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
  ctx.fillStyle = point.color;
  ctx.fill();
}

function drawPoints() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);

  for (const point of points) {
    drawSinglePoint(point);
  }

  for(const box of boxes) {
    for (const point of box) {
      drawSinglePoint(point);
    }
  }
}

imageUpload.addEventListener('change', function (event) {
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
});

canvas.addEventListener('click', function (event) {
  if (colorPointCount >= MAX_POINTS) {
    if(actualColor >= colors.length)
      actualColor = 0;
    colorPointCount = 0;
    actualColor++;
    boxes.push(points);
    points = [];
  }

  const color = colors[actualColor];
  const x = event.clientX - canvas.getBoundingClientRect().left;
  const y = event.clientY - canvas.getBoundingClientRect().top;

  colorPointCount++;
  points.push({ x, y, color });
  drawPoints();

  console.log(`Cord x: ${x}; Cord y: ${y}; Cor: ${color}`);
});
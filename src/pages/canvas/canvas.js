const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageUpload = document.getElementById('imageUpload');

const MAX_POINTS = 4;
let image;
let boxes = [];
let points = [];
let colorPointCount = 0;
let colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933'
];
let actualColor = 0;

imageUpload.addEventListener('change', function (event) {
  const file = event.target.files[0];

  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function () {
      image = new Image();
      image.src = reader.result;
      image.onload = function () {
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
    colorPointCount = 0;
    actualColor++;
    boxes.push(points);
    points = [];
  }

  const color = colors[actualColor];
  const x = event.clientX - canvas.getBoundingClientRect().left;
  const y = event.clientY - canvas.getBoundingClientRect().top;

  points.push({ x, y, color });
  console.log(`Cord x: ${x}; Cord y: ${y}; Cor: ${color}`);
  drawPoints();
});

function drawPoints() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);

  for (const point of points) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = point.color;
    ctx.fill();
  }
}
const c = document.getElementById("particles");
if (!c) return;
const ctx = c.getContext("2d");
c.width = innerWidth;
c.height = innerHeight;

let p = Array.from({ length: 40 }, () => ({
  x: Math.random() * c.width,
  y: Math.random() * c.height,
  r: Math.random() * 2 + 1,
  dx: Math.random() - .5,
  dy: Math.random() - .5
}));

function draw() {
  ctx.clearRect(0,0,c.width,c.height);
  p.forEach(o => {
    o.x += o.dx;
    o.y += o.dy;
    ctx.beginPath();
    ctx.arc(o.x,o.y,o.r,0,Math.PI*2);
    ctx.fillStyle = "rgba(34,240,199,.5)";
    ctx.fill();
  });
  requestAnimationFrame(draw);
}
draw();

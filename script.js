const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("overlay");

let options = Array(9).fill("Buy").concat("Sell");
let angle = 0;
let spinning = true;

function drawWheel(items) {
  const num = items.length;
  const arc = (2 * Math.PI) / num;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  items.forEach((item, i) => {
    const startAngle = angle + i * arc;
    const endAngle = startAngle + arc;

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.arc(canvas.width / 2, canvas.height / 2, 240, startAngle, endAngle);
    ctx.fillStyle = item === "Sell" ? "#e74c3c" : "#27ae60";
    ctx.fill();

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(startAngle + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.font = "20px Segoe UI";
    ctx.fillText(item, 200, 10);
    ctx.restore();
  });
}

function spinWheel() {
  if (!spinning) return;

  let spinAngle = Math.random() * Math.PI * 6 + Math.PI * 4; // random spins
  let duration = 3000;
  let start = performance.now();

  function animate(time) {
    let progress = (time - start) / duration;
    if (progress < 1) {
      angle += spinAngle / (duration / 16);
      drawWheel(options);
      requestAnimationFrame(animate);
    } else {
      // Normalize angle
      angle %= 2 * Math.PI;

      // Determine result
      let arc = (2 * Math.PI) / options.length;
      let index = Math.floor(((2 * Math.PI - angle + Math.PI / 2) % (2 * Math.PI)) / arc);
      let result = options[index];

      if (result === "Sell") {
        spinning = false;
        overlay.classList.add("show");
      } else {
        // Remove one Buy
        const idx = options.indexOf("Buy");
        if (idx !== -1) options.splice(idx, 1);

        if (options.length <= 1) {
          spinning = false;
          overlay.classList.add("show");
          return;
        }

        setTimeout(spinWheel, 2000); // spin again
      }
    }
  }

  requestAnimationFrame(animate);
}

drawWheel(options);
setTimeout(spinWheel, 1000);

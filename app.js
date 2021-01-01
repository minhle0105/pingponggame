// create canvas
const cvs = document.getElementById('pong');
const ctx = cvs.getContext('2d');

// create user
const user = {
      x: 0,
      y: (cvs.height - 100)/2,
      width: 10,
      height: 100,
      color: "red",
      score: 0
}

// create computer player
const com = {
      x: cvs.width - 10,
      y: (cvs.height - 100)/2,
      width: 10,
      height: 100,
      color: "black",
      score: 0
}

// create ball
const ball = {
      x: cvs.width/2,
      y: cvs.height/2,
      radius: 10,
      speed: 7,
      velocityX: 5,
      velocityY: 5,
      color: "white"
}

// create net
const net = {
      x: cvs.width/2 - 1,
      y: 0,
      width: 2,
      height: 10,
      color: 'green'
}

// draw rectangle
function drawRect(x,y,w,h,color) {
      ctx.fillStyle = color;
      ctx.fillRect(x,y,w,h);
}

// draw circle
function drawCircle(x,y,r,color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x,y,r,0,Math.PI*2, true)
      ctx.closePath();
      ctx.fill();
}

// drawNet()
function drawNet() {
      for (let i = 0; i <= cvs.height; i+= 15) {
            drawRect(net.x, net.y + i, net.width, net.height, net.color);
      }
}

// draw text to show score
function drawText(text,x,y,color) {
      ctx.fillStyle = color;
      ctx.font = "45px fantasy";
      ctx.fillText(text,x,y);
}

// draw everything
function render() {
      drawRect(0,0,cvs.width, cvs.height, "lightblue");

      drawNet()

      drawText(user.score,cvs.width/4,cvs.height/5,'white');
      drawText(com.score,3*cvs.width/4,cvs.height/5,'white');

      drawRect(user.x, user.y, user.width, user.height, user.color);
      drawRect(com.x, com.y, com.width, com.height, com.color);

      drawCircle(ball.x, ball.y, ball.radius, ball.color)
}


cvs.addEventListener("mousemove", movePaddle);

// user to control the paddle
function movePaddle(evt) {
      // make sure that the mouse is in the middle of the player's paddle
      let rect = cvs.getBoundingClientRect();
      user.y = evt.clientY - rect.top - user.height/2;
}

// check when the ball touches the paddles
function collision(b,p) {
      b.top = b.y - b.radius;
      b.bottom = b.y + b.radius;
      b.left = b.x - b.radius;
      b.right = b.x + b.radius;

      p.top = p.y;
      p.bottom = p.y + p.height;
      p.left = p.x;
      p.right = p.x + p.width;

      // each time the ball hits the paddles, no matter whether it touches top, bottom, left or right, the function returns
      return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

// reset ball after each time a player scores
function resetBall() {
      ball.x = cvs.width/2;
      ball.y = cvs.height/2;

      ball.speed = 7;
      ball.velocityX = -ball.velocityX;

      let randomColor = ['red', 'orange', 'yellow', 'black', 'green', 'violet']
      let randomNum = Math.floor(Math.random()*randomColor.length-1)
      ball.color = randomColor[randomNum]
}

// update score
function update() {
      ball.x += ball.velocityX;
      ball.y += ball.velocityY;

      // make computer paddle to move by the position of the ball. since Computer level is 0.1, it can be beaten
      // when the ball speed is high. if it is 1, it is unbeatable
      let computerLevel = 0.1;
      com.y += (ball.y - (com.y + com.height/2)) * computerLevel;

      // if the ball touches the edges, then reverse the ball direction. "bound" effect
      if (ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0) {
            ball.velocityY = -ball.velocityY;
      }

      // see if the ball hit which players. if its position is less than cvs.width / 2, then it is
      // on the left, then it hits human player; else it hits computer player.
      let player = (ball.x < cvs.width/2) ? user:com;

      // each time the ball hits the paddle, then reverse the direction. "bound"
      if (collision(ball, player)) {
            let collidePoint = ball.y - (player.y + player.height/2);

            collidePoint = collidePoint/(player.height/2);

            let angleRad = collidePoint * (Math.PI/4);

            let direction = (ball.x + ball.radius < cvs.width /2) ? 1 : -1

            ball.velocityX = direction * ball.speed * Math.cos(angleRad);
            ball.velocityY = ball.speed * Math.sin(angleRad);

            ball.speed += 0.5;
      }

      // check if computer score
      if (ball.x - ball.radius < 0) {
            com.score++;
            resetBall();
      } 
      // check if human score
      else if (ball.x + ball.radius > cvs.width) {
            user.score++;
            resetBall();
      }

      // check if computer wins
      if (com.score == 5) {
            com.score = 0;
            user.score = 0;
            let choice = confirm("Game over. You lose. Play again?")
            if (choice) {
                  location.reload();
            }
            else {
                  window.close()
            }
      }
      // check if human wins
      else if (user.score == 5) {
            com.score = 0;
            user.score = 0;
            let choice = confirm("Game over. You win. Play again?")
            if (choice) {
                  location.reload();
            }
            else {
                  window.close()
            }
      }
}

// play game.
function game() {
      update();
      render();
}

// start game. this function is revoked by the start button. it calls the function game() 20 times per seconds, create
// the moving effect
function start() {
      const framePerSecond = 50;
      setInterval(game, 1000/framePerSecond)
}

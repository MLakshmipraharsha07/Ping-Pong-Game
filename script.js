const canvas = document.getElementById('pong');

const context = canvas.getContext('2d');

//Ball obj
const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: 10,
    velocityX: 5,
    velocityY: 5,
    speed: 7,
    color: 'white'
};

//user paddle
const user = {
    x: 0, //left side of the canvas
    y: (canvas.height - 100)/2, //-100 the height of the paddle
    width: 10,
    height: 100,
    color: 'white',
    score: 0
};

//com paddle
const comp = {
    x: canvas.width - 10, //right side of the canvas
    y: (canvas.height - 100)/2, //-100 the height of the paddle
    width: 10,
    height: 100,
    color: 'white',
    score: 0
};

//NET
const net = {
    x: (canvas.width - 2)/2,
    y: 0,
    height: 10,
    width: 2,
    color: 'white'
};

//listening to the mouse event
canvas.addEventListener('mousemove', function(event) {
    let rect = canvas.getBoundingClientRect();

    user.y = event.clientY - rect.top - user.height/2;
});


//to draw the paddles
function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

//draw the net
function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

//draw text
function drawText(text, x, y) {
    context.fillStyle = 'white';
    context.font = '75px fantasy';
    context.fillText(text, x, y);
}

//draw the ball
function drawArc(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();

}

//when comp or user scores, we need to reset the ball
function resetBall() {
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

//collision detection
function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return (p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top);
}

//does all the calculations
function update() {
    if (ball.x - ball.radius < 0) {
        comp.score++;
        resetBall();
    }else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        resetBall();
    }

    //the ball has a velocity
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    //simple AI - computer plays for itself and we must be able to beat it.
    comp.y += ((ball.y - (comp.y + comp.height/2))) * 0.1;

    //when the ball collides with the bottom or top wall, we need to inverse the velocityY
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
    }

    //we check if the paddle hit the user or comp paddle
    let player = (ball.x + ball.radius < canvas.width / 2) ? user : comp;

    if (collision(ball, player)) {
        //we need to check where the ball has hit (which paddle)

        let collidePoint = (ball.y - (player.y + player.height/2));

        //normalize the value of collidePoint, we need to get the number between -1 and 1
        //-player.height/2 < collide point < player.height/2
        collidePoint = collidePoint / (player.height/2);

        let anglerad = (Math.PI/4) * collidePoint;

        //change the X and Y velocity direction

        let direction =(ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(anglerad);
        ball.velocityY = ball.speed * Math.sin(anglerad);

        //speed up the ball every time a paddle hits it
        ball.speed += 0.1;
    }
}

//render the game board 
function render() {
    //clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, '#000');

    //user score to the left
    drawText(user.score, canvas.width/4, canvas.height/5);

    //com score to the right
    drawText(comp.score, 3*canvas.width/4, canvas.height/5);

    //draw the net
    drawNet();

    //draw the user paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);

    //draw the com paddle
    drawRect(comp.x, comp.y, comp.width, comp.height, comp.color);

    //draw the ball
    drawArc(ball.x, ball.y, ball.radius, ball.color);

}

function game() {
    // update the score - check for collision and see who won
    update();

    //to draw the game board
    render();


}

//number of frames per second
let framePerSecond = 50;

//call the game function 50 times every 1 second
let loop = setInterval(game, 1000/framePerSecond);
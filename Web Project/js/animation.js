// Holds the cannon ball
var cannonBall;
// Holds the target
var myTarget;
// Holds the game board
var boardArea;
// Canvas width and height
var canvasWidth = 600;
var canvasHeight = 450;
// The number of balls the player has
var ballCount;
// The score of the player
var score;
// Test if the ball is moving
var isMovingBall = false;
// Test if the target is hit
var isHitTarget = false;
// Holds the cannon
var cannon;
// Holds the angle of rotation
var angle = 0*Math.PI/180;
// Holds the background image
var background;
var explosion;

// When the document is called
$(document).ready(function(){
    // Whenever the game area is clicked, launch the ball
    $(boardArea).click(function(){
        // If the ball is not moving and the ballCount is > 0, launch the ball
        if(!isMovingBall && ballCount > 0){

            // Set the flag that the bal is Moving
            isMovingBall = true;
            // Decrement the ball count
            ballCount--;
            // Update the ball count text
            $("#ballCount").text(ballCount);
            // Set the cannon ball angle
            SetBallAngle(angle);
        }
        // If the target is hit and the ball count is greater than 0, reset the game board
        else if(isHitTarget && ballCount>0){
            gameArea.stop();
            ResetCannonBall();
            ResetTarget();
            GiveTargetSpeed();
            gameArea.interval = setInterval(FixedUpdate, 60);
        }
    });
    // When the mouse moves, rotate the cannon
    $(gameArea.canvas).mousemove(RotateCannon);
});

// To set up the game
function StartGame() {
    InitializeTextValues();
    // Grabs the parent div that will hold the nested canvas child. 
    boardArea = document.getElementById("myBoardArea");

    // Define the ingame Components
    background = new Component(canvasWidth, canvasHeight, 0, 0, "./img/animation/Background.png", false);
    cannonBall = new Component(20, 20, (canvasWidth/2)-10, canvasHeight-45, "./img/animation/CannonBall.png", false);
    myTarget  = new Component(90, 30, (canvasWidth/2)-45, 20, "./img/animation/Saucer.png", false);
    cannon  = new Component(60, 90, (canvasWidth/2 -30), canvasHeight-100, "./img/animation/Cannon.png", true);
    explosion = new Explosion(100, 100, myTarget.x, myTarget.y, "./img/animation/Explosion.png", 8, 2);
    // Start the game
    gameArea.awake();
}

// Define the game area
var gameArea = {
    // Create a new document element called canvas
    canvas : document.createElement("canvas"),

    // Make the canvas
    awake : function() {
    
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.context = this.canvas.getContext("2d");
        this.context.font = "30px arial";
        this.context.textAlign = "center";

        // Place as the first child of boardArea
        boardArea.insertBefore(this.canvas, boardArea.childNodes[0]);
        // Call FixedUpdate so the fram will be refreshed
        this.interval = setInterval(FixedUpdate, 60);
        // Make the target move
        GiveTargetSpeed();
    },
    // Clear the board
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    // Stop the game
    stop : function() {
    clearInterval(this.interval);
    }
};

//Game Component object
function Component(width, height, x, y, imgSrc, isRotator) {
    // Holds the initial X and Y intervals, width, height, speed, position(x,y), and image
    this.initialX = x;
    this.initialY = y;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;  
    this.x = x;
    this.y = y; 
    var img = new Image(); 
    img.src = imgSrc;

    // Draws the Component
    this.update = function() {
        // Grabs the game area
        ctx = gameArea.context;
        // If the object rotates, call this function
        if(isRotator){
            // Mark the pivot point of the rotation object
            var xOffset = width/-2;
            var yOffset = -70;
            // Save the game area
            ctx.save();
            // Position the game object on the main canvas
            ctx.translate(gameArea.canvas.width/2, gameArea.canvas.height-30);
            // If angle is greater than 90 degrees and less than 180 degress (in radians)
            if(angle>1.5708 && angle <3.14159){
                // Make the cannon face right
                angle = 1.5708;
            }
            // If the angle is greater than 270 degrees and greater than and equals to 180 degrees (in radians)
            else if(angle<4.71239 && angle>= 3.14159){
                // Make the cannon face left
                angle = 4.71239;
            }
            // Rotate the object's canvas
            ctx.rotate(angle);
            // Draw the object
            ctx.drawImage(img, xOffset, yOffset, this.width, this.height);
            // Restore the full canvas
            ctx.restore();
        }
        // The object does not rotate
        else
        {
            // ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.drawImage(img, this.x, this.y, this.width, this.height);
        }
    }
    // Create a mesh collider
    this.meshCollider = function(otherobj) {
        // Grab all the axis of both objects
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        // Assume there is a collision
        var crash = true;

        // If there is not a collision
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            // Change crash to false
            crash = false;
        }
        // Return collision flag
        return crash;
    }
}

// Called every time interval
function FixedUpdate() {
    // If the cannonBall crashed with the target, stop the game
    if (cannonBall.meshCollider(myTarget)) {

        // Stop the game
        gameArea.stop();

        // Play the collision animation
        CollisionAnimationHelper();

        // Indicate that the target is hit
        isHitTarget = true;
    
        // Update score
        score++;
        $("#score").html(score);

    } 
    // The cannon ball misses the target
    else {
        // Clear the game area
        gameArea.clear();
        // Draw the background
        background.update();
        // Updates the target's position
        MoveTarget();
        // Redraws the target
        myTarget.update();
        // Updates the cannonBall position
        MoveCannonBall(angle);
        // Redraws the cannonBall
        cannonBall.update();
        // Redraws the cannon
        cannon.update();
    }
    // Test if there is an end game condition
    TestEndGame();
}
// Move the target left and right
function MoveTarget(){
    // Makes the target bounce back and forth
    if(myTarget.x + myTarget.speedX > canvasWidth-myTarget.width|| myTarget.x + myTarget.speedX <= 0) {
        myTarget.speedX = -myTarget.speedX;
    }
    // Update the target's x position
    myTarget.x += myTarget.speedX;
}

// Set the angle to the cannon ball
function SetBallAngle(ballAngle)
{
    ballAngle = ballAngle - 1.5708;
    var speed = 25;
    var xunits = Math.cos(ballAngle) * speed;
    var yunits = Math.sin(ballAngle) * speed;
    cannonBall.speedX += xunits;
    cannonBall.speedY += yunits;
}

// Launch the cannon ball
function MoveCannonBall(ballAngle){

    // Update the cannon ball speed
    cannonBall.x += cannonBall.speedX;
    cannonBall.y += cannonBall.speedY; 
    // If the cannonBall goes out of bounds
    if(cannonBall.y < -20 || cannonBall.x <-20 || cannonBall.x > canvasWidth+20 || cannonBall.y > canvasHeight+20)
    {
        ResetCannonBall();
    }
}

// Initilize the text values for the game
function InitializeTextValues(){
    score = 0;
    ballCount = 10;
    $("#score").text(score);
    $("#ballCount").text(ballCount);
}

// Resets the cannonball
function ResetCannonBall() {
    // Make the speed to 0
    cannonBall.speedX = 0; 
    cannonBall.speedY = 0;
    // Reset the position 
    cannonBall.x = cannonBall.initialX;
    cannonBall.y = cannonBall.initialY;
    // Signal that the ball is not moving
    isMovingBall = false;
}

// Resets the target
function ResetTarget(){
    // Make the target speed equal to 0
    myTarget.speedX = 0;
    myTarget.speedY = 0;
    // Reset the target's position
    myTarget.x = myTarget.initialX;
    myTarget.y = myTarget.initialY;
    // Signal that the target has not been hit
    isHitTarget = false;
}

// Reset the game
function ResetGame(){
    gameArea.stop();
    // Reset the text values
    InitializeTextValues();
    // Reset the cannon ball
    ResetCannonBall();
    // Reset the target
    ResetTarget();
    // Move the target
    GiveTargetSpeed();
    // Start the updates for the game 
    gameArea.interval = setInterval(FixedUpdate, 60);
}

// Give the target speed
function GiveTargetSpeed(){
    var randomSpeed = Math.floor(Math.random() * (12 - 8)) + 8;
    if(Math.floor(Math.random() * (2)) === 0){
        randomSpeed = -randomSpeed;
    }
    // Make target speed random
    myTarget.speedX = randomSpeed;
}

// Rotates the cannon
function RotateCannon(event) {
    // Get the canvas x and y axis
    var cx = gameArea.canvas.width/2 - cannon.width/2;
    var cy = gameArea.canvas.height - cannon.height*.2;
    // Get the mouse x and y axis
    mouseX = parseInt(event.clientX);
    mouseY = parseInt(event.clientY);

    // Get the required variables to calculate the offest of the canvas to calculate the mouse x and y axis
    var navbarWidth = $("body").width();
    var getCanvasWidth = $("canvas").width();
    var getCanvasHeight = $("canvas").height();

    // Adjust the mouse position based on the spacing to the left and to the top
    mouseX -= (navbarWidth-getCanvasWidth)/2;
    mouseY -= gameArea.canvas.offsetTop*2;

    // Adjust the mouse posiiton based on the canvas
    mouseX -= getCanvasWidth/2;
    mouseY -= getCanvasHeight - 20;

    // Add 90 degrees of radian to the angle to align to mouse
    angle = Math.atan2(mouseY, mouseX) + 1.5708;
}

// Holds the explosion component
function Explosion(width, height, x, y, imgSrc, numberOfFrames, ticksPerFrame) {
    // Holds the initial X and Y intervals, width, height, speed, position(x,y), and image
    this.initialX = x;
    this.initialY = y;
    this.width = width;
    this.height = height; 
    this.x = x;
    this.y = y;
    // Holds the image
    var img = new Image(); 
    img.src = imgSrc;

    // The number of frames in the sequence
    this.numberOfFrames = numberOfFrames-1;
    // The number of ticks before transition to another animation
    this.ticksPerFrame = ticksPerFrame;
    this.frameIndex = 0;
    this.tickCount= 0;

    // Draws the component
    this.update = function() {

        if(this.tickCount%this.ticksPerFrame === 0){
            this.frameIndex++;
        }
        if(this.frameIndex<= numberOfFrames){
            // Grabs the game area
            ctx = gameArea.context;

            // Plays a segment of the sprite to implement animation
            ctx.drawImage(
                img,
                this.width*this.frameIndex,
                0,
                this.width,
                this.height,
                this.x,
                this.y,
                this.width,
                this.height
            );
            // Increment the tick count
            this.tickCount++;
        }
        else{
            gameArea.stop();
            // If it is the end game
            if(ballCount == 0){
                // Alert to restart the game
                AddEndGameText(score);
            }else{
                gameArea.context.fillText("Click to hunt for another UFO!",canvasWidth/2,canvasHeight/2); 
            }
        }
    }
    // Resets the explosion component
    this.reset = function(){
        this.tickCount = 0;
        this.frameIndex = 0;
    }
}

// Used to call the collision Animation
function CollisionAnimationHelper() {
   
    explosion.reset();
    // Update the explosion x and y axis with some offsets
    explosion.x = myTarget.x -10;
    explosion.y = myTarget.y -30;
    gameArea.interval = setInterval(CollisionAnimation, 60);
}

// Plays the collision animation
function CollisionAnimation(){
    // Clear the game area
    gameArea.clear();
    // Draw the background
    background.update();
    // Plays the explosion
    explosion.update();
    // Redraws the cannon
    cannon.update()
}

// Test if there is an endgame condition
function TestEndGame() {
    if(isHitTarget && ballCount === 0)
    {
        // The animation will be stoped by the explosion after it is done playing
        // End game Text be displayed by the eplosion animation 
        AlertModal("HIT!!!", "Good game! You score is <strong>" + score + "</strong>.<br> Hit \"Reset Game\" botton to play again!");
        
    }else if (!isMovingBall && ballCount === 0)
    {
        AddEndGameText(score);
        gameArea.stop();
        // Alert to restart the game
        AlertModal("Missed", "Good game.<br>Go get some glasses! You score is <strong>" + score + "</strong>.<br> Hit \"Reset Game\" botton to play again!");
    }
}

// Add good game
function AddEndGameText(score){
    if(score>=10){
         gameArea.context.fillText("Perfect!!!",canvasWidth/2,canvasHeight/2); 
    }
    else if(score>4){
         gameArea.context.fillText("Good game young grasshopper...",canvasWidth/2,canvasHeight/2); 
    }
    else{
         gameArea.context.fillText("Don't quit your day job!",canvasWidth/2,canvasHeight/2); 
    }
}

// Trigger an alert
function AlertModal(labelTxt, messageTxt) {
    $("#modalLabel").html(labelTxt);
    $("#modalMessage").html(messageTxt);
    $("#messageModal").modal({show: true});
}
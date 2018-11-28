# UFO Showdown
## Requirements Summarization

Overall, this is a HTML canvas based game that has a cannon that can launch a cannon ball at an UFO. The cannon rotates based on the position of the mouse. In addition, the target of the game bounces back and forth from the screen between the width of the canvas. The user starts out with 10 cannon balls that s/he can use to shoot at the UFO. The game keeps track of the number of hits as the score and displays at each update. 

##	Project Analysis and Design

My project was designed using Bootstrap, HTML, JavaScript, jQuery ,and CSS. Since this is an animation based project, I mainly use JavaScript and jQuery to manipulate the different game objects and display it to a HTML component called a canvas. Basic Bootstrap is used mainly for style and the modal Bootstrap component. 

Below is the description of the main components and objects used in the JavaScript. 

StartGame() --> this gets the game ready and loads and creates all the used variables and images throughout the game. 
gameArea --> An object used to hold information about the canvas and has three different functions: awake(), clear(), and stop(). The awake function grabs all the canvas variables such as width, height, font, and content. The clear function clears the whole canvas. and the stop function makes it so that the game stops updating its frames. 

Component() --> is a game object that holds each of the different components used in the game. The update function updates the position and rotation of the component. The meshCollider component keeps track of the points for collision. 

FixedUpdate() --> is a function called every frame that is used to clear and draw the different compponents on the canvas. The score is updated in this function. 

TestEndGame() --> is a function that tests the state of the game at the end of each FixedUpdate and displays the end game state message if required.  

## Special Features
Using a single image, the explosion animaiton is played. To achieve this illusion, an explosion image that contains 8 frames of the explosion animation was created (800px X 100px). Using a 100px X 100px sliding window, the animaion is played back to the player sequentially, creating an illusion of an explosion. 

##	User manual
Using the mouse, the user can rotate the cannon while the target automatically bounces back and forth. By clicking on the screen, the user can launch a cannon ball at the target. If the target is hit, an animcation of an explosion is played.

## Lesson Learned
By coding this project, I learned about the canvas component and how manipulate the different objects to create illusions. In addition, I had to brush up on some trigonometry to calculate the degree of rotation using the x and y axis of the mouse and the atan2 function to convert the degree to radians; the radians was used to rotate the cannon component. Moreover, I learned about how to use a sliding window to draw the explosition animation using one image.

##	Known Problems, Bugs, Limitations, Unimplemented Features
__Problems/Bugs__
Although the canvas resizes on a desk top screen using Firefox browser, it is not mobile friendly. 

__Limitations/Unimplemented Features__
A JavaScript component needs to be used to resize the canvas conponent so that it can be mobile friendly. 

##	References, Acknowledgements, And Outside Sources
•	The Bootstrap framework was used in association with my project to help with its scalability.
< https://getbootstrap.com/>
•	The project was coded using Sublime Text 3 Trial version. 
<https://www.sublimetext.com/>
•	Knowledge about JQuery, Canvas, and JavaScript was gathering from w3schools. 
<https://www.w3schools.com/

// "main state" that will contain game
var mainState = {
  preload: function () { //this function will be executed at the beginning (load images and sounds)
    game.load.image('bird', 'assets/bird.png'); //Loading bird sprite
    game.load.image('pipe', 'assets/pipe.png'); //laying some pipe bby
    game.load.audio ('jump', 'assets/jump.wav');
  },

  create: function () { // This fnction is called after the preload function. Game set up display sprites
    game.stage.backgroundColor = '#71c5cf'; //background color of game

    game.physics.startSystem(Phaser.Physics.ARCADE); //setting physics system

    this.bird = game.add.sprite(100, 245, 'bird'); // displaying bird at a specific position

    game.physics.arcade.enable(this.bird); // adding physics to the bird. this is needed for: movements, gravity, collisions, etc.

    this.bird.body.gravity.y = 1000; //Add gravity to the bird

    this.timer = game.time.events.loop(1500, this.addRowOfPipes, this); // adds a row of pipes every 1.5 seconds

    var spaceKey = game.input.keyboard.addKey( //call the 'jump' function when the spacekey is hit
      Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.jump, this);

    this.pipes = game.add.group();

    this.score = 0;
    this.labelScore = game.add.text(20, 20, "0", {
      font: "30px Arial",
      fill: "#ffffff"
    });

    this.bird.anchor.setTo(-0.2, 0.5);

    this.jumpSound =game.add.audio('jump');
  },

  update: function () { //This function is called 60 times per second. Game Logic
    if (this.bird.y < 0 || this.bird.y > 490) // if bird is below the screen(0) or above the screen (490) the game will restart
      this.restartGame();
    game.physics.arcade.overlap(
      this.bird, this.pipes, this.restartGame, null, this);
      if (this.bird.angle < 20)
    this.bird.angle += 1;
  },

    hitPipe: function() {
      if (this.bird.alive == false)
        return;
      this.bird.alive = false;
      game.time.events.remove(this.timer);
      this. pipes.forEach(function(p){
        p.body.velocity.x = 0;
      }, this);
    },

  jump: function () {
    this.bird.body.velocity.y = -350; // verticle velocity to bird
    var animation = game.add.tween(this.bird);// creating the animation on the bird
    animation.to ({angle: -20}, 100);//change the angle of the bird to -20 in 100 milliseconds
    animation.start();// start the animation
    if (this.bird.alive == false)
      return;
    this.jumpSound.play();
  },

  restartGame: function () {
    game.state.start('main'); //restart game and reset birdie
  },

  addOnePipe: function (x, y) {
    var pipe = game.add.sprite(x, y, 'pipe'); // create a pipe at (x,y)
    this.pipes.add(pipe);

    game.physics.arcade.enable(pipe); //add the pipe to our previously created group

    pipe.body.velocity.x = -200; // add velocity to make it move left and seem like the bird is moving forward and lie to people

    pipe.checkWorldBounds = true; // kills pipe after it leaves the screen
    pipe.outOfBoundsKill = true;
  },

  addRowOfPipes: function () {
    var hole = Math.floor(Math.random() * 5) + 1; //
    for (var i = 0; i < 8; i++) // add the 6 pipes with two removed
      if (i != hole && i !== hole + 1 && i!== hole + 2) // removes two blocks for the bird to fly through. // hi jim...
      this.addOnePipe(400, i * 60 + 10);

    this.score += 1; //adds to the score
    this.labelScore.text = this.score; // updates score
  }



};


var game = new Phaser.Game(400, 490); //initialize Phaser, and create a 400px by 490px game

game.state.add('main', mainState); // Add the mainState and name it 'main'

game.state.start('main'); //start the state to start the game


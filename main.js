const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let collectibles;
let score = 0;
let scoreText;

function preload() {
    this.load.image('sky', 'assets/background.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('dude', 'assets/player.png');
    this.load.image('collectible', 'assets/collectible.png');
    this.load.audio('jump', 'assets/sounds/jump.wav');
    this.load.audio('collect', 'assets/sounds/collect.wav');
}

function create() {
    this.add.image(400, 300, 'sky');

    const platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    collectibles = this.physics.add.group({
        key: 'collectible',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    collectibles.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(collectibles, platforms);
    this.physics.add.overlap(player, collectibles, collectCollectible, null, this);

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        this.sound.play('jump');
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        this.sound.play('jump');
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
        this.sound.play('jump');
    }
}

function collectCollectible(player, collectible) {
    collectible.disableBody(true, true);
    this.sound.play('collect');

    score += 10;
    scoreText.setText('Score: ' + score);
}

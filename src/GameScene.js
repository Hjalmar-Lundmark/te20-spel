import Phaser from 'phaser'

import ScoreLabel from './ScoreLabel'
import AimLabelX from './AimLabelX'
import AimLabelY from './AimLabelY'

import BombSpawner from './BombSpawner'


const GROUND_KEY = 'ground'
const DUDE_KEY = 'dude'
const STAR_KEY = 'star'
const BOMB_KEY = 'bomb'
let aimTime = true
let throwX = 0
let throwY = 0
let throwV = 10
let shots = 0
let starstaken = 0;
let balltime = 450;
let starSize = 2.0;

export default class GameScene extends Phaser.Scene {
	constructor() {
		super('hello-world')

        this.player = undefined
        this.cursors = undefined
        this.scoreLabel = undefined
        this.aimLabelX = undefined
		this.aimLabelY = undefined
		this.stars = undefined
        this.bombSpawner = undefined
		this.aimer = undefined

        this.gameOver = false
	}

	preload() 
    {
    this.load.image('sky', 'assets/Background2.png');
    this.load.image(GROUND_KEY, 'assets/platform.png');
    this.load.image(STAR_KEY, 'assets/star.png')
    this.load.image(BOMB_KEY, 'assets/snowball.png')


    this.load.spritesheet(DUDE_KEY, 'assets/dude.png', { frameWidth: 32, frameHeight: 48 } )

    }

	create() {
		this.add.image(400, 280, 'sky').setScale(1.1);

		const platforms = this.createPlatforms()
		this.player = this.createPlayer()
		this.player.anims.play('turn')
        this.stars = this.createStars()
		this.aimer = this.createAimer()

        this.scoreLabel = this.createScoreLabel(16, 16, 0)
		this.aimLabelX = this.createAimLabel(16, 555, throwX)
		this.aimLabelY = this.createAimLabel2(550, 555, throwY)

        this.bombSpawner = new BombSpawner(this, BOMB_KEY)
        const bombsGroup = this.bombSpawner.group

		this.physics.add.collider(this.player, platforms)
        this.physics.add.collider(this.stars, platforms)
		this.physics.add.collider(bombsGroup, platforms)
        //this.physics.add.collider(this.player, bombsGroup, this.hitBomb, null, this)

		this.physics.add.overlap(this.bombSpawner.group, this.stars, this.collectStar, null, this)

        this.cursors = this.input.keyboard.createCursorKeys()

    }

    update()
	{
        if (this.gameOver)
		{
			return
		}

		if (aimTime) {
			if (this.cursors.right.isDown) {
				if (throwX < 1000) {
				throwX += throwV
				this.aimLabelX.add(10)
				this.aimer.clear(true);
				this.aimer = this.createAimer()
				}
			}
			if (this.cursors.left.isDown) {
				if (throwX > -1000) {
				throwX -= throwV
				this.aimLabelX.add(-10)
				this.aimer.clear(true);
				this.aimer = this.createAimer()
				}
			}
			if (this.cursors.down.isDown) {
				if (throwY < 1000) {
				throwY += throwV
				this.aimLabelY.add(10)
				this.aimer.clear(true);
				this.aimer = this.createAimer()
				}
			}
			if (this.cursors.up.isDown) {
				if (throwY > -1000) {
				throwY -= throwV
				this.aimLabelY.add(-10)
				this.aimer.clear(true);
				this.aimer = this.createAimer()
				}
			}

			if (this.cursors.space.isDown) {
				//Shoot
				this.bombSpawner.spawn(this.player.x, this.player.y, throwX, throwY)
				aimTime = false
				shots += 1

				balltime = 450;
			}
		} else if (!aimTime) {
			this.aimer.setTint(0x96969F)
			if (balltime > 0) {
				balltime = balltime -1
			} else if (balltime <= 0) {
				this.bombSpawner.group.clear(true);
				aimTime = true;
				this.aimer.setTint(0x00ff00);
			}

			//Dev
			if (this.cursors.shift.isDown) {
				this.bombSpawner.group.clear(true);
				aimTime = true;
				this.aimer.setTint(0x00ff00);
			}
		}
	}

    createStars()
	{
		const stars = this.physics.add.staticGroup({
			key: STAR_KEY,
			//repeat: 1,
			setXY: { x: (Phaser.Math.Between(50, 750)), y: (Phaser.Math.Between(120, 530))/*, stepX: 70*/}
		})

		return stars
	}

	createAimer()
	{
		const sight = this.physics.add.staticGroup({
			key: STAR_KEY,
			repeat: 4,
			setXY: { x: this.player.x, y: this.player.y, stepX: throwX/40, stepY: throwY/40}
		})

		return sight
	}

    collectStar(playerAAA, star)
	{
		//playerAAA.disableBody(true, true)
		star.disableBody(true, true)

        this.scoreLabel.add(10)
		starSize -= 0.1;
		
        if (this.stars.countActive(true) === 0)
		{
			//  A new batch of stars to collect
			this.stars.children.iterate((child) => {
				child.enableBody(true, Phaser.Math.Between(50, 750), (Phaser.Math.Between(120, 530)), true, true)/*.setScale(starSize) */;
			})
		}
	}

	createPlatforms()
	{
		const platforms = this.physics.add.staticGroup()

		platforms.create(400, 568, GROUND_KEY).setScale(2).refreshBody();

        return platforms
	}

    createPlayer()
	{
		const player = this.physics.add.sprite(100, 510, DUDE_KEY)
		player.setBounce(0)
		player.setCollideWorldBounds(true)

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		})
		
		this.anims.create({
			key: 'turn',
			frames: [ { key: DUDE_KEY, frame: 4 } ],
			frameRate: 20
		})
		
		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		})

        return player

	}

    createScoreLabel(x, y, score)
	{
		const style = { fontSize: '24px', fill: '#FFF' }
		const label = new ScoreLabel(this, x, y, score, style)

		this.add.existing(label)

		return label
	}

	createAimLabel(x, y, score)
	{
		const style = { fontSize: '32px', fill: '#FFF' }
		const label = new AimLabelX(this, x, y, score, style)

		this.add.existing(label)

		return label
	}

	createAimLabel2(x, y, score)
	{
		const style = { fontSize: '32px', fill: '#FFF' }
		const label = new AimLabelY(this, x, y, score, style)

		this.add.existing(label)

		return label
	}

    hitBomb(player, bomb)
	{
		this.physics.pause()

		player.setTint(0xff0000)

		player.anims.play('turn')

		this.gameOver = true
	}

}

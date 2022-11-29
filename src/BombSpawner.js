import Phaser from 'phaser'

export default class BombSpawner
{
	/**
	 * @param {Phaser.Scene} scene
	 */
	constructor(scene, bombKey = 'bomb')
	{
		this.scene = scene
		this.key = bombKey

		this._group = this.scene.physics.add.group()
	}

	get group()
	{
		return this._group
	}

	spawn(x,y,vx,vy)
	{
		const bomb = this.group.create(x, y, this.key)
        bomb.setBounce(1)
        bomb.setCollideWorldBounds(true)
		//bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
		bomb.setVelocity(vx, vy)
		
		return bomb
	}
}
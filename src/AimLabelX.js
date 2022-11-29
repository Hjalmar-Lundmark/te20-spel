import Phaser from 'phaser'

const formatScore2 = (score) => `VX: ${score}`

export default class AimLabel extends Phaser.GameObjects.Text
{
	constructor(scene, x, y, score, style)
	{
		super(scene, x, y, formatScore2(score), style)

		this.score = score
	}

	setScore2(score)
	{
		this.score  = score
		this.updateScoreText2()
	}

	add2(points)
	{
		this.setScore2(this.score + points)
	}

	updateScoreText2()
	{
		this.setText(formatScore2(this.score))
	}
}
import 'rc-slider/assets/index.css'
import React = require('react')
import {Component} from 'react'
import './Knob.less'

interface IKnobProps {
	value: number
	onChange: (newValue: number) => any
	min?: number
	max?: number
	sensitivity?: number
}

interface IKnobState {
	mouseX: number
	mouseY: number
	mouseDownPosition: {
		x: number,
		y: number,
	}
	lastMousePosition: {
		x: number,
		y: number,
	}
	isMouseDown: boolean
}

export class Knob extends Component<IKnobProps, IKnobState> {
	public static defaultProps = {
		onChange: () => undefined,
		min: 0,
		max: 1,
		sensitivity: 0.01,
	}

	public state: IKnobState = {
		mouseX: 0,
		mouseY: 0,
		mouseDownPosition: {
			x: 0,
			y: 0,
		},
		lastMousePosition: {
			x: 0,
			y: 0,
		},
		isMouseDown: false,
	}

	constructor(props: IKnobProps) {
		super(props)
		window.addEventListener('mousemove', (e: MouseEvent) => {
			// logger.log('mousemove: ', e)
			this.setState({
				mouseX: e.screenX,
				mouseY: e.screenY,
				lastMousePosition: {
					x: this.state.mouseX,
					y: this.state.mouseY,
				},
			})
			if (this.state.isMouseDown) {
				const mouseXDelta = (this.state.mouseX - this.state.lastMousePosition.x) * props.sensitivity
				const mouseYDelta = (this.state.mouseY - this.state.lastMousePosition.y) * props.sensitivity
				this.props.onChange(calculateNewVolume(this.props.value, mouseXDelta, mouseYDelta))

				function calculateNewVolume(oldValue: number, mouseDeltaX: number, mouseDeltaY: number): number {
					const combined = oldValue + mouseDeltaX - mouseDeltaY
					return Math.max(props.min, Math.min(props.max, combined))
				}
			}
		})
		window.addEventListener('mouseup', (e: MouseEvent) => {
			// logger.log('mousemove: ', e)
			this.setState({
				isMouseDown: false,
			})
		})
	}

	public render() {
		const {value} = this.props

		return (
			<div className="knob">
				<div className="wedge">
					<div
						className="actualKnob"
						style={{
							transform: `rotate(${getRotation(value)}deg)`,
						}}
						onMouseDown={this.handleMouseDown}
					>
						<div className="mark"></div>
					</div>
				</div>
			</div>
		)
	}

	private handleMouseDown = (e: React.MouseEvent) => {
		this.setState({
			mouseDownPosition: {
				x: this.state.mouseX,
				y: this.state.mouseY,
			},
			isMouseDown: true,
		})
	}
}

function getRotation(input: number): number {
	const min = 220
	const max = 500
	const range = max - min
	return (input * range) + min
}

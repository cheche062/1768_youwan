import React from 'react';


class Tick extends React.Component { 
	constructor(){
		super();
		this.state = {
			hours: 0,
			minutes: 0,
			seconds: 0
		}

		setInterval(()=>{
			this.tickFn();
		}, 1000)
	}

	componentWillMount(){
		this.tickFn();
	}

	tickFn(){
		let oDate = new Date();

		this.setState({
			hours: oDate.getHours(),
			minutes: oDate.getMinutes(),
			seconds: oDate.getSeconds()
		})
	}



	render(){
		return <div>
			<span>{this.state.hours}</span>:
			<span>{this.state.minutes}</span>:
			<span>{this.state.seconds}</span>
		</div>
	}
}

export {
	Tick as default
}
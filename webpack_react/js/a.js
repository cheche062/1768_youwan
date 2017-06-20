import React from 'react';
import Tick from './b.js';
// 

class Item extends React.Component { 
	constructor(){
		super();
	}

	render(){
		return <span>我是item</span>
	}
}

class List extends React.Component{
	constructor(){
		super();
		this.state = {dispaly: "show"}
	}

	clickHandle(){
		this.setState({
			dispaly: this.state.dispaly === 'show'? 'hide' : 'show'
		})
	}

	render(){
		return <div>
			<input type="button" value={this.props.name} onClick={this.clickHandle.bind(this)} />
			<div className={"box " + this.state.dispaly} >
				<Tick />
			</div>

			<Item />
		</div>
	}
}



export {
	List as default
}




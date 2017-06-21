import React from 'react';
import Tick from './b.js';

class Item extends React.Component { 
	constructor(...arg){
		super(...arg);
	}

	componentWillReceiveProps(){
		console.log('props改变了')
	}

	render(){
		return <span>我是：{this.props.age}</span>
	}
}

class List extends React.Component{
	constructor(){
		super();
		this.state = {dispaly: "show", age: 0, fruitArr:['apple', 'banana', 'oriange']}
	}

	clickHandle(){
		this.setState({
			dispaly: this.state.dispaly === 'show'? 'hide' : 'show',
			age: this.state.age+1,
			fruitArr: this.state.fruitArr.concat(Math.random())
		})

	}

	render(){
		let result = [];
		this.state.fruitArr.forEach((item, index)=>{
			result.push(<Item age={item} key={index} />)
		})



		return <div>
			<input type="button" value={this.props.name} onClick={this.clickHandle.bind(this)} />
			{result}
			<div className={"box " + this.state.dispaly} >
				<Tick />
			</div>
		</div>
	}
}



export {
	List as default
}




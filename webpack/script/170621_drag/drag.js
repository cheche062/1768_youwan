import React from 'react';

class Drag extends React.Component {
	constructor(...arg){
		super(...arg);
		this.state = {x: 0, y:0}
	}

	fn(ev){
		var disX = ev.pageX - this.state.x;
		var disY = ev.pageY - this.state.y;

		document.onmousemove = (ev)=>{
			this.setState({
				x: ev.pageX - disX,
				y: ev.pageY - disY,
			})
		}

		document.onmouseup = (ev)=>{
			document.onmousemove = null;
			document.onmouseup = null;
		}
	}

	render(){
		return <div className="box" style={{left: this.state.x + 'px', top: this.state.y + 'px'}}
			onMouseDown={this.fn.bind(this)}>

			{this.props.name}
		</div>
	}
}

class DragParent extends React.Component {
	constructor(...arg){
		super(...arg)
	}

	render(){
		return <div>
			<Drag name={this.props.name1}/>
			<Drag name={this.props.name2}/>
		</div>
	}
}


export {
	DragParent as default
}



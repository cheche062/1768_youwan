import React from 'react';


// 单个座位
class Seat extends React.Component{
	constructor(...args){
		super(...args);
		
	}

	clickHandler(){
		this.props.parentHandler({
			isChoose: !this.props.isChoose,
			value: this.props.value
		});
	}

	render(){
		let _class = this.props.isChoose? 'add' : 'remove';
		return <li className={"fl " + _class} onClick={this.clickHandler.bind(this)}>{this.props.value}</li>
			
		
	}
}

// 已选座位
class Already extends React.Component{
constructor(...args){
		super(...args);

	}

	render(){
		return <span onClick = {this.props.cancelHandler}>{this.props.value}</span>
	}
}

// 电影院
class MovieHouse extends React.Component{
	constructor(...args){
		super(...args);
		let l=Number(this.props.allNum)+1;

		let data = [];
		for(let i=1; i<l; i++){
			data.push({
				isChoose: false,
				value: i<10? '0' + i : '' + i
			})
		}

		this.state = {
			alreadyChoose: [],
			dataSeat: data
		}
		
	}

	// 取消座位
	cancelable(ev){
		let alreadyChooseNew = this.state.alreadyChoose.filter((item, index)=>{
			return ev.target.innerHTML !== item
		})

		let dataSeatNew = this.state.dataSeat.map((item, index)=>{
			return {
				isChoose: alreadyChooseNew.indexOf(item.value) > -1?  true : false,
				value: item.value
			}
		})

		this.setState({
			alreadyChoose: alreadyChooseNew,
			dataSeat: dataSeatNew
		})
	}

	// 添加座位
	addHandler(obj){
		let alreadyChooseNew = [];
		let dataSeatNew = this.state.dataSeat.map((item, index)=>{
			return {
				isChoose: item.value === obj.value? obj.isChoose : item.isChoose,
				value: item.value
			}
		})

		// 同时更新
		dataSeatNew.forEach((item, index)=>{
			if(item.isChoose){
				alreadyChooseNew.push(item.value);
			}
		})

		if(alreadyChooseNew.length > 5){
			alert('最多选择5个座位')
			return;
		}

		this.setState({
			dataSeat: dataSeatNew,
			alreadyChoose: alreadyChooseNew
		})

	}

	render(){
		// 已选座位
		let alreadySeatArr = [];
		this.state.alreadyChoose.forEach((item, index)=>{
			alreadySeatArr.push(<Already value={item} key={index} cancelHandler = {this.cancelable.bind(this)}/>)
		})

		let resultArr = [];
		this.state.dataSeat.forEach((item, index)=>{
			resultArr.push(<Seat isChoose = {item.isChoose} value = {item.value} key={index} parentHandler = {this.addHandler.bind(this)}/>);
			
		})

		return <div>
			<div className="seat-warp">
				<ul className="clearfix">
					{resultArr}
				</ul>
			</div>

			<div className="already">
				{alreadySeatArr}
			</div>
		</div>
	}
}

export {
	MovieHouse as default
}

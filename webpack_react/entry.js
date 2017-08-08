import React from 'react';
import ReactDOM from 'react-dom';
import MovieHouse from './js/170701_ticket/js/movieHouse.js';

require('./170701_ticket/css/style.css');

ReactDOM.render(
		<MovieHouse allNum=20/>,
		document.getElementById('app')
	)


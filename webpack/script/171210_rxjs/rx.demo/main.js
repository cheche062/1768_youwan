// import { Observable } from 'rxjs/Rx';
// import { getStream } from './1';



function getData() {
    return new Promise((resolve, reject) => {
        resolve('ok');
    })
}


async function fetchData() {
    const data = await getData();

    return data;
}



fetchData().then(val => console.log(val))




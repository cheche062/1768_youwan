function getData() {
    return new Promise((resolve, reject) => {
        resolve('ok66666');
    })
}


async function fetchData() {
    const data = await getData();

    return data;
}


fetchData().then(val => console.log(val))




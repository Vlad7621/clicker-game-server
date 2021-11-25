import http from 'http';

const port = process.env.PORT || 3080;

let players = [];
let key = {};
http.createServer((request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    response.setHeader("Content-Type", "application/json");
    let body = '';
    request.on('data', chunk => {
        body += chunk;
    });
    request.on('end', async () => {
        let data = JSON.parse(body);

        let res = '';
        if(data.func === 'searchPlayers') {
            players.push(data.id);
            res = await searchPlayers(players);
            players = [];
        }
        if(data.func === 'gameResult') {
            key[data.key] = key[data.key] ? `${key[data.key]}&${data.amount}` : `${data.amount}`;
            res = await gameResult(key);
            key = {};
        }
        response.end(JSON.stringify(res));
    });
}).listen(port, () => console.log('Server work!'));


function searchPlayers(players) {
    if(players.length === 2) {
        return `#${players.join('').replace(/#/g, '')}`;
    }
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(searchPlayers(players));
        }, 1000);
    });
}

function gameResult(key){
    if(Object.values(key)[0].split('&').length === 2) {
        return Object.values(key)[0];
    }
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(gameResult(key));
        }, 1000);
    });
}
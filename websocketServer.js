var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var WebSocketServer = require('ws');
var games = {};
//@ts-ignore
var wss = new WebSocketServer.Server({ port: 1037 });
var connections = new Set();
var isPlayerAssigned = function (gameId, userId) {
    var player = isPlayerInGame(gameId, userId);
    return (player === null || player === void 0 ? void 0 : player.roleType) !== undefined;
};
var isPlayerInGame = function (gameId, userId) {
    var _a;
    return (_a = games[gameId]) === null || _a === void 0 ? void 0 : _a.players.filter(function (player) { return player.playerId === userId; })[0];
};
var playersInGame = function (game) { return new Set(__spreadArray([], game === null || game === void 0 ? void 0 : game.players, true).map(function (player) { return player.playerId; })).size; };
wss.on('connection', function (ws) {
    var socketConnection;
    ws.on('message', function (message) {
        var data = JSON.parse(message);
        var userId = data.userId, gameId = data.gameId;
        var connection = { socket: ws, gameId: gameId, userId: userId };
        if (!socketConnection) {
            socketConnection = connection;
            connections.add(connection);
        }
        if (userId && gameId) {
            var player = { playerId: userId };
            if (!games[gameId]) {
                var game = {
                    host: userId,
                    gameId: gameId,
                    players: [player]
                };
                games[gameId] = game;
            }
            else {
                if (games[gameId].host === '') {
                    games[gameId].host = userId;
                }
                if (!isPlayerInGame(gameId, userId)) {
                    games[gameId].players.push(player);
                }
            }
            var messageToBroadcast_1 = JSON.stringify({ playerCount: playersInGame(games[gameId]) });
            connections.forEach(function (connection) {
                connection.socket.send(messageToBroadcast_1);
            });
        }
    });
    ws.on('close', function () {
        var _a, _b, _c;
        connections.delete(socketConnection);
        var gameId = socketConnection.gameId, userId = socketConnection.userId;
        // Player dropped before we assigned roles
        if (!isPlayerAssigned(gameId, userId)) {
            var player = (_a = games[gameId]) === null || _a === void 0 ? void 0 : _a.players.filter(function (player) { return player.playerId === userId; })[0];
            (_b = games[gameId]) === null || _b === void 0 ? void 0 : _b.players.splice(games[gameId].players.indexOf(player), 1);
            if (((_c = games[gameId]) === null || _c === void 0 ? void 0 : _c.players.length) === 0) {
                games[gameId].host = '';
            }
            else if (games[gameId].host === userId) {
                games[gameId].host = games[gameId].players[0].playerId;
            }
        }
        if (gameId) {
            // need to add host info into here
            var messageToBroadcast_2 = JSON.stringify({ playerCount: playersInGame(games[gameId]) });
            connections.forEach(function (connection) {
                connection.socket.send(messageToBroadcast_2);
            });
        }
    });
});

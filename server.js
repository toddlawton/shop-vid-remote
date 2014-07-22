var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    __ = require("underscore"),
    products = [],
    sockets = [];

app.use( express.static(__dirname + '/public'));

server.listen(4000);

io.sockets.on('connection', function (socket) {

    // Update connected sockets
    sockets.push(socket);

    // Send out available products on connection
    socket.emit('products-available', products);

    // Product events
    socket.on('add-product', function (data) {
        products.push(data);
        sockets.forEach(function (socket) {
            socket.emit('product-added', data);
        });
    });

    socket.on('remove-product', function (data) {
        updatedProducts = __.without(products, data.id);
        products = [];
        products.push(updatedProducts);
        products = products.slice(1,products.length);
        sockets.forEach(function (socket) {
            socket.emit('product-removed', data);
        });
    });

    // Video events
    socket.on('pause-video', function (data) {
        sockets.forEach(function (socket) {
            socket.emit('video-paused');
        });
    });

    socket.on('play-video', function (data) {
        sockets.forEach(function (socket) {
            socket.emit('video-played');
        });
    });

});
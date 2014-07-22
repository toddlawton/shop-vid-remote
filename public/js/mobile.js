var socket = io.connect('http://localhost:4000');

// Insert product to the beginning of product list
function addProduct (data) {
    $('#products').prepend('<div id="product-' + data.id + '" class="browsing-product-item span-one-quarter shop-vid-product"> <a href="'+data.url+'" target="_blank"><div class="browsing-product-thumb-container"><div class="browsing-product-thumb"><img class="product-thumbnail" src="' + data.img + '"></div></div><div class="browsing-product-description"><h3 class="product-designer">' + data.designer + '</h3><h4 class="product-name">' + data.product + '</h4><p class="product-price">$' + data.price + ' CAD</p></div></a></div>');
    $('#product-'+data.id).hide().show('slow');
    var tmpData = data.id;
};

function removeProduct (data) {
    $('#product-'+data.id).hide('slow');
};

// Populate list with currently available products
socket.on('products-available', function (data) {
    for (var i = 0; i < data.length; i++) {
        addProduct(data[i]);
    }
});

// This listens for any individual products coming back from the server
socket.on('product-added', addProduct);
socket.on('product-removed', removeProduct);

// Detect when user browses on mobile to another tab and pause video until they return
var eventName = 'visibilitychange';

if ( document.webkitHidden != undefined ) {
    eventName = 'webkitvisibilitychange';
}
 
function handleVisibilityChange() {
    if (document.webkitHidden || document.hidden) {
        socket.emit('pause-video');
    } else {
        socket.emit('play-video');
    }
}
 
document.addEventListener(eventName, handleVisibilityChange, false);
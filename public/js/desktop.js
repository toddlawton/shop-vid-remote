var socket = io.connect('http://localhost:4000');

$(document).ready(function(){

    // Init video
    var pop = Popcorn.youtube('#video', $('#video').data('url') );

    function playVideo() {
        pop.play();
        $('#video-pause-overlay').fadeOut('fast');
    }

    function pauseVideo() {
        pop.pause();
        $('#video-pause-overlay').fadeIn('fast');
    }

    // Look out for video play and pause events
    socket.on('video-paused', pauseVideo);
    socket.on('video-played', playVideo);

    // Timestamp to seconds conversion
    function hmsToSeconds(str) {
        var p = str.split(':'),
            s = 0, m = 1;
        while (p.length > 0) {
            s += m * parseInt(p.pop(), 10);
            m *= 60;
        }
        return s;
    }

    // Generate video events
    $('.video-event').each(function(){

        // Store data for each video event
        var tmpStart = hmsToSeconds($(this).data('start')),
            tmpEnd = hmsToSeconds($(this).data('end'));
        
        // Create a trigger for the event and emit to websocket 
        pop.code({
            start: tmpStart,
            end: tmpEnd,
            target: $(this),
            onStart: function( options ) {
                socket.emit('add-product', {
                    id: options.target.data('id'),
                    designer: options.target.data('designer'),
                    product: options.target.data('product'),
                    price: options.target.data('price'),
                    url: options.target.data('url'),
                    img: options.target.data('img')
                });
            },
            onEnd: function( options ) {
                // Remove product at the end of event timeline
                socket.emit('remove-product', {
                    id: options.target.data('id')
                });  
            }
        });
        
    });

});
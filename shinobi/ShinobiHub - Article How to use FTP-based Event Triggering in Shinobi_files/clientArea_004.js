$(document).ready(function(){
    console.log('<%- config.webPageTitle %> : Attaching Socket.IO Handler')
    $.webSocket = io({
        transports: ['websocket']
    })
    $.webSocket.on('connect',function(d){
        console.log('Websocket Connected')
    })
    $.webSocket.on('f',function(d){
        console.log(d)
    })
})

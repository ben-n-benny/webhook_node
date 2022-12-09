const http = require('http')
const port = 3000

const server = http.createServer(function(req, res){
    res.write('HELLLO')

    return res.end();
})

server.listen(5000, function(error){
    if (error){
        console.log('Error',error);
    }
    else{
        console.log("Listening");
    }
})
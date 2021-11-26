const port = 3000; //Specify a port for our web server
const express = require('express'); //load express with the use of requireJs
const path = require('path');
const app = express(); //Create an instance of the express library

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, 'index.html'));   
})


app.get('/index.html',(req,res)=>{
    res.redirect('/')
})

app.use(express.static(path.join(__dirname,'dist')))

app.all('*',(req,res)=>{
    res.status(404).send({msg:"Request not found"})
})


app.listen(port, function() { //Listener for specified port
    console.log("Server running at: http://localhost:" + port)
});
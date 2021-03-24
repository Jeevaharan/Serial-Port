const SerialPort = require('serialport');

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Paramters = require("./model/parameters")
const uri='mongodb://localhost:27017/test'

app.use(require("cors")()); // allow Cross-domain requests
app.use(require("body-parser").json());
const mongodb = require("mongodb");
mongoose.connect('mongodb://localhost:27017/test',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
});
const db = mongoose.connection;
db.on("error",console.error.bind(console,"Connection Error: "));
db.once("open",()=>{
    console.log("Database Connected");
}
);
const Readline = require('@serialport/parser-readline');
const port = new SerialPort('/COM3', { baudRate: 115200 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));
// Read the port data
port.on("open", () => {
  console.log('serial port open');
});
parser.on('data', (data) =>{
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    const fullDate= day+"-"+month+"-"+year;
    var d= Math.ceil(data);
    var s= d.toString();
    const params = new Paramters({date:fullDate,power:s})
    
    params.save()
    console.log(fullDate+"- "+s);
});


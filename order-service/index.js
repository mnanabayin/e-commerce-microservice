const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { MONGO_CONNECTION_STRING_ORDER } = require('../config');
const amqp = require("amqplib");
const Order = require("./Order");
const app = express();
const PORT = process.env.PORT_ONE || 9090;

var channel, connection;

app.use(express.json());

mongoose.connect(MONGO_CONNECTION_STRING_ORDER,{
    useNewUrlParser: true,
    useUnifiedTopology: true},()=> {
    console.log(`Order-Service DB Connected`)
});


async function connect(){
    const amqpServer = "amqp://localhost:5672"
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("ORDER");
}

function createOrder(products, userEmail){
    let total = 0;
    for (let t=0;t<products.length;t++)
    {
        total+=products[t].price;
    }

    const newOrder = new Order({
         products,
         user: userEmail,
         total_price: total
    })
    newOrder.save();
    return newOrder;


}

connect().then(()=>{
    channel.consume("ORDER",data => {
        console.log("Consuming ORDER queue");
        const {products, userEmail} = JSON.parse(data.content)
        const newOrder = createOrder(products, userEmail);
        channel.ack(data)
        channel.sendToQueue("PRODUCT", Buffer.from(JSON.stringify({ newOrder }))
        );
    })
});




app.listen(PORT,()=>{
    console.log(`Order-Service at PORT ${PORT}`)
})
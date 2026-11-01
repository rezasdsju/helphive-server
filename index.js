import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { MongoClient } from 'mongodb';

const app = express()
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000

const client = new MongoClient(process.env.MONGODB_URI);
export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
const mongoConnection = await connectToMongoDB()
const db = mongoConnection.db('helphive')
const events = db.collection('events')
app.get('/',(req,res)=>{
    res.send('Hello HelpHive')
})

app.post('/create-event', async(req,res)=>{
    const eventData = req.body
    console.log('eventData: ',eventData)
    const result = await events.insertOne(eventData)
    console.log('result: ',result)
    res.send(result)
})

app.listen(port,()=>{
    console.log(`Server is running on PORT ${port}`)
})
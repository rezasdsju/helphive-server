import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { MongoClient } from 'mongodb';
import { jwtVerify, createRemoteJWKSet, errors } from 'jose'


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


const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res.status(401).send({ message: 'Unauthorized: Invalid or missing token' })
        }
        const token = authHeader?.split(' ')[1]
        // console.log(token)
        if (!token) {
            return res.status(401).send({ message: 'Unauthorized: Invalid or missing token' })
        }
        const JWKS = createRemoteJWKSet(
            new URL(`${process.env.FRONTEND_BASE_URL}/api/auth/jwks`)
        )
        const { payload } = await jwtVerify(token, JWKS)
        // console.log('payload: ',payload)
        req.user = payload
        next()

    } catch (error) {
        // console.log('error: ',error.message)
        return res.status(401).send({
            message: 'Unauthorized: Invalid or missing token or Server Error'
        })
    }


}

app.get('/', (req, res) => {
    res.send('Hello HelpHive')
})


// app.get('/all-events', async(req,res)=>{
//     try {
//         const allEvents = await events.find().toArray()
//         // console.log('allEvents: ',allEvents)
//         res.send(allEvents)
//     } catch(error){
//         res.send(error.message)
//     }
// })

app.get('/upcoming-events', async(req,res)=>{
    try{
        const upcomingEvents = await events.find({
            date:{
                $gt:new Date().toISOString()
            }
        }).toArray()
        res.send(upcomingEvents)
    } catch(error) {
        console.log(error)
    }
})
app.post('/create-event', verifyToken, async (req, res) => {

    try {
        const eventData = req.body
        if (!eventData) {
            return res.status(400).send({
                message: 'Event data is required'
            })
        }
        const eventDataWithUserInfo = {
            ...eventData,
            createdBy: {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email
            }
        }
        const result = await events.insertOne(eventDataWithUserInfo)
        res.send(result);
    } catch (error) {
        console.error('Error creating event:', error);

        res.status(500).send({
            message: 'Internal server error'
        });
    }
})

app.listen(port, () => {
    console.log(`Server is running on PORT ${port}`)
})


export default app
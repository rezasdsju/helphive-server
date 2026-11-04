import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { MongoClient, ObjectId } from 'mongodb';
import { jwtVerify, createRemoteJWKSet } from 'jose'


const app = express()
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000

const client = new MongoClient(process.env.MONGODB_URI);
const JWKS = createRemoteJWKSet(
    new URL(`${process.env.FRONTEND_BASE_URL}/api/auth/jwks`)
)

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





const apiEndpoints = [
    { method: 'POST', endpoint: '/create-event', description: 'Create a new event', access: 'JWT-protected' },
    { method: 'GET', endpoint: '/upcoming-events', description: 'Retrieve all upcoming events', access: 'Public' },
    { method: 'GET', endpoint: '/upcoming-events/limit-6', description: 'Retrieve six nearest upcoming events', access: 'Public' },
    { method: 'GET', endpoint: '/upcoming-events/:id', description: 'Retrieve event details by ID', access: 'Public' },
    { method: 'POST', endpoint: '/add-participant/:id', description: 'Join an event', access: 'JWT-protected' },
    { method: 'GET', endpoint: '/joined-events', description: 'Retrieve events joined by the authenticated user', access: 'JWT-protected' },
    { method: 'GET', endpoint: '/manage-events', description: 'Retrieve events created by the authenticated user', access: 'JWT-protected' },
    { method: 'PATCH', endpoint: '/manage-events/:id', description: 'Update an event created by the authenticated user', access: 'JWT-protected' },
    { method: 'DELETE', endpoint: '/manage-events/:id', description: 'Delete an event created by the authenticated user', access: 'JWT-protected' },
]
app.get('/', (req, res) => {
    res.send({
        message: 'Welcome to HelpHive API',
        endpoints: apiEndpoints
    })
})




app.get('/upcoming-events', async (req, res) => {
    try {
        const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" })

        const upcomingEvents = await events.find({
            date: {
                $gte: today
            }
        }).sort({ date: 1 }).toArray()
        res.send(upcomingEvents)
    } catch (error) {
        // console.log(error)
        res.status(500).send({ message: 'Internal Server Error' })
        return
    }
})
app.get('/upcoming-events/limit-6', async (req, res) => {
    try {
        const today = new Date().toLocaleDateString("en-CA", {
            timeZone: "Asia/Dhaka"
        })
        const MostRecentUpcomingEvents = await events.find({
            date: {
                $gte: today
            }
        }).sort({ date: 1 }).limit(6).toArray()
        res.send(MostRecentUpcomingEvents)
    } catch (error) {
        // console.log(error)
        res.status(500).send({ message: 'Internal Server Error' })
        return

    }
})

app.get('/upcoming-events/:id', async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).send({ message: 'Event ID is required' })
        }
        const query = { _id: new ObjectId(id) }
        const result = await events.findOne(query)
        if (!result) {
            return res.status(404).send({ message: 'Event Not Found' })
        }
        res.send(result)
    } catch (error) {
        // console.log(error)
        res.status(500).send({ message: 'Internal server error' })
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

        const today = new Date().toLocaleDateString('en-CA', {
            timeZone: 'Asia/Dhaka'
        })
        if (!eventData.date || eventData.date <= today) {
            return res.status(400).send({
                message: 'Event date must be in future'
            })
        }
        const eventDataWithUserInfo = {
            ...eventData,
            participants: [],
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

app.post('/add-participant/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params
        // console.log(id)
        const query = { _id: new ObjectId(id) }
        // console.log(query)
        const eventData = await events.findOne(query)
        // console.log(eventData)
        if (!eventData) return res.status(404).send({ message: 'Event not found' })


        const today = new Date().toLocaleDateString("en-CA", {
            timeZone: 'Asia/Dhaka'
        })
        if (eventData.date < today) {
            return res.status(400).send({
                message: 'Cannot join a past event'
            })
        }

        const participants = eventData.participants || []
        const userToBeParticipant = {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        }
        const userAlreadyJoined = participants.find((participant) => participant.id === userToBeParticipant.id)


        if (!userAlreadyJoined) {
            if (participants.length >= Number(eventData.maxParticipants)) {
                return res.status(409).send({
                    message: 'This Event is already Full'
                })
            }
            const result = await events.updateOne(
                query, {
                $set: {
                    participants: [...participants, userToBeParticipant]
                }
            }
            )
            res.send(result)
            return
        }
        res.status(409).send({
            message: 'You have already joined this event'
        })


    } catch (error) {
        // console.log(error)
        res.status(500).send({ message: 'Internal server error' })
    }
})




app.get('/joined-events', verifyToken, async (req, res) => {
    try {
        const user = req.user
        const today = new Date().toLocaleDateString("en-CA", {
            timeZone: "Asia/Dhaka"
        })
        const upcomingEvents = await events.find({
            date: {
                $gte: today
            }
        }).sort({ date: 1 }).toArray()
        const allEvents = await events.find({}).sort({ date: 1 }).toArray()
        const joinedUpcomingEvents = upcomingEvents.filter(event => (event.participants || []).some(participant => participant.id === user.id))
        const joinedAllEvents = allEvents.filter(event => (event.participants || []).some(participant => participant.id === user.id))

        const result = [
            { joinedAllEvents: joinedAllEvents },
            { joinedUpcomingEvents: joinedUpcomingEvents }
        ]
        // console.log(result)
        res.send(result)
    } catch (error) {
        // console.log(error)
        res.status(500).send('Internal Server Error')
        return
    }
})


app.get('/manage-events', verifyToken, async (req, res) => {
    try {
        const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" })

        const user = req.user
        const createdAllEvents = await events.find({
            "createdBy.id": user.id
        }).sort({ date: 1 }).toArray()
        // console.log(createdEvents)
        const createdUpcomingEvents = await events.find({
            date: {
                $gte: today

            },
            "createdBy.id": user.id
        }).sort({ date: 1 }).toArray()
        const createdAllAndUpcomingEvents = [
            { createdAllEvents: createdAllEvents },
            { createdUpcomingEvents: createdUpcomingEvents }
        ]
        res.send(createdAllAndUpcomingEvents)

    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' })
    }
})


app.patch('/manage-events/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params
        const query = {
            _id: new ObjectId(id),
            'createdBy.id': req.user.id
        }
        const updatedEventFromClient = req.body
        const updatedEventToSetDataBase = {
            title: updatedEventFromClient.title,
            description: updatedEventFromClient.description,
            type: updatedEventFromClient.type,
            image: updatedEventFromClient.image,
            location: updatedEventFromClient.location,
            date: updatedEventFromClient.date,
            maxParticipants: updatedEventFromClient.maxParticipants

        }
        const result = await events.updateOne(query, {
            $set: updatedEventToSetDataBase
        })
        if (result.matchedCount === 0) {
            return res.status(404).send({
                message: 'Event not found or you are not authorized to update it'
            })
        }
        res.send(result)
    } catch (error) {
        res.status(500).send({
            message: 'Internal Server Error'
        })
    }
})
app.delete('/manage-events/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params
        const query = {
            _id: new ObjectId(id),
            'createdBy.id': req.user.id
        }
        const result = await events.deleteOne(query)
        if (result.deletedCount === 0) {
            return res.status(404).send({
                message: 'Event not found or you are not authorized to delete it'
            })
        }
        res.send(result)
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
})
app.listen(port, () => {
    console.log(`Server is running on PORT ${port}`)
})


export default app
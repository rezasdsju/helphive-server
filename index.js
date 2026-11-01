import express from 'express'
import cors from 'cors'
import 'dotenv/config'

const app = express()
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000

app.get('/',(req,res)=>{
    res.send('Hello HelpHive')
})
app.listen(port,()=>{
    console.log(`Server is running on PORT ${port}`)
})
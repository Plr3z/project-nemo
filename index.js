import express from 'express'
import cors from 'cors'
import router from './routers.js'

const app = express()

app.use(express.json())
app.use(cors())
app.use(router)

app.listen(4000,() => {
    console.log('Servidor rodando na porta 4000!')
})

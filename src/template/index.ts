import Noonjs from "noonjs"
import config from '../config.json'

const noonjs = new Noonjs(config)

noonjs.on("error", error => {
    console.log(error)
})

noonjs.on("started", port => {
    console.log(`✅ Server is running on http://localhost:${port}`)
})

noonjs.start()
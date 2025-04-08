import express from 'express';
import cors from 'cors'

const app = express()

app.use(cors());
const port= process.env.PORT || 4000;


app.get("/", (req, res) => {
    res.send("hello")
})

app.get("/jokes", (req, res) => {
    const jokes = [
        {
            id: 1,
            title: "A joke",
            content: "This is joke 1",
        },

        {
            id: 2,
            title: "Another joke",
            content: "This is joke 2",
        },
        {
            id: 3,
            title: "A third joke",
            content: "This is joke 3",
        },
        {
            id: 4,
            title: "A fourth joke",
            content: "This is joke 4",
        },
        {   
            id: 5,
            title: "A fifth joke",
            content: "This is joke 5",
        },     
    ]
    res.send(jokes)
});


app.listen(port, () => {
    console.log(`app is listening at port ${port}`)
})
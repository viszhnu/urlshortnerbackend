const express = require("express");

const app = express();

app.listen(process.env.PORT || 3000);

const cors = require("cors");
app.use(cors());
app.use(express.json());

const mongodb=require("mongodb");
const { nanoid } = require("nanoid");
const URL="mongodb+srv://vishnu:n3Uf35jUEa!4qEr@cluster0.xfblp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const DBname="urlshortner";

app.post("/", async function(req, res){

    try{
        let connection = await mongodb.connect(URL);

        let db = await connection.db(DBname);
        
        let bigurl = req.body;
        
        let randomstring=nanoid(5);
        
        req.body.shorturl = randomstring;
        await db.collection("urls").insertOne(req.body);

        await connection.close();

        res.json({
            shorturl:randomstring
        })
    }catch(e){
        res.json({
            message:"error in url post"
        })
    }
})

app.get("/", async function(req,res){
    
    try{
        let connection = await mongodb.connect(URL);

        let db = await connection.db(DBname);
        
        let answer = await db.collection("urls").find().toArray();

        await connection.close();

        console.log(answer);

        return res.json({
            answer
        })
        
    }catch{
        console.log("error in get");
    }
})

app.get("/:id", async function (req, res){

    try{
        let connection = await mongodb.connect(URL, {useUnifiedTopology: true});

        let db = await connection.db(DBname);

        db.collection("urls").findOne({shorturl:req.params.id}, function(err, data){
            if(err){
                throw err;
            }else{
                if(data!==null)
                res.redirect(data.longurl);
                else
                res.json({
                    message:"page not found"
                })
            }
        })
    }catch(e){
        res.json({
            message:"error in get"
        })
    }
})
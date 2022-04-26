const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId =require('mongodb').ObjectId
const app = express();
const port = process.env.PORT || 5000;


//password :ZjzhsjPLuw8ENBjJ
//usr: dbuser1


const uri = "mongodb+srv://dbuser1:ZjzhsjPLuw8ENBjJ@cluster0.5gctk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const userCollection = client.db("foodExpress").collection("user");

        //get user and api create
        app.get('/user', async(req, res) => {
         const query={};
         const cursor=userCollection.find(query);
         const users=await cursor.toArray();
         res.send(users)
        })


        //specific user
        app.get('/user/:id',async(req,res) => {
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const result=await userCollection.findOne(query);
            res.send(result);
        })

         
        //post user ;add a new user
        app.post('/user', async (req, res) => {
            const newUser = req.body;
            console.log('adding new user', newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result)
        })

      //update user
      app.put('/user/:id',async(req,res) => {
          const id=req.params.id;
          const updatedUser=req.body;
          const filter={_id:ObjectId(id)};
          const options = { upsert: true };
          const updateDoc = {
            $set: {
             name:updatedUser.name,
             email:updatedUser.email
            },
          };

          const result= await userCollection.updateOne(filter,updateDoc,options);
          res.send(result);
      })

        //delete user
        app.delete('/user/:id', async(req,res) => {
            const id =req.params.id;
            const query={_id:ObjectId(id)};
            const result=await userCollection.deleteOne(query);
            res.send(result)
        })
    }
    finally {
        //await client.close();
    }
}

run().catch(console.dir)

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Runing')
})
app.listen(port, () => {
    console.log('listening to the', port)
})
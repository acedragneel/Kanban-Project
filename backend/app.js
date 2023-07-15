const express = require("express");
const cors = require("cors");


// Initializing APP
const app = express();

// Midlewares
app.use(express.json());
app.use(cors());


let data = {} // "username":{"password":"das", "data":[board data]}


app.get("/users", (req, res) => {
  res.json({ "success": "data sent","data":JSON.stringify(Object.keys(data)) });
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if(!!username && !!password){
    if(username in data){
      return res.status(200).json({
        "error":"Duplicate username"
      })
    }
    data[username] = {
      password:password,
      data:"[]"
    }
    // console.log(data);
    return res.status(200).json({
      "success":"User registered successfully"
    })
  }else{
    return res.status(200).json({
      "error":"Please enter the username or password correctly"
    })
  }
})


app.post("/getdata",(req,res)=>{
  // console.log(data);
  const {username, password} = req.body;
  if(!!username && !!password){
    if(username in data){
      if(data[username].password === password){
        res.json({ "success": "data sent","data":data[username].data });
      }else{
        return res.status(200).json({
          "error":"You have entered wrong password"
        })
      }
    }else{
      return res.status(200).json({
        "error":"User doesn't exists"
      })
    }
  }else{
    return res.status(200).json({
      "error":"Please enter the username or password correctly"
    })
  }
})


app.post("/updatedata",(req,res)=>{
  // console.log(data);
  const {username, password,data:boardData} = req.body;
  if(!!username && !!password){
    if(username in data){
      if(data[username].password === password){
        data[username].data = boardData;
        return res.status(200).json({
          "success":"Data updated successfully"
        })
      }else{
        return res.status(200).json({
          "error":"You have entered wrong password"
        })
      }
    }else{
      return res.status(200).json({
        "error":"User doesn't exists"
      })
    }
  }else{
    return res.status(200).json({
      "error":"Please enter the username or password correctly"
    })
  }
})

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if(!!username && !!password){
    if(username in data){
      if(data[username].password === password){
        return res.status(200).json({
          "success":"User Logged in",
          "data":JSON.stringify(data[username].data)
        })
      }else{
        return res.status(200).json({
          "error":"You have entered wrong password"
        })
      }
    }else{
      return res.status(200).json({
        "error":"User doesn't exists"
      })
    }
  }else{
    return res.status(200).json({
      "error":"Please enter the username or password correctly"
    })
  }
})

app.listen(8080, '0.0.0.0');
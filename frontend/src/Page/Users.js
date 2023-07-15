import React from "react";
import './Users.css'
import { BACKEND_URL } from "../constant";

export default class Users extends React.Component{
    constructor(props){
      super(props);
      this.state = {data:undefined};
    }

    componentDidMount(){
      let headersList = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json"
      }

      let response = fetch(`${BACKEND_URL}/users`, { 
        method: "GET",
        headers: headersList
      });

      response.then(res=>res.json()).then((data)=>{
        
        if("error" in data){

        }else if("success" in data){
          console.log(data)
          this.setState({data:JSON.parse(data.data)})
        }
      })
    }

    render(){
      console.log(this.state)
      return(
        <div className="users">
          {this.state.data === undefined?"No Data or there could be an error":this.state.data.map((data,i)=>
            <p key={i}>{data}</p>
          )}
        </div>
      )
    }
}
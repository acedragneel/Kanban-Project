import React, { useEffect, useRef, useState } from "react";

import Board from "./Components/Board";

import "./Main.css";
import Editable from "./Components/Editable";
import { useLocation, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "./constant";

function Main() {
  const location = useLocation();
  const navigate = useNavigate();
  const bgRef = useRef(undefined);
  const navRef = useRef();
  // console.log(location);
  

  const [boards, setBoards] = useState(
    undefined
  );

  function updateBackground(e){
    // console.log(`linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,8,88,1) ${e.clientX/window.innerWidth}%, rgba(0,0,0,1) 100%);`)
    if(!!bgRef.current)
    bgRef.current.style.background = `linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,8,88,1) ${(e.clientX/window.innerWidth)*100}%, rgba(0,0,0,1) 100%)`
  }

  useEffect(async ()=>{
    document.addEventListener("mousemove",updateBackground);
    let headersList = {
      "Accept": "*/*",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      "Content-Type": "application/json"
    }
    
    let bodyContent = JSON.stringify({
      "username":localStorage.getItem("username"),
      "password":localStorage.getItem("password")
    });
    
    let response = await fetch(`${BACKEND_URL}/getdata`, { 
      method: "POST",
      body: bodyContent,
      headers: headersList
    });
    
    let data = await response.json();
    console.log(data);
  
    if("error" in data){
      return navigate("/");
    }
    localStorage.setItem("kanban", data.data);
    setBoards(JSON.parse(data.data));
    return(()=>{
      document.removeEventListener("mousemove",updateBackground);
    });
  },[])

  const [moveState, setMoveState] = useState(false);

  const [targetCard, setTargetCard] = useState({
    bid: "",
    cid: "",
  });

  const [sourceCard, setSourceCard] = useState({
    bid: "",
    cid: "",
  });

  const addboardHandler = (name) => {
    const tempBoards = [...boards];
    tempBoards.push({
      id: Date.now() + Math.random() * 2,
      title: name,
      cards: [],
    });
    setBoards(tempBoards);
  };

  const removeBoard = (id) => {
    const index = boards.findIndex((item) => item.id === id);
    if (index < 0) return;

    const tempBoards = [...boards];
    tempBoards.splice(index, 1);
    setBoards(tempBoards);
  };

  const addCardHandler = (id, title) => {
    const index = boards.findIndex((item) => item.id === id);
    if (index < 0) return;

    const tempBoards = [...boards];
    tempBoards[index].cards.push({
      id: Date.now() + Math.random() * 2,
      title,
      labels: [],
      date: "",
      tasks: [],
    });
    setBoards(tempBoards);
  };

  const removeCard = (bid, cid) => {
    const index = boards.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...boards];
    const cards = tempBoards[index].cards;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    cards.splice(cardIndex, 1);
    setBoards(tempBoards);
  };

  const dragEnded = (bid, cid) => {
    let s_boardIndex, s_cardIndex, t_boardIndex, t_cardIndex;
    s_boardIndex = boards.findIndex((item) => item.id === bid);
    if (s_boardIndex < 0) return;

    s_cardIndex = boards[s_boardIndex]?.cards?.findIndex(
      (item) => item.id === cid
    );
    if (s_cardIndex < 0) return;

    t_boardIndex = boards.findIndex((item) => item.id === targetCard.bid);
    if (t_boardIndex < 0) return;

    if(targetCard.cid === -1){
      const tempBoards = [...boards];
      const sourceCard = tempBoards[s_boardIndex].cards[s_cardIndex];
      tempBoards[s_boardIndex].cards.splice(s_cardIndex, 1);
      tempBoards[t_boardIndex].cards.push(sourceCard);
      setBoards(tempBoards);
      setTargetCard({
        bid: "",
        cid: "",
      });
      return;
    }

    t_cardIndex = boards[t_boardIndex]?.cards?.findIndex(
      (item) => item.id === targetCard.cid
    );
    if (t_cardIndex < 0) return;

    const tempBoards = [...boards];
    const sourceCard = tempBoards[s_boardIndex].cards[s_cardIndex];
    tempBoards[s_boardIndex].cards.splice(s_cardIndex, 1);
    tempBoards[t_boardIndex].cards.splice(t_cardIndex, 0, sourceCard);
    setBoards(tempBoards);

    setTargetCard({
      bid: "",
      cid: "",
    });
  };

  const moveBlock = (bid, cid) => {
    let s_boardIndex, s_cardIndex, t_boardIndex, t_cardIndex;
    s_boardIndex = boards.findIndex((item) => item.id === sourceCard.bid);
    if (s_boardIndex < 0) return;

    s_cardIndex = boards[s_boardIndex]?.cards?.findIndex(
      (item) => item.id === sourceCard.cid
    );
    if (s_cardIndex < 0) return;

    t_boardIndex = boards.findIndex((item) => item.id === bid);
    if (t_boardIndex < 0) return;

    if(cid === -1){
      const tempBoards = [...boards];
      const tempSourceCard = tempBoards[s_boardIndex].cards[s_cardIndex];
      tempBoards[s_boardIndex].cards.splice(s_cardIndex, 1);
      tempBoards[t_boardIndex].cards.push(tempSourceCard);
      setBoards(tempBoards);
      setSourceCard({
        bid: "",
        cid: "",
      });
      return;
    }

    t_cardIndex = boards[t_boardIndex]?.cards?.findIndex(
      (item) => item.id === cid
    );
    if (t_cardIndex < 0) return;

    const tempBoards = [...boards];
    const tempSourceCard = tempBoards[s_boardIndex].cards[s_cardIndex];
    tempBoards[s_boardIndex].cards.splice(s_cardIndex, 1);
    tempBoards[t_boardIndex].cards.splice(t_cardIndex, 0, tempSourceCard);
    setBoards(tempBoards);

    setSourceCard({
      bid: "",
      cid: "",
    });
  };

  const dragEntered = (bid, cid) => {
    if (targetCard.cid === cid) return;
    setTargetCard({
      bid,
      cid,
    });
  };

  const updateCard = (bid, cid, card) => {
    const index = boards.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...boards];
    const cards = tempBoards[index].cards;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    tempBoards[index].cards[cardIndex] = card;

    setBoards(tempBoards);
  };

  useEffect(async () => {
    // console.log(boards)
    if(!!!boards)return;
    let data_string = JSON.stringify(boards);
    let headersList = {
      "Accept": "*/*",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      "Content-Type": "application/json"
    }
    
    let bodyContent = JSON.stringify({
      "username":localStorage.getItem("username"),
      "password":localStorage.getItem("password"),  
      "data":data_string
    });
    
    let response = await fetch(`${BACKEND_URL}/updatedata`, { 
      method: "POST",
      body: bodyContent,
      headers: headersList
    });
    
    let data = await response.json();
    console.log(data);

    if("error" in data){
      return navigate("/");
    }

    localStorage.setItem("kanban", data_string);
  }, [boards]);

  return (
    <div className="app" ref={bgRef}>
      <div className="app_nav">
        <h1 style={{"color":"white"}}>Board</h1>
      </div>
      <div className="app_boards_container">
        <div className="app_boards">
          {!!boards?boards.map((item) => (
            <Board
              key={item.id}
              board={item}
              addCard={addCardHandler}
              removeBoard={() => removeBoard(item.id)}
              removeCard={removeCard}
              dragEnded={dragEnded}
              dragEntered={dragEntered}
              updateCard={updateCard}
              moveState={moveState}
              setMoveState={setMoveState}
              sourceCard={sourceCard}
              setSourceCard={setSourceCard}
              moveBlock={moveBlock}
            />
          )):""}
          <div className="app_boards_last">
            <Editable
              displayClass="app_boards_add-board"
              editClass="app_boards_add-board_edit"
              placeholder="Enter Board Name"
              text="Add Board"
              buttonText="Add Board"
              onSubmit={addboardHandler}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;

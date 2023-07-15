import React, { useState } from "react";
import { MoreHorizontal } from "react-feather";

import Card from "./Card";
import Dropdown from "./Dropdown";
import Editable from "./Editable";
import {EMOJI_LIST} from '../constant'

import "./Board.css";

function  Board(props) {
  const [showDropdown, setShowDropdown] = useState(false);

  

  return (
    <div className="board">
      <div className="board_header">
        <p className="board_header_title" style={{"color":"white"}}>
          {props.board?.title}
          <span>{props.board?.cards?.length || 0}</span>
        </p>
        <div
          className="board_header_title_more"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <MoreHorizontal color="white"/>
          {showDropdown && (
            <Dropdown
              class="board_dropdown"
              onClose={() => setShowDropdown(false)}
            >
              <p onClick={() => {setShowDropdown(false);props.removeBoard()}}>Delete Board</p>
            </Dropdown>
          )}
        </div>
      </div>
      <div className="board_cards custom-scroll">
        <div className="temp"></div>
        <div></div>
        <p>{EMOJI_LIST}</p>
        {props.board?.cards?.map((item) => (
          <div key={item.id}>
            {props.moveState?<div className="drop_area" onDragEnter={() => props.dragEntered(props.board.id, item.id)} 
            onClick={()=>{props.moveBlock(props.board.id, item.id);}}
            >
            </div>:""}
            <Card
              card={item}
              boardId={props.board.id}
              removeCard={props.removeCard}
              dragEntered={props.dragEntered}
              dragEnded={props.dragEnded}
              updateCard={props.updateCard}
              moveState={props.moveState}
              setMoveState={props.setMoveState}
              sourceCard={props.sourceCard}
              setSourceCard={props.setSourceCard}
            />
            
          </div>
        ))}
        {props.moveState?<div className="drop_area" onDragEnter={() => props.dragEntered(props.board.id, -1)}
          onClick={()=>{props.moveBlock(props.board.id, -1);}}
        >
        </div>:""}
        <Editable
          text="+ Add Card"
          placeholder="Enter Card Title"
          displayClass="board_add-card"
          editClass="board_add-card_edit"
          onSubmit={(value) => props.addCard(props.board?.id, value)}
        />
      </div>
    </div>
  );
}

export default Board;

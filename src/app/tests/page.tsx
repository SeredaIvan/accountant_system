"use client"
import { stat } from "fs";
import {  useEffect, useReducer } from "react";

const page = ()=>{

  type State = {count:number,dishIds:number[], weidth:number,computedweidth:number}

type Action =
  | { type: 'updateCount'; payload: number }
  | { type: 'updateDishIds'; payload: number[] }
  | { type: 'computeWeidth' };
function reducer(state: State, action: Action): State {

   switch (action.type) {
    case "updateCount":
      const com ={
        ...state,
        count: state.count + action.payload ,
        computedweidth: state.computedweidth * (state.count+action.payload)
      };
      console.log("com ",com)
      return com;
    case "updateDishIds":
      return{
        ...state,
        dishIds: [...state.dishIds, ...action.payload]
      }
    case "computeWeidth":
      return{
        ...state,
        computedweidth: 0
      }
    default:
      return state; 
  }
  }
  const bam=0
  const initialState:State = 
  {count : 0, dishIds:[1,2,3,4], weidth:60, computedweidth:0}

  const [state, dispatch] = useReducer(reducer,initialState)
    useEffect(()=>{
    console.log("initial " ,initialState)
    dispatch({type:"updateCount",payload:10})
    console.log("dispatch " ,state)
    dispatch({type:"computeWeidth"})
    console.log("computeWeidth " ,state)
  },[bam])
}
export default page
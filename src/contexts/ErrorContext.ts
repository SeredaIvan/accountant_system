import { createContext } from "react";
interface ErrorContextType  {
  errors :string[] |null,
  setErrors: React.Dispatch<React.SetStateAction<string[] | null>>;
} 

const defaultValue:ErrorContextType ={
  errors : null,
  setErrors : () =>{}
}  

const ErrorContext = createContext<ErrorContextType>(defaultValue)
export default  ErrorContext
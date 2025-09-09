import { useMemo, useState } from "react";
import ErrorContext from "@/contexts/ErrorContext";



export function ErrorProvider({children} : {children :React.ReactNode}){
  const [errors,setErrors] = useState<string[]|null>(null)
   
  const value = useMemo(()=>({errors,setErrors}),[errors])

  return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
}
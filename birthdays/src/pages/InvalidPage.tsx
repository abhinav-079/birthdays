import {Link} from"react-router";
import style from "./InvalidPage.module.css"
import { useEffect, useState } from "react";
 
type errorProps={
    message:string,
    messageToken:number | null
}
const InvalidPage=(props:errorProps)=>{
 
const [defaultPage,setDefaultPage]=useState<boolean|null>(null);
const [loading,setLoading]=useState<boolean|null>(true);
useEffect(
    ()=>{
        setTimeout(()=>{setDefaultPage(true)},2000);
        setTimeout(()=>{setLoading(false)},2000)
        
    }
    ,[]
)
/* const senderror=async()=>{
    const err=await axios.get("http://localhost:4000/errorcheck");
    console.log(err)
if(err.data.message=="error found"){
setBackendError(err.data.message);
}
} */

    if(props.messageToken==1){
        return   (
            <>
             
            {defaultPage?
            
                    <div className={style.notfound}>
                <div className={style.notfoundcard}>
                    
                    <h2>{props.message}</h2>
                     
                    <p>
                       
                    </p>
    
                    <Link to="/login" className={style.homebtn}>
                        Go to Login
                    </Link>
                </div>
            </div>
           :
            null
            }
            
            
            
            
           
                
            </>
        )
    }
    else{
        return(
            <>
        {loading?
             null
            :
           
            <div className={style.notfound}>
                <div className={style.notfoundcard}>
                    
                    {props.message?
                    <>
                    <h2>{props.message}</h2>
                    <p>
                        Please Try Again.
                    </p>
                    </>
                    :
                    <>
                    <h2>This Page Doesn't Exist</h2>
                    <p>
                        The page you're looking for might have been removed,
                        renamed, or is temporarily unavailable.
                    </p>
                    </>
                    }
                    
    
                    <Link to="/login" className={style.homebtn}>
                        Go to Login
                    </Link>
                    
                </div>
            </div>
            
        }
        </>
    )
        
    }
}
export {InvalidPage}
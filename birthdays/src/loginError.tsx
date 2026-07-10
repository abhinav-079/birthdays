import style from "./loginError.module.css"
import {Link} from "react-router"
let LoginError=()=>{
    return(
        <div className={style.body}>
        <h4 style={{color:"black",backgroundColor:"white"}}> <Link to={"/login"} className={style.links}>Login</Link></h4>
        
        </div>
    )
}
export{LoginError}
import style from "./loginError.module.css"
import {Link} from "react-router"
const LoginError=()=>{
    return(
        <div className={style.body}>
        <button className={style.goldBtn}> <Link to={"/login"} className={style.links}>Login</Link></button>
        
        </div>
    )
}
export{LoginError}
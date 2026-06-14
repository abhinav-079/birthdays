import { useState,useEffect,useRef } from "react"
 
let Otp=(props)=>{
    console.log(props.stylist.otpInputs);
    let b1=useRef();
    let b2=useRef();
    let b3=useRef();
    let b4=useRef();
   let [values,setValues]=useState([null,null,null,null]);
   let [autoFocus,setFocus]=useState([null,null,null,null]);
   useEffect(()=>{
    if(autoFocus[0]==true){
        b1.current.focus()
    }
    else if(autoFocus[1]==true){
        b2.current.focus()
    }
    else if(autoFocus[2]==true){
        b3.current.focus()
    }
    else if(autoFocus[3]==true){
        b4.current.focus()
    }
},[autoFocus])

useEffect(()=>{
     
    let focusSample=[...autoFocus];
    for(let i=0;i<values.length;i++){
        if(values[i]==null ){
                
                if(i!=0){
                    focusSample[i-1]=null;
                }
                
                focusSample[i]=true;
                setFocus(focusSample);
                return;
                
                 
        }
         
        
    }
    
},[values])
    return(
        


        <>
          {console.log(values)}
          
            <form className={props.stylist.otpForm}>
                <hr></hr>
                <div className={props.stylist.otpInputs}>
                    <input type="number" maxLength={1} required ref={b1} onKeyDown={(e)=>{
                        console.log(e);
                        console.log((e.code).includes("Digit"));
                        if(e.key!="Backspace" && (e.code).includes("Digit")){
                            console.log("hey you blast.")
                            setValues((prev)=>{
                                let sample=[...prev];
                            sample[0]=e.key;
                            
                            return sample;
                            })
                        }
                        else if(e.key=="Backspace"){
                            if(values[0]){
                                setValues((prev)=>{
                                    let sample=[...prev];
                                    sample[0]=null;
                                    return sample;
                                })

                            }
                            else{
                                setFocus((prev)=>{
                                    let sample=[...prev];
                                    sample[0]=true;
                                    sample[1]=null;
                                    sample[2]=null;
                                    sample[3]=null;
                                    return sample;
                                })
                            }
                        }
                        
                        
                    }} value={values[0]} disabled={autoFocus[0]?false:true}
                    className={props.stylist.otpInput}/>


                    <input type="number" maxLength={1} required ref={b2}
                        onKeyDown={(e)=>{
                            
                            if(e.key!="Backspace" && (e.code).includes("Digit")){
                                setValues((prev)=>{
                                    let sample=[...prev];
                                sample[1]=e.key;
                                
                                return sample;
                                })
                            }
                            else if(e.key=="Backspace"){
                                if(values[1]){
                                    setValues((prev)=>{
                                        let sample=[...prev];
                                        sample[1]=null;
                                        return sample;
                                    })
                                    
                                }
                                else{
                                    setFocus((prev)=>{
                                        let sample=[...prev];
                                        sample[0]=true;
                                        sample[1]=null;
                                        sample[2]=null;
                                        sample[3]=null;
                                        return sample;
                                    })
                                    setValues((prev)=>{
                                        let sample=[...prev];
                                        sample[0]=null
                                        return sample;
                                    })
                                }
                            }
                            
                            
                        }}
                        disabled={autoFocus[1]?false:true} value={values[1]} 
                        className={props.stylist.otpInput}/>
                    <input type="number" maxLength={1} required ref={b3} disabled={autoFocus[2]?false:true} onKeyDown={(e)=>{
                            
                            if(e.key!="Backspace" && (e.code).includes("Digit")){
                                setValues((prev)=>{
                                    let sample=[...prev];
                                sample[2]=e.key;
                                
                                return sample;
                                })
                            }
                            else if(e.key=="Backspace"){
                                if(values[2]){
                                    setValues((prev)=>{
                                        let sample=[...prev];
                                        sample[2]=null;
                                        return sample;
                                    })
                                    
                                    
                                }
                                else{
                                    setFocus((prev)=>{
                                        let sample=[...prev];
                                        sample[0]=null;
                                        sample[1]=true;
                                        sample[2]=null;
                                        sample[3]=null;
                                        return sample;
                                    })
                                    setValues((prev)=>{
                                        let sample=[...prev];
                                        sample[1]=null
                                        return sample;
                                    })
                                }
                            }
                            
                            
                        }} value={values[2]}
                        className={props.stylist.otpInput}/>
                    <input type="number" maxLength={1} required ref={b4} disabled={autoFocus[3]?false:true} 
                        onKeyDown={(e)=>{
                            
                            if(e.key!="Backspace" && (e.code).includes("Digit")){
                                setValues((prev)=>{
                                    let sample=[...prev];
                                sample[3]=e.key;
                                
                                return sample;
                                })
                            }
                            else if(e.key=="Backspace"){
                                if(values[3]){
                                    setValues((prev)=>{
                                        let sample=[...prev];
                                        sample[3]=null;
                                        return sample;
                                    })
                                    
                                }
                                else{
                                    setFocus((prev)=>{
                                        let sample=[...prev];
                                        sample[0]=null;
                                        sample[1]=null;
                                        sample[2]=true;
                                        sample[3]=null;
                                        return sample;
                                    })
                                    setValues((prev)=>{
                                        let sample=[...prev];
                                        sample[2]=null
                                        return sample;
                                    })
                                }
                            }
                            
                            
                        }}
                    value={values[3]}
                    className={props.stylist.otpInput}/>
                </div>
                  
            </form>
            
          
        </>
    )
}
export{Otp}
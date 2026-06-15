import { useState,useEffect,useRef } from "react"
 
const Otp=(props:any)=>{
    console.log(props.stylist.otpInputs);
    const b1=useRef<HTMLInputElement | null>(null);
    const b2=useRef<HTMLInputElement | null>(null);
    const b3=useRef<HTMLInputElement | null>(null);
    const b4=useRef<HTMLInputElement | null>(null);
   const [values,setValues]=useState<(string|null)[]>([null,null,null,null]);
   const [autoFocus,setFocus]=useState<(string|null|boolean)[]>([null,null,null,null]);
   useEffect(()=>{
    if(autoFocus[0]==true){
        b1.current?.focus()
    }
    else if(autoFocus[1]==true){
        b2.current?.focus()
    }
    else if(autoFocus[2]==true){
        b3.current?.focus()
    }
    else if(autoFocus[3]==true){
        b4.current?.focus()
    }
    else{ b4.current?.focus()}
},[autoFocus])

useEffect(()=>{
     if(values[0] && values[1] && values[2] && values[3]){
        const otpFinal:string=values[0]+values[1]+values[2]+values[3];
        props.setOtp(otpFinal);
     }
    const focusSample=[...autoFocus];
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
    b4.current?.focus()
    
},[values])
    return(
        


        <>
          {console.log(values)}
          
            <form className={props.stylist.otpForm}>
                <hr></hr>
                <div className={props.stylist.otpInputs}>
                    <input type="text"
                            inputMode="numeric"
                            maxLength={1} required ref={b1} onKeyDown={(e)=>{
                        console.log(e);
                        console.log((e.code).includes("Digit"));
                        if(e.key!="Backspace" && (e.code).includes("Digit")){
                            console.log("hey you blast.")
                            setValues((prev)=>{
                                const sample=[...prev];
                            sample[0]=e.key;
                            
                            return sample;
                            })
                        }
                        else if(e.key=="Backspace"){
                            if(values[0]){
                                setValues((prev)=>{
                                    const sample=[...prev];
                                    sample[0]=null;
                                    return sample;
                                })

                            }
                            else{
                                setFocus((prev)=>{
                                    const sample=[...prev];
                                    sample[0]=true;
                                    sample[1]=null;
                                    sample[2]=null;
                                    sample[3]=null;
                                    return sample;
                                })
                            }
                        }
                        
                        
                    }} value={values[0] ?? ""}  
                    className={props.stylist.otpInput}/>


                    <input type="text"
                            inputMode="numeric"
                            maxLength={1} required ref={b2}
                        onKeyDown={(e)=>{
                            
                            if(e.key!="Backspace" && (e.code).includes("Digit")){
                                setValues((prev)=>{
                                    const sample=[...prev];
                                sample[1]=e.key;
                                
                     return sample;
                                })
                            }
                            else if(e.key=="Backspace"){
                                if(values[1]){
                                    setValues((prev)=>{
                                        const sample=[...prev];
                                        sample[1]=null;
                                        return sample;
                                    })
                                    
                                }
                                else{
                                    setFocus((prev)=>{
                                        const sample=[...prev];
                                        sample[0]=true;
                                        sample[1]=null;
                                        sample[2]=null;
                                        sample[3]=null;
                                        return sample;
                                    })
                                    setValues((prev)=>{
                                        const sample=[...prev];
                                        sample[0]=null
                                        return sample;
                                    })
                                }
                            }
                            
                            
                        }}
                          value={values[1] ?? ""} 
                        className={props.stylist.otpInput}/>
                    <input type="text"
                            inputMode="numeric"
                            maxLength={1} required ref={b3}   onKeyDown={(e)=>{
                            
                            if(e.key!="Backspace" && (e.code).includes("Digit")){
                                setValues((prev)=>{
                                    const sample=[...prev];
                                sample[2]=e.key;
                                
                                return sample;
                                })
                            }
                            else if(e.key=="Backspace"){
                                if(values[2]){
                                    setValues((prev)=>{
                                        const sample=[...prev];
                                        sample[2]=null;
                                        return sample;
                                    })
                                    
                                    
                                }
                                else{
                                    setFocus((prev)=>{
                                        const sample=[...prev];
                                        sample[0]=null;
                                        sample[1]=true;
                                        sample[2]=null;
                                        sample[3]=null;
                                        return sample;
                                    })
                                    setValues((prev)=>{
                                        const sample=[...prev];
                                        sample[1]=null
                                        return sample;
                                    })
                                }
                            }
                            
                            
                        }} value={values[2] ?? ""}
                        className={props.stylist.otpInput}/>
                    <input type="text"
                            inputMode="numeric"
                            maxLength={1} required ref={b4}  
                        onKeyDown={(e)=>{
                            
                            if(e.key!="Backspace" && (e.code).includes("Digit")){
                                setValues((prev)=>{
                                    const sample=[...prev];
                                sample[3]=e.key;
                                
                                return sample;
                                })
                            }
                            else if(e.key=="Backspace"){
                                if(values[3]){
                                    setValues((prev)=>{
                                        const sample=[...prev];
                                        sample[3]=null;
                                        return sample;
                                    })
                                    
                                }
                                else{
                                    setFocus((prev)=>{
                                        const sample=[...prev];
                                        sample[0]=null;
                                        sample[1]=null;
                                        sample[2]=true;
                                        sample[3]=null;
                                        return sample;
                                    })
                                    setValues((prev)=>{
                                        const sample=[...prev];
                                        sample[2]=null
                                        return sample;
                                    })
                                }
                            }
                            
                            
                        }}
                    value={values[3] ?? ""}
                    className={props.stylist.otpInput}/>
                </div>
                  
            </form>
            
          
        </>
    )
}
export{Otp}
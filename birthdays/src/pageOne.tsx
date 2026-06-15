import { useEffect, useState } from "react"
import style from "./pageOne.module.css"
import axios from "axios"
 import {Month} from "./Month"
 import type { FormEvent } from "react";
import { Navigate,useNavigate } from "react-router-dom";
const PageOne=()=>{
    const todayGen=new Date();
    let thisMonth:string|number=0;

    if(((todayGen.getMonth())+1)<10){
        thisMonth=`0${todayGen.getMonth()+1}`
    }

    const today=`${todayGen.getDate()}-${thisMonth}-${todayGen.getFullYear()}`
    const [everyMonthName,setEveryMonthName]=useState<string|null>("");
    const [everyMonthDob,setEveryMonthDob]=useState<string|null>("");
    const [editName,setEditName]=useState<string|null>(null);
    const[everyMonthList,setEveryMonthList]=useState<any>([]);
    const [everyMonthClick,setEveryMonthClick]=useState<boolean|null>(null);
    const [editDob,setEditDob]=useState<string|null|boolean>(null);
    const [editNote,setEditNote]=useState<string|null>(null);
    const[edit,setEdit]=useState<string|boolean|null>(null);
    const [role,setRole]=useState<string>("User");
    const[update,setUpdate]=useState<(null|string)>(null)
    const [,setUsername]=useState<string>("null");
    const [userId,setUserId]=useState<string>("null");
    const [list,setList]=useState<any>([]);
    const[reqList,setReqList]=useState<any>([]);
    const [name,setName]=useState<string>("");
    const [dob,setDob]=useState<(string | null)>("");
    const [note,setNote]=useState<string>("");
    const [login,setLogin]=useState<(null | boolean)>(null);
     const [monthClick,setMonthClick]=useState<(boolean | null)[]>([null,null,null,null,null,null,null,null,null,null,null,null,]);
     const [addBirthday,setAddBirtday]=useState<boolean|null>(null);
const navigate=useNavigate();
      
     
     useEffect(()=>{
        
        const checkLogin=async()=>{
           console.log("Login Check...");
           const token:(string|null)=localStorage.getItem("token");
           console.log(token);
           if(!token){
               setLogin(false);
               
           }
           else{
           const response=await axios.post("https://birthdays-639v.onrender.com/authorise",{
               
                   token
               
           })
          
           const exp=response.data.isVerified.exp;
           const iat=response.data.isVerified.iat;
           
           console.log(response.data);
           setUsername(response.data.isVerified.username);
           setUserId(response.data.isVerified.id);
           setRole(response.data.isVerified.role);
           if(iat<exp){
            setLogin(true);
           }
       }
       
        }
        checkLogin();


        //get-data
        
    },[])

    useEffect(()=>{
        const process=async()=>{
             const token:string|null=localStorage.getItem("token");
             if(!token){
                setUpdate("Login.")
                return;
             }
            const get=await axios.get("https://birthdays-639v.onrender.com/get-data",{
                params:{
                    userId,
                    token
    
                }
            });
             
               /*  */
                if((get.data)==="Please try to login"){
                   setUpdate("Please try to login");
               }
               else if((get.data)==="User not found"){
                   setUpdate("User not found");
               }
            console.log(get.data.get.details);
            const toSetData=get.data.get.details;
            setList(toSetData);
    
           }
           process();
    },[userId])
    useEffect(()=>{
        const process=async()=>{
             const token:string|null=localStorage.getItem("token");
             if(!token){
                setUpdate("Login.")
                return;
             }
            const get=await axios.get("https://birthdays-639v.onrender.com/every-month-data",{
                params:{
                    userId,
                    token
    
                }
            });
             
               /*  */
                if((get.data)==="Please try to login"){
                   setUpdate("Please try to login");
               }
               else if((get.data)==="User not found"){
                   setUpdate("User not found");
               }
            console.log(get.data.get.details);
            const toSetData=get.data.get.everyMonthEvents;
            setEveryMonthList(toSetData);
    
           }
           process();
    },[userId])
     
     useEffect(()=>{
        console.log(userId);
        console.log("Month Clicked");
     },[monthClick])

     const addToList=async()=>{
        setAddBirtday(true);
         
     }
     const editAlert=()=>{
        setUpdate(null);
        
        setTimeout(() => {
            setUpdate("Event Edited, Please refersh page to see changes.");
        }, 0);
     }
     /* const deleteAlert=()=>{
        setUpdate(null);
        
        setTimeout(() => {
            setUpdate("Event Deleted, Please refersh page to see changes.");
        }, 0);
     } */

const saveEveryMonth=async()=>{
    setUpdate(null);
    const nameOfPerson:string=name;
    console.log((dob));
    const token=localStorage.getItem("token")
    const addData=await axios.post("https://birthdays-639v.onrender.com/set-every-month",{
        userId,nameOfPerson,dob,note,token
    })
    console.log(addData);
    if(addData.data!="Please try to login" && addData.data!="User not found")
     {
        setTimeout(() => {
            setUpdate("Please refresh to see changes");
        }, 0);
     }
    /*  */
    else if((addData.data)==="Please try to login"){
        
        setTimeout(() => {
            setUpdate("Please try to login");
        }, 0);
    }
    else if((addData.data)==="User not found"){
        
        setTimeout(() => {
            setUpdate("User not found");
        }, 0);
    }
}
const saveData=async()=>{
    setUpdate(null);
    const nameOfPerson:string=name;
    console.log((dob));
    const token:string|null=localStorage.getItem("token");
    if(token){
        const addData=await axios.post("https://birthdays-639v.onrender.com/add-data",{
            userId,nameOfPerson,dob,note,token
        })
        console.log(addData);
        if(addData.data!="Please try to login" && addData.data!="User not found")
         {
            setTimeout(() => {
                if(nameOfPerson && dob ){
                    setUpdate("Please refresh to see changes");
                }
                
            }, 0);
         }
        /*  */
        else if((addData.data)==="Please try to login"){
            
            setTimeout(() => {
                setUpdate("Please try to login");
            }, 0);
        }
        else if((addData.data)==="User not found"){
            
            setTimeout(() => {
                setUpdate("User not found");
            }, 0);
        }
    }
    
    }
    

 if(login===null){
    return "Session Expired, Please login."
 }
 const sendMails=async()=>{
    const token:string|null=localStorage.getItem("token");
    const sendMail=await axios.get("https://birthdays-639v.onrender.com/send-mail",{
        params:{
            token
        }
    });
    if(sendMail.data==="Only Admins Page"){
        setUpdate("Login as Admin.");
        return;
    }
    console.log(sendMail);
 }

  
    return(
    <>
     
    {login?
        <div className={style.page}>
             

        <header className={style.hero}>
            <div className={style.header}>
            <button className={style.logoutBtn}
            onClick={()=>{
                localStorage.removeItem("token");
                navigate("/login");
            }}
            >Logout</button> 
         {  "   "}
            {(role==="Admin")?<button onClick={sendMails} className={style.logoutBtn}>Send Mails</button>:null}
            </div>
            
            {update?<h1 className={style.alert}>{update}</h1>:null}
           <h1>Event Vault</h1>
           <p>Every celebration in one place</p>

           {/* every month events */}
           <div className={style.monthCard}
            onClick={()=>{
                 setMonthClick(([null,null,null,null,null,null,null,null,null,null,null,null,]));
                setEveryMonthClick(null);
                setTimeout(()=>{
                    setEveryMonthClick(true);
                },0);
               /* let sample=[];
               for(let i=0;i<everyMonthList.length;i++){
                   sample.push(everyMonthList[i]);
               }
               console.log(sample);
               sample.sort((a,b)=>a.dateOfUser-b.dateOfUser); */
               setEveryMonthList(everyMonthList.sort((a:any,b:any)=>a.dateOfUser-b.dateOfUser));
                   
                   
               
                 
          }}
           >Every Month Events{(everyMonthClick)? 
            ', current List' :null}</div>
        </header>
     
        <section className={style.monthGrid}>
     
           <div className={style.monthCard} 
           onClick={()=>{
            setEveryMonthClick(null);
            setMonthClick((prev:(boolean|null)[])=>{
               const sample:(boolean|null)[]=[...prev];
               for(let i=0;i<sample.length;i++){
                  if(i===0){
                      sample[i]=true;
                  }
                  else{
                      sample[i]=null
                  }
               }
                
               return sample;
                
           })
           const sample=[];
           for(let i=0;i<list.length;i++){
               if((list[i].monthOfUser)==(1)){
                   sample.push(list[i]);
               }
           }
           console.log(sample);
           sample.sort((a:any,b:any)=>a.dateOfUser-b.dateOfUser);
           setReqList(sample);
               
               
           
             
      }}>January{(monthClick[0])? 
        ', current month' :null}</div>
           <div className={style.monthCard} onClick={()=>{
                 setEveryMonthClick(null);
                 setMonthClick((prev:(boolean|null)[])=>{
                    const sample:(boolean|null)[]=[...prev];
                    for(let i=0;i<sample.length;i++){
                       if(i===1){
                           sample[i]=true;
                       }
                       else{
                           sample[i]=null
                       }
                    }
                     
                    return sample;
                     
                })
                const sample=[];
                for(let i=0;i<list.length;i++){
                    if((list[i].monthOfUser)==(2)){
                        sample.push(list[i]);
                    }
                }
                console.log(sample);
                sample.sort((a:any,b:any)=>a.dateOfUser-b.dateOfUser);
                setReqList(sample);
                   
                  
            }}>February{(monthClick[1])? 
                ', current month' :null}</div>
           <div className={style.monthCard}
           
           onClick={()=>{
            setEveryMonthClick(null);
            setMonthClick((prev:(boolean|null)[])=>{
               const sample:(boolean|null)[]=[...prev];
               for(let i=0;i<sample.length;i++){
                  if(i===2){
                      sample[i]=true;
                  }
                  else{
                      sample[i]=null
                  }
               }
                
               return sample;
                
           })
           const sample=[];
           for(let i=0;i<list.length;i++){
               if((list[i].monthOfUser)==(3)){
                   sample.push(list[i]);
               }
           }
           console.log(sample);
           sample.sort((a:any,b:any)=>a.dateOfUser-b.dateOfUser);
           setReqList(sample);
               
               
           
             
      }}
           >March{(monthClick[2])? 
            ', current month' :null}</div>
           <div className={style.monthCard}
            onClick={()=>{
                setEveryMonthClick(null);
                setMonthClick((prev:(boolean|null)[])=>{
                   const sample:(boolean|null)[]=[...prev];
                   for(let i=0;i<sample.length;i++){
                      if(i===3){
                          sample[i]=true;
                      }
                      else{
                          sample[i]=null
                      }
                   }
                    
                   return sample;
                    
               })
               const sample=[];
               for(let i=0;i<list.length;i++){
                   if((list[i].monthOfUser)==(4)){
                       sample.push(list[i]);
                   }
               }
               console.log(sample);
               sample.sort((a:any,b:any)=>a.dateOfUser-b.dateOfUser);
               setReqList(sample);
                   
                   
               
                 
          }}
           >April{(monthClick[3])? 
            ', current month' :null}</div>
           <div className={style.monthCard}
            onClick={()=>{
                setEveryMonthClick(null);
                setMonthClick((prev:(boolean|null)[])=>{
                   const sample:(boolean|null)[]=[...prev];
                   for(let i=0;i<sample.length;i++){
                      if(i===4){
                          sample[i]=true;
                      }
                      else{
                          sample[i]=null
                      }
                   }
                    
                   return sample;
                    
               })
               const sample=[];
               for(let i=0;i<list.length;i++){
                   if((list[i].monthOfUser)==(5)){
                       sample.push(list[i]);
                   }
               }
               console.log(sample);
               sample.sort((a:any,b:any)=>a.dateOfUser-b.dateOfUser);
               setReqList(sample);
                   
                   
               
                 
          }}
           >May{(monthClick[4])? 
            ', current month' :null}</div>
           <div className={style.monthCard}
            onClick={()=>{
                setEveryMonthClick(null);
                setMonthClick((prev:(boolean|null)[])=>{
                   const sample:(boolean|null)[]=[...prev];
                   for(let i=0;i<sample.length;i++){
                      if(i===5){
                          sample[i]=true;
                      }
                      else{
                          sample[i]=null
                      }
                   }
                    
                   return sample;
                    
               })
               const sample=[];
               for(let i=0;i<list.length;i++){
                   if((list[i].monthOfUser)==(6)){
                       sample.push(list[i]);
                   }
               }
               console.log(sample);
               sample.sort((a:any,b:any)=>a.dateOfUser-b.dateOfUser);
               setReqList(sample);
                   
                   
               
                 
          }}
           >June{(monthClick[5])? 
            ', current month' :null}</div>
           <div className={style.monthCard}
            onClick={()=>{
                setEveryMonthClick(null);
                setMonthClick((prev:(boolean|null)[])=>{
                   const sample:(boolean|null)[]=[...prev];
                   for(let i=0;i<sample.length;i++){
                      if(i===6){
                          sample[i]=true;
                      }
                      else{
                          sample[i]=null
                      }
                   }
                    
                   return sample;
                    
               })
               const sample=[];
               for(let i=0;i<list.length;i++){
                   if((list[i].monthOfUser)==(7)){
                       sample.push(list[i]);
                   }
               }
               console.log(sample);
               sample.sort((a:any,b:any)=>a.dateOfUser-b.dateOfUser);
               setReqList(sample);
                   
                   
               
                 
          }}
           >July{(monthClick[6])? 
            ', current month' :null}</div>
           <div className={style.monthCard}
            onClick={()=>{
                setEveryMonthClick(null);   
                setMonthClick((prev:(boolean|null)[])=>{
                   const sample:(boolean|null)[]=[...prev];
                   for(let i=0;i<sample.length;i++){
                      if(i===7){
                          sample[i]=true;
                      }
                      else{
                          sample[i]=null
                      }
                   }
                    
                   return sample;
                    
               })
               const sample=[];
               for(let i=0;i<list.length;i++){
                   if((list[i].monthOfUser)==(8)){
                       sample.push(list[i]);
                   }
               }
               console.log(sample);
               sample.sort((a:any,b:any)=>a.dateOfUser-b.dateOfUser);
               setReqList(sample);
                   
                   
               
                 
          }}
           >August{(monthClick[7])? 
            ', current month' :null}</div>
           <div className={style.monthCard}
            onClick={()=>{
                setEveryMonthClick(null);
                setMonthClick((prev:(boolean|null)[])=>{
                   const sample:(boolean|null)[]=[...prev];
                   for(let i=0;i<sample.length;i++){
                      if(i===8){
                          sample[i]=true;
                      }
                      else{
                          sample[i]=null
                      }
                   }
                    
                   return sample;
                    
               })
               const sample=[];
               for(let i=0;i<list.length;i++){
                   if((list[i].monthOfUser)==(9)){
                       sample.push(list[i]);
                   }
               }
               console.log(sample);
               sample.sort((a:any,b:any)=>a.dateOfUser-b.dateOfUser);
               setReqList(sample);
                   
                   
               
                 
          }}
           >September{(monthClick[8])? 
            ', current month' :null}</div>
           <div className={style.monthCard}
            onClick={()=>{
                setEveryMonthClick(null);
                setMonthClick((prev:(boolean|null)[])=>{
                   const sample:(boolean|null)[]=[...prev];
                   for(let i=0;i<sample.length;i++){
                      if(i===9){
                          sample[i]=true;
                      }
                      else{
                          sample[i]=null
                      }
                   }
                    
                   return sample;
                    
               })
               const sample=[];
               for(let i=0;i<list.length;i++){
                   if((list[i].monthOfUser)==(10)){
                       sample.push(list[i]);
                   }
               }
               console.log(sample);
               sample.sort((a:any,b:any)=>a.dateOfUser-b.dateOfUser);
               setReqList(sample);
                   
                   
               
                 
          }}
           >October{(monthClick[9])? 
            ', current month' :null}</div>
           <div className={style.monthCard}
            onClick={()=>{
                setEveryMonthClick(null);
                setMonthClick((prev:(boolean|null)[])=>{
                   const sample:(boolean|null)[]=[...prev];
                   for(let i=0;i<sample.length;i++){
                      if(i===10){
                          sample[i]=true;
                      }
                      else{
                          sample[i]=null
                      }
                   }
                    
                   return sample;
                    
               })
               const sample=[];
               for(let i=0;i<list.length;i++){
                   if((list[i].monthOfUser)==(11)){
                       sample.push(list[i]);
                   }
               }
               console.log(sample);
               sample.sort((a:any,b:any)=>a.dateOfUser-b.dateOfUser);
               setReqList(sample);
                   
                   
               
                 
          }}
           >November{(monthClick[10])? 
            ', current month' :null}</div>
           <div className={style.monthCard}
            onClick={()=>{
                setEveryMonthClick(null);
                setMonthClick((prev:(boolean|null)[])=>{
                   const sample:(boolean|null)[]=[...prev];
                   for(let i=0;i<sample.length;i++){
                      if(i===11){
                          sample[i]=true;
                      }
                      else{
                          sample[i]=null
                      }
                   }
                    
                   return sample;
                    
               })
               const sample=[];
               for(let i=0;i<list.length;i++){
                   if((list[i].monthOfUser)==(12)){
                       sample.push(list[i]);
                   }
               }
               console.log(sample);
               sample.sort((a:any,b:any)=>a.dateOfUser-b.dateOfUser);
               setReqList(sample);
                   
                   
               
                 
          }}
           >December{(monthClick[11])? 
            ', current month' :null}</div>
     
        </section>
        {/* display of the events */}
        {everyMonthClick?
            <>
            {everyMonthList.map((element:any,index:any)=>{
            return (
    <>
    <div className={style.data}>
                        
                        <h3>{element.nameOfPerson}</h3>

                        <p className={style.date}>
                            🎂 {element.dateOfUser}-Every Month-{element.yearOfUser}
                            {(`${element.dateOfUser}-${element.monthOfUser}-${element.yearOfUser}`==today)?"/   Today":null}
                        </p>

                        <p className={style.note}>
                            {element.note}
                        </p>
                        <button className={style.goldBtn} 
                            onClick={()=>{
                                setEdit(false);
                                setEditName(element.nameOfPerson);
                                setEdit(element.id);

                            }}
                        >Edit </button>
                          
                        <button   onClick={async()=>{
                                console.log(everyMonthList);
                                const sample=[...(everyMonthList)];
                                console.log(index);
                                sample.splice(index,1);
                                console.log(sample);
                                setEveryMonthList(sample);
                                const editId=element.id;
                                
                                const token=localStorage.getItem("token");
                                const deleteRequest=await axios.put("https://birthdays-639v.onrender.com/delete-every-month-event",{
                                    userId,editId,token
                                });
                                console.log(deleteRequest);
    
                                 
    
                            }} className={style.goldBtn}>Delete</button>

                            <hr>
                            </hr>
                            {(edit==element.id)?
                                <>
                                <form onSubmit={async(e)=>{
                                    e.preventDefault();
                                    console.log("editDone");
                                    const nameOfPersonId=element.id;
                                    const editReq=await axios.put("https://birthdays-639v.onrender.com/edit-every-month-event",{
                                        nameOfPersonId,
                                        userId:userId,
                                        editName:editName,
                                        editDob:editDob,
                                        editNote:editNote,
                                        token:localStorage.getItem("token"),
                                        


                                    });
                                    console.log(editReq)
                                     

                                }} className={style.formCard}>

                                    <input type="text" placeholder={`previous Name: ${element.nameOfPerson}`} value={editName ?? ""} onChange={(e)=>{
                                        setEveryMonthName(e.target.value || editName)
                                        setEditName(e.target.value)
                                    }} required/>
                                    <input type="date" value={element.dob} onChange={(e)=>{
                                        setEveryMonthDob(e.target.value)
                                        setEditDob(e.target.value);
                                    }} required/>
                                    <textarea placeholder={`Previous Note: ${element.note}`} onChange={(e)=>{
                                        setEditNote(e.target.value);
                                    }}>{element.note}</textarea>
                                    <button onClick={()=>{
                                         
                                        console.log("clicked edit button")
                                        if((everyMonthName ) &&everyMonthDob){
                                            editAlert();
                                        }
                                        
                                    }} className={style.goldBtn}>Confirm Changes</button>
                                </form>
                                </>
                            :null}
     </div>
     
    </>
)
})}
            </>
        
            :
            null
        }
        {(monthClick[0])?
        
        <>
            {reqList.map((element:any,index:any)=>{

                console.log(element);
                return (
                    <>
                      <Month style={style} element={element} setEdit={setEdit} setEditName={setEditName} setEditDob={setEditDob} setEditNote={setEditNote} reqList={reqList} index={index} userId={userId}
                      editName={editName} editDob={editDob} editNote={editNote} today={today} edit={edit} setReqList={setReqList}  editAlert={editAlert} month="January"/>
                    {/* <div className={style.data}>
                        
                        <h3>{element.nameOfPerson}</h3>

                        <p className={style.date}>
                            🎂 {element.dateOfUser}-January-{element.yearOfUser}
                            {(`${element.dateOfUser}-${element.monthOfUser}-${element.yearOfUser}`==today)?"(Today)":null}
                        </p>

                        <p className={style.note}>
                            {element.note}
                        </p>
                        <button className={style.goldBtn} 
                            onClick={()=>{
                                setEdit(false);
                                setEditName(element.nameOfPerson);
                                setEdit(element.id);

                            }}
                        >Edit </button>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M304.62-160q-26.85 0-45.74-18.88Q240-197.77 240-224.62V-720h-40v-40h160v-30.77h240V-760h160v40h-40v495.38q0 27.62-18.5 46.12Q683-160 655.38-160H304.62ZM680-720H280v495.38q0 10.77 6.92 17.7 6.93 6.92 17.7 6.92h350.76q9.24 0 16.93-7.69 7.69-7.69 7.69-16.93V-720ZM392.31-280h40v-360h-40v360Zm135.38 0h40v-360h-40v360ZM280-720v520-520Z" onClick={async()=>{
                                console.log(reqList);
                                let sample=[...reqList];
                                console.log(index);
                                sample.splice(index,1);
                                console.log(sample);
                                setReqList(sample);
                                let editId=element.id;
                                let token=localStorage.getItem("token");
                                let deleteRequest=await axios.put("http://localhost:4000/delete-event",{
                                    userId,editId,token
                                });
    
                                 
    
                            }}/></svg>

                            <hr>
                            </hr>
                            {(edit==element.id)?
                                <>
                                <form onSubmit={async(e)=>{
                                    e.preventDefault();
                                    console.log("editDone");
                                    let nameOfPersonId=element.id;
                                    let editReq=await axios.put("http://localhost:4000/edit-event",{
                                        nameOfPersonId,
                                        userId,
                                        editName,
                                        editDob,
                                        editNote,
                                        token:localStorage.getItem("token"),
                                        


                                    });
                                     

                                }}>

                                    <input type="text" placeholder={`previous Name: ${element.nameOfPerson}`} value={editName} onChange={(e)=>{
                                        setEditName(e.target.value)
                                    }} required/>
                                    <input type="date" value={element.dob} onChange={(e)=>{
                                        setEditDob(e.target.value);
                                    }} required/>
                                    <textarea placeholder={`Previous Note: ${element.note}`} onChange={(e)=>{
                                        setEditNote(e.target.value);
                                    }}>{element.note}</textarea>
                                    <button >Confirm Changes</button>
                                </form>
                                </>
                            :null}
                    </div> */}
                    </>
                )
                
            })}
        </>
        :
        null
    }
        {(monthClick[1])?
        
            <>
                {reqList.map((element:any,index:any)=>{

                    console.log(element);
                    return (
                        <>
                         <Month style={style} element={element} setEdit={setEdit} setEditName={setEditName} setEditDob={setEditDob} setEditNote={setEditNote} reqList={reqList} index={index} userId={userId}
                      editName={editName} editDob={editDob} editNote={editNote} today={today} edit={edit} setReqList={setReqList} editAlert={editAlert} month="February"/>
                         
                        </>
                    )
                    
                })}
            </>
            :
            null
        }
        {(monthClick[2])?
        
        <>
            {reqList.map((element:any,index:any)=>{

                console.log(element);
                return (
                    <>
                     <Month style={style} element={element} setEdit={setEdit} setEditName={setEditName} setEditDob={setEditDob} setEditNote={setEditNote} reqList={reqList} index={index} userId={userId}
                      editName={editName} editDob={editDob} editNote={editNote} today={today} edit={edit} setReqList={setReqList} editAlert={editAlert} month="March"/>
                     
                    </>
                )
                
            })}
        </>
        :
        null
    }

{(monthClick[3])?
        
        <>
            {reqList.map((element:any,index:any)=>{

                console.log(element);
                return (
                    <>
                     
                     <Month style={style} element={element} setEdit={setEdit} setEditName={setEditName} setEditDob={setEditDob} setEditNote={setEditNote} reqList={reqList} index={index} userId={userId}
                      editName={editName} editDob={editDob} editNote={editNote} today={today} edit={edit} setReqList={setReqList} editAlert={editAlert} month="April"/>
                    </>
                )
                
            })}
        </>
        :
        null
    }
    {(monthClick[4])?
        
        <>
            {reqList.map((element:any,index:any)=>{

                console.log(element);
                return (
                    <>
                     
                     <Month style={style} element={element} setEdit={setEdit} setEditName={setEditName} setEditDob={setEditDob} setEditNote={setEditNote} reqList={reqList} index={index} userId={userId}
                      editName={editName} editDob={editDob} editNote={editNote} today={today} edit={edit} setReqList={setReqList} editAlert={editAlert} month="May"/>
                    </>
                )
                
            })}
        </>
        :
        null
    }
    {(monthClick[5])?
        
        <>
            {reqList.map((element:any,index:any)=>{

                console.log(element);
                return (
                    <>
                     
                     <Month style={style} element={element} setEdit={setEdit} setEditName={setEditName} setEditDob={setEditDob} setEditNote={setEditNote} reqList={reqList} index={index} userId={userId}
                      editName={editName} editDob={editDob} editNote={editNote} today={today} edit={edit} setReqList={setReqList} editAlert={editAlert} month="June"/>
                    </>
                )
                
            })}
        </>
        :
        null
    }
    {(monthClick[6])?
        
        <>
            {reqList.map((element:any,index:any)=>{

                console.log(element);
                return (
                    <>
                     
                     <Month style={style} element={element} setEdit={setEdit} setEditName={setEditName} setEditDob={setEditDob} setEditNote={setEditNote} reqList={reqList} index={index} userId={userId}
                      editName={editName} editDob={editDob} editNote={editNote} today={today} edit={edit} setReqList={setReqList} editAlert={editAlert} month="July"/>
                    </>
                )
                
            })}
        </>
        :
        null
    }
    {(monthClick[7])?
        
        <>
            {reqList.map((element:any,index:any)=>{

                console.log(element);
                return (
                    <>
                     
                     <Month style={style} element={element} setEdit={setEdit} setEditName={setEditName} setEditDob={setEditDob} setEditNote={setEditNote} reqList={reqList} index={index} userId={userId}
                      editName={editName} editDob={editDob} editNote={editNote} today={today} edit={edit} setReqList={setReqList} editAlert={editAlert}  month="August"/>
                    </>
                )
                
            })}
        </>
        :
        null
    }
    {(monthClick[8])?
        
        <>
            {reqList.map((element:any,index:any)=>{

                console.log(element);
                return (
                    <>
                     
                     <Month style={style} element={element} setEdit={setEdit} setEditName={setEditName} setEditDob={setEditDob} setEditNote={setEditNote} reqList={reqList} index={index} userId={userId}
                      editName={editName} editDob={editDob} editNote={editNote} today={today} edit={edit} setReqList={setReqList} editAlert={editAlert} month="September"/>
                    </>
                )
                
            })}
        </>
        :
        null
    }
    {(monthClick[9])?
        
        <>
            {reqList.map((element:any,index:any)=>{

                console.log(element);
                return (
                    <>
                     
                     <Month style={style} element={element} setEdit={setEdit} setEditName={setEditName} setEditDob={setEditDob} setEditNote={setEditNote} reqList={reqList} index={index} userId={userId}
                      editName={editName} editDob={editDob} editNote={editNote} today={today} edit={edit} setReqList={setReqList} editAlert={editAlert} month="October"/>
                    </>
                )
                
            })}
        </>
        :
        null
    }
    {(monthClick[10])?
        
        <>
            {reqList.map((element:any,index:any)=>{

                console.log(element);
                return (
                    <>
                     
                     <Month style={style} element={element} setEdit={setEdit} setEditName={setEditName} setEditDob={setEditDob} setEditNote={setEditNote} reqList={reqList} index={index} userId={userId}
                      editName={editName} editDob={editDob} editNote={editNote} today={today} edit={edit} setReqList={setReqList} editAlert={editAlert} month="November"/>
                    </>
                )
                
            })}
        </>
        :
        null
    }
    {(monthClick[11])?
        
        <>
            {reqList.map((element:any,index:any)=>{

                console.log(element);
                return (
                    <>
                     
                     <Month style={style} element={element} setEdit={setEdit} setEditName={setEditName} setEditDob={setEditDob} setEditNote={setEditNote} reqList={reqList} index={index} userId={userId}
                      editName={editName} editDob={editDob} editNote={editNote} today={today} edit={edit} setReqList={setReqList} editAlert={editAlert} month="December"/>
                    </>
                )
                
            })}
        </>
        :
        null
    }
        <button onClick={addToList} className={style.goldBtn}>Add To List</button>
        <br />
        <hr />
        {addBirthday?
        
            <>
                
                    <form onSubmit={(e:FormEvent<HTMLFormElement>)=>{
                        e.preventDefault();
                        
                    }}>
                     <div className={style.formCard}>
                        <input type="text" placeholder="Enter Name"
                        onChange={(e)=>{
                            setName(e.target.value);
                        } 
                        }
                        pattern="[A-Z a-z 0-9]+"
                        
                        required/>
                        <input type="date" placeholder="Enter DOB"
                            onChange={(e)=>{
                                console.log(e.target.value);
                                setDob(e.target.value);
                            }}
                            pattern="[0-9]{2}/[0-9]{2}/[0-9]{4}"
                            required></input>
                        <textarea placeholder="Enter Note" onChange={(e)=>{
                            setNote(e.target.value);
                        }}
                        
                        ></textarea>
                        <button   className={style.goldBtn} onClick={saveData}>Save</button>
                        <button onClick={saveEveryMonth} className={style.goldBtn}>Save Every Month</button>
                     </div>
                    </form>
                
            </>
            :
            null
        }
        
        


         
            
     </div>
     :
     <>
     {console.log(login)}
     <Navigate to="/login"></Navigate>
     </>
   }
     </>
    )
    
}

export{PageOne}
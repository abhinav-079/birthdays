import { useEffect, useState } from "react"
import style from "./pageOne.module.css"
import axios from "axios"
 import {Month} from "../component/Month"
 import type { FormEvent } from "react";
 import { InvalidPage } from "./InvalidPage";
import { Navigate, useNavigate } from "react-router-dom";
 
const PageOne=()=>{
    interface memory{
        fileName:string,
        uploadTimeLine:string
    }
    interface element {
        id: string;
        profile: string;
        nameOfPerson: string;
        yearOfUser: number;
        monthOfUser: number;
        dateOfUser: number;
        memories: memory[];
        note: string | null;
    }
    const todayGen=new Date();
    let thisMonth:string|number=0;
let currentDay:string|number=todayGen.getDate();
    if(((todayGen.getMonth())+1)<10){
        thisMonth=`0${todayGen.getMonth()+1}`
    }
    if((todayGen.getDate())<10){
        currentDay='0'+currentDay;
    }
    console.log(currentDay," Current Day");
const [everyMonthProfile,setEveryMonthProfile]=useState<string|null|File>(null);
    const today=`${currentDay}-${thisMonth}-${todayGen.getFullYear()}`
    const [everyMonthName,setEveryMonthName]=useState<string|null>("");
    const [everyMonthDob,setEveryMonthDob]=useState<string|null>("");
    const [editName,setEditName]=useState<string|null>(null);
    const[everyMonthList,setEveryMonthList]=useState<element[]>([]);
    const [everyMonthClick,setEveryMonthClick]=useState<boolean|null>(null);
    const [editDob,setEditDob]=useState<string|null>(null);
    const [editNote,setEditNote]=useState<string|null>(null);
    const[edit,setEdit]=useState<string|null>(null);
    const [role,setRole]=useState<string>("User");
    const[update,setUpdate]=useState<(null|string)>(null)
    const [,setUsername]=useState<string>("null");
    const [userId,setUserId]=useState<string>("null");
    const [list,setList]=useState<element[]>([]);
    const[reqList,setReqList]=useState<element[]>([]);
    const [name,setName]=useState<string>("");
    const [dob,setDob]=useState<(string | null)>("");
    const [note,setNote]=useState<string>("");
     const [delete2,setDelete2]=useState<boolean|null>(null);
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
                setUpdate("Login To Access.")
                return "login to access";
             }
            const get=await axios.get("https://birthdays-639v.onrender.com/get-data",{
                params:{
                    userId,
                    token
    
                }
            });
             
               /*  */
                if((get.data)==="Please try to login"){
                    <InvalidPage message="Please try to login" messageToken={null}/>
                   /* setUpdate("Please try to login"); */
               }
               else if((get.data)==="User not found"){
                   /* setUpdate("User not found"); */
                   <InvalidPage message="User not found" messageToken={null}/>
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
                <InvalidPage message="Login To Access." messageToken={null}/>
                /* setUpdate("Login To Access.") */
                return "login first";
             }
            const get=await axios.get("https://birthdays-639v.onrender.com/every-month-data",{
                params:{
                    userId,
                    token
    
                }
            });
             
               /*  */
                if((get.data)==="Please try to login"){
                    <InvalidPage message="Please try to login" messageToken={null}/>
                   /* setUpdate("Please try to login"); */
               }
               else if((get.data)==="User not found"){
                <InvalidPage message="User not found" messageToken={null}/>
                  /*  setUpdate("User not found"); */
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
     const editAlert=(msg:string)=>{
        setUpdate(null);
        
        setTimeout(() => {
            setUpdate(msg);
        }, 0);
     }
     /* const deleteAlert=()=>{
        setUpdate(null);
        
        setTimeout(() => {
            setUpdate("Event Deleted, Please refersh page to see changes.");
        }, 0);
     } */

const saveEveryMonth=async()=>{
    const formData=new FormData();
    setUpdate(null);
    const nameOfPerson:string=name;
    console.log((everyMonthProfile));
    const token=localStorage.getItem("token");
    if(userId){
        formData.append("userId",userId);
    }
   
    if(everyMonthProfile!=null){
        formData.append("file",everyMonthProfile);
    }
    if(nameOfPerson)
    {formData.append("nameOfPerson",nameOfPerson);}
    if(dob){formData.append("dob",dob);}
    
    if(note!=null){
        formData.append("note",note);
    }
    if(token!=null){
        formData.append("token",token);
    }
    
    
    
    const addData=await axios.post("https://birthdays-639v.onrender.com/set-every-month",
        formData
    )
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
            <InvalidPage message="Please try to login" messageToken={null}/>
            /* setUpdate("Please try to login"); */
        }, 0);
    }
    else if((addData.data)==="User not found"){
        
        setTimeout(() => {
            <InvalidPage message="User not found" messageToken={null}/>
           /*  setUpdate("User not found"); */
        }, 0);
    }
}
 
    

 /* if(login===null){
    return "Session Expired, Please login."
 } */
 const sendMails=async()=>{
    const token:string|null=localStorage.getItem("token");

    if(token){
        const sendMail=await axios.get("https://birthdays-639v.onrender.com/send-mail",{
            params:{
                token
            }
        });
        if(sendMail.data==="Only Admins Page"){
            <InvalidPage message="Login As Admin" messageToken={null}/>
            return "login as admin";
        }
        console.log(sendMail);
    }
    else{
        <InvalidPage message="Login." messageToken={null}/>
        return "Login."
    }
    
    
 }

  if(login===null){
    return <InvalidPage message="Session Timed Out. Please Login Again." messageToken={1}/>
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
            {(role==="Admin")?<button onClick={()=>{
                sendMails();
                editAlert("Today Mails Sent.")
            }} className={style.logoutBtn}>Send Mails</button>:null}
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
               setEveryMonthList(everyMonthList.sort((a:element,b:element)=>a.dateOfUser-b.dateOfUser));
                   
                   
               
                 
          }}
           >Every Month Events{(everyMonthClick)? 
            `, current month, Please scroll down. (${everyMonthList.length})` :null}</div>
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
           sample.sort((a:element,b:element)=>a.dateOfUser-b.dateOfUser);
           setReqList(sample);
               
               
           
             
      }}>January{(monthClick[0])? 
        `, current month, Please scroll down. (${reqList.length})` :null}</div>
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
                sample.sort((a:element,b:element)=>a.dateOfUser-b.dateOfUser);
                setReqList(sample);
                   
                  
            }}>February{(monthClick[1])? 
                `, current month, Please scroll down. (${reqList.length})` :null}</div>
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
           sample.sort((a:element,b:element)=>a.dateOfUser-b.dateOfUser);
           setReqList(sample);
               
               
           
             
      }}
           >March{(monthClick[2])? 
            `, current month, Please scroll down. (${reqList.length})` :null}</div>
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
               sample.sort((a:element,b:element)=>a.dateOfUser-b.dateOfUser);
               setReqList(sample);
                   
                   
               
                 
          }}
           >April{(monthClick[3])? 
            `, current month, Please scroll down. (${reqList.length})` :null}</div>
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
               sample.sort((a:element,b:element)=>a.dateOfUser-b.dateOfUser);
               setReqList(sample);
                   
                   
               
                 
          }}
           >May{(monthClick[4])? 
            `, current month, Please scroll down. (${reqList.length})` :null}</div>
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
               sample.sort((a:element,b:element)=>a.dateOfUser-b.dateOfUser);
               setReqList(sample);
                   
                   
               
                 
          }}
           >June{(monthClick[5])? 
            `, current month, Please scroll down. (${reqList.length})` :null}</div>
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
               sample.sort((a:element,b:element)=>a.dateOfUser-b.dateOfUser);
               setReqList(sample);
                   
                   
               
                 
          }}
           >July{(monthClick[6])? 
            `, current month, Please scroll down. (${reqList.length})` :null}</div>
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
               sample.sort((a:element,b:element)=>a.dateOfUser-b.dateOfUser);
               setReqList(sample);
                   
                   
               
                 
          }}
           >August{(monthClick[7])? 
            `, current month, Please scroll down. (${reqList.length})` :null}</div>
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
               sample.sort((a:element,b:element)=>a.dateOfUser-b.dateOfUser);
               setReqList(sample);
                   
                   
               
                 
          }}
           >September{(monthClick[8])? 
            `, current month, Please scroll down. (${reqList.length})` :null}</div>
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
               sample.sort((a:element,b:element)=>a.dateOfUser-b.dateOfUser);
               setReqList(sample);
                   
                   
               
                 
          }}
           >October{(monthClick[9])? 
            `, current month, Please scroll down. (${reqList.length})` :null}</div>
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
               sample.sort((a:element,b:element)=>a.dateOfUser-b.dateOfUser);
               setReqList(sample);
                   
                   
               
                 
          }}
           >November{(monthClick[10])? 
            `, current month, Please scroll down. (${reqList.length})` :null}</div>
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
               sample.sort((a:element,b:element)=>a.dateOfUser-b.dateOfUser);
               setReqList(sample);
                   
                   
               
                 
          }}
           >December{(monthClick[11])? 
            `, current month, Please scroll down. (${reqList.length})` :null}</div>
     
        </section>
        {/* display of the events */}
        

        {everyMonthClick?
            <>
            {everyMonthList.map((element:element,index:number)=>{
            return (
    <>
    <div className={style.data}>
    <div  className={style.eventHeader}>
                         
                        
                        {(element.profile)?
              <div className={style.profileAvatar}>
              <img src={element.profile} ></img>
              </div>
          
  
              :
               
              <div className={style.commentAvatar}>
                  {element.nameOfPerson.charAt(0).toUpperCase()}
              </div>
               
          } 
          <h3 className={style.h3}>{element.nameOfPerson}</h3>
          </div>

                        <p className={style.date}>
                             {element.dateOfUser}-Every Month
                            {(`${element.dateOfUser}`==currentDay)?"/   Today":null}
                        </p>

                        <p className={style.note}>
                            {element.note}
                        </p>
                        <button className={style.goldBtn} 
                            onClick={()=>{
                                setEdit(null);
                                setEditName(element.nameOfPerson);
                                setEdit(element.id);

                            }}
                        >Edit </button>
                          <button className={style.deleteBtn1} onClick={()=>{
                            setDelete2(true);
                          }}>Delete</button>
                          {delete2?
                          <>
                          <br />
                            <button className={style.cancelBtn} onClick={()=>{
                                setDelete2(false)
                            }}>cancel</button>
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
                                if(deleteRequest.data.error){
                                    <InvalidPage message={deleteRequest.data.message} messageToken={null}/>
                                }
                                console.log(deleteRequest);

                                

                            }} className={style.delete}>Confirm Delete</button>
                        </>
                        :null
                            }
                        

                            <hr>
                            </hr>
                            {(edit==element.id)?
                                <>
                                <div className={style.formCard}>
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
                                    if(editReq.data.error){
                                        <InvalidPage message={editReq.data.message} messageToken={null}/>
                                    }
                                    console.log(editReq)
                                     

                                }}  >

                                    <input type="text" placeholder={`previous Name: ${element.nameOfPerson}`} value={editName ?? ""} onChange={(e)=>{
                                        setEveryMonthName(e.target.value || editName)
                                        setEditName(e.target.value)
                                    }} required/>
                                    <input type="date"   onChange={(e)=>{
                                        setEveryMonthDob(e.target.value)
                                        setEditDob(e.target.value);
                                    }} required/>
                                    <textarea placeholder={`Previous Note: ${element.note}`} onChange={(e)=>{
                                        setEditNote(e.target.value);
                                    }}>{element.note}</textarea>
                                    <button onClick={()=>{
                                         
                                        console.log("clicked edit button")
                                        if((everyMonthName || editName) &&everyMonthDob){
                                            editAlert("Event Edited, Please refersh the page to see changes.");
                                        }
                                        
                                    }} className={style.goldBtn}>Confirm Changes</button>
                                </form>
                                </div> 
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
            {reqList.map((element:element,index:number)=>{

                console.log(element);
                return (
                    <>
                     <Month  element={element} setEdit={setEdit} setEditName={setEditName} setEditDob={setEditDob} setEditNote={setEditNote} reqList={reqList} index={index} userId={userId}
                  editName={editName} editDob={editDob} editNote={editNote} today={today} edit={edit} setReqList={setReqList} editAlert={editAlert} month="January"/>
                     
                    </>
                )
                
            })}
        </>
        :
        null
    }
        {(monthClick[1])?
        
            <>
                {reqList.map((element:element,index:number)=>{

                    console.log(element);
                    return (
                        <>
                         <Month  element={element} setEdit={setEdit} setEditName={setEditName} setEditDob={setEditDob} setEditNote={setEditNote} reqList={reqList} index={index} userId={userId}
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
            {reqList.map((element:element,index:number)=>{

                console.log(element);
                return (
                    <>
                     <Month  element={element} setEdit={setEdit} setEditName={setEditName} setEditDob={setEditDob} setEditNote={setEditNote} reqList={reqList} index={index} userId={userId}
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
            {reqList.map((element:element,index:number)=>{

                console.log(element);
                return (
                    <>
                     
                     <Month  element={element} setEdit={setEdit} setEditName={setEditName} setEditDob={setEditDob} setEditNote={setEditNote} reqList={reqList} index={index} userId={userId}
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
            {reqList.map((element:element,index:number)=>{

                console.log(element);
                return (
                    <>
                     
                     <Month  element={element} setEdit={setEdit} setEditName={setEditName} setEditDob={setEditDob} setEditNote={setEditNote} reqList={reqList} index={index} userId={userId}
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
            {reqList.map((element:element,index:number)=>{

                console.log(element);
                return (
                    <>
                     
                     <Month  element={element} setEdit={setEdit} setEditName={setEditName} setEditDob={setEditDob} setEditNote={setEditNote} reqList={reqList} index={index} userId={userId}
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
            {reqList.map((element:element,index:number)=>{

                console.log(element);
                return (
                    <>
                     
                     <Month  element={element} setEdit={setEdit} setEditName={setEditName} setEditDob={setEditDob} setEditNote={setEditNote} reqList={reqList} index={index} userId={userId}
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
            {reqList.map((element:element,index:number)=>{

                console.log(list,"----",element);
                for(let i=0;i<list.length;i++){
                    if((list[i]).id==element.id){
                        index=i;
                    }
                }
                console.log(index);
                return (
                    <>
                     {console.log("style ",(style),"element ",(element),"setEdit ",typeof(setEdit),"setEditName ",typeof(setEditName),"setEditdob ",typeof(setEditDob),"seteditnote ",typeof(setEditNote),"reqList ",(reqList),"index ",typeof(index),"userID ",typeof(userId),"editname ",(editName)," editdob ",typeof(editDob),"editnote ",typeof(editNote),"today ",typeof(today),"edit ",typeof(edit),"setREqlist",typeof(setReqList),"editAlert ",typeof(editAlert) )}
                     <Month  element={element} setEdit={setEdit} setEditName={setEditName} setEditDob={setEditDob} setEditNote={setEditNote} reqList={reqList} index={index} userId={userId}
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
            {reqList.map((element:element,index:number)=>{

                console.log(element);
                return (
                    <>
                     
                     <Month  element={element} setEdit={setEdit} setEditName={setEditName} setEditDob={setEditDob} setEditNote={setEditNote} reqList={reqList} index={index} userId={userId}
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
            {reqList.map((element:element,index:number)=>{

                console.log(element);
                return (
                    <>
                     
                     <Month  element={element} setEdit={setEdit} setEditName={setEditName} setEditDob={setEditDob} setEditNote={setEditNote} reqList={reqList} index={index} userId={userId}
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
            {reqList.map((element:element,index:number)=>{

                console.log(reqList);
                return (
                    <>
                     
                     <Month  element={element} setEdit={setEdit} setEditName={setEditName} setEditDob={setEditDob} setEditNote={setEditNote} reqList={reqList} index={index} userId={userId}
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
            {reqList.map((element:element,index:number)=>{

                console.log(element);
                return (
                    <>
                     
                     <Month  element={element} setEdit={setEdit} setEditName={setEditName} setEditDob={setEditDob} setEditNote={setEditNote} reqList={reqList} index={index} userId={userId}
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
            <div className={style.formSetter}>
                <div className={style.formCard}>
                    <form onSubmit={async(e:FormEvent<HTMLFormElement>)=>{
                        e.preventDefault();
                        console.log("Prevented Default");
                        const form=e.target as HTMLFormElement;
                        console.log(e);
                        const file=((form[3] as HTMLInputElement).files?.[0]);
                         
                        const formData=new FormData();
                        if(file){
                            console.log(file)
                            setEveryMonthProfile(file);
                        }
                        
                        formData.append("userId",userId);
                        
                        setUpdate(null);
                        const nameOfPerson:string=name;
                        console.log((dob));
                        const token:string|null=localStorage.getItem("token");
                        console.log(token)
                        if(token){
                            if(nameOfPerson){
                                formData.append("nameOfPerson",nameOfPerson);
                            }
                            if(dob){
                                formData.append("dob",dob);
                            }
                            
                        if(file){
                            formData.append("file",file);
                        }
                       if(token){
                        formData.append("token",token);
                       }
                        if(note){
                            formData.append("note",note);
                        }
                        
                        console.log(file,formData.get("token"))
                         
                            const addData=await axios.post("https://birthdays-639v.onrender.com/add-data",formData)
                            console.log(addData);
                            if(addData.data.error){
                                <InvalidPage message={addData.data.message} messageToken={null}/>
                            }
                            
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
                        
                                                    
                                            
                    }}   className={style.form}>
                     
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
                             
                            required></input>
                        <textarea placeholder="Enter Note" onChange={(e)=>{
                            setNote(e.target.value);

                        }}
                        
                        ></textarea>
                         
                                    
                                     
                                    
                                     
                                    <input type="file"  name="file" formEncType="multipart/form-data" className={ style.monthCard} onChange={(e)=>{console.log(e);
                                    const file = e.target.files?.[0] ;
                                        console.log(file);
                                        if(file){
                                            setEveryMonthProfile(file);
                                        }
                                      
                                    }}/>
                                     
                                 
                                 
                        <button   className={style.goldBtn}  >Save</button>
                        </form>
                        <hr />
                        <span className={style.formCard}>
                        <button onClick={saveEveryMonth} className={style.goldBtn}  >Save Every Month</button>
                        </span>
                     </div>
                    
            </div>   
            </>
            :
            null
        }
        
        


         
            
     </div>
     :
     <> 
     {console.log(setTimeout(()=>{return("<LoginForm/>")},1000))}
     <Navigate to="/login"></Navigate>
      
     
     </>
   }
     </>
    )
    
}

export{PageOne}
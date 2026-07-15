 import axios from "axios";
 import { useState, type FormEvent } from "react";
 
 type MonthProps = {
    style: any;
    element: any;
    setEdit: any;
    setEditName: any;
    setEditDob: any;
    setEditNote: any;
    reqList: any;
    index: number;
    userId: string;
    editName: any;
    editDob: any;
    editNote: any;
    today: string;
    edit: any;
    setReqList: any;
    editAlert: () => void;
    month: string;
  };
  
   
 const Month=(props:MonthProps)=>{
    const [name,setName]=useState<string|null>("");
    const [dob,setDob]=useState<string|null>("");
    const [addMemory,setAddMemory]=useState<null|boolean>(null);
    const [newMemory,setnewMemory]=useState<null|boolean>(null);

    const[memoryImg,setMemoryImg]=useState<any>([]);
    console.log(props.today);
    let setToday:string=(props.today);
    if((setToday.slice(1,2))=='-'){
        setToday='0'+setToday;
    }
    console.log(setToday);
    console.log(props.element.dateOfUser,"date of user");



    const showMemories=()=>{
        setnewMemory(false)
        props.setEdit(false);
        console.log("Memories");
        setAddMemory(true);
        const memoryHolder=[];
        for(let i=0;i<(props.element.memories.length);i++){
            memoryHolder.push((props.element).memories[i]);
        }
        setMemoryImg(memoryHolder);

    }
    const addNewMemory=()=>{
        setnewMemory(true)
    }
    return(
        (props.element.nameOfPerson)? 
    <>
     <div className={props.style.data}>
        <div className={props.style.eventHeader}>
        {(props.element.nameOfPerson)?
            <div className={props.style.commentAvatar}>
                {props.element.nameOfPerson.charAt(0).toUpperCase()}
            </div>
            :
            null
        }      
     
                        <h3 className={props.style.h3}>{props.element.nameOfPerson}</h3>
        </div>
        

                        <p className={props.style.date}>
                        • {props.element.dateOfUser}-{props.month}
                            {(`${props.element.dateOfUser}-${props.element.monthOfUser}-${props.element.yearOfUser}`==setToday)?"/   Today":null}
                        </p>

                        <p className={props.style.note}>
                            {props.element.note}
                        </p>
                        <button className={props.style.goldBtn} 
                            onClick={()=>{
                                setnewMemory(false)
                                setAddMemory(false);
                                setMemoryImg(false)
                                props.setEdit(false);
                                props.setEditName(props.element.nameOfPerson);
                                setTimeout(()=>{props.setEdit(props.element.id);},1)
                                

                            }}
                        >Edit </button>
                        <button   onClick={async()=>{
                                console.log(props.reqList);
                                const sample=[...(props.reqList)];
                                console.log(props.index);
                                sample.splice(props.index,1);
                                console.log(sample);
                                props.setReqList(sample);
                                const editId=props.element.id;
                                const userId=props.userId;
                                const token=localStorage.getItem("token");
                                const deleteRequest=await axios.put("https://birthdays-639v.onrender.com/delete-event",{
                                    userId,editId,token
                                });
                                console.log(deleteRequest)
    
                                 
    
                            }} className={props.style.goldBtn}>Delete</button>

                            <hr>
                            </hr>
                            <button className={props.style.goldBtn} onClick={showMemories}>Memories</button>
                            {addMemory?
                            
                                <>
                                    <span title="Upload New Memory" 
                                         onClick={addNewMemory} style={{cursor:"pointer"}}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
                                    </span>
                                     
                                    
                                        
                                </>
                                :
                                null
                            }
                            {newMemory?
                            
                            <>
                                <form className={props.style.formCard}
                                onSubmit={async(e:React.FormEvent<HTMLFormElement>)=>{
                                    e.preventDefault();
                                    console.log("Prevented Default")
                                    const form=e.target as HTMLFormElement;
                                    const file=((form[0] as HTMLInputElement).files?.[0]);
                                    if(!file){
                                        return;
                                    }
                                    const formData=new FormData();
                                    formData.append("file",file);
                                    const userId=props.userId;
                                    formData.append("userId",userId);
                                    const eventId=props.element.id
                                    formData.append("eventId",eventId)
                                    const saveMemory=await axios.post("http://localhost:4000/new-memory",formData)
                                    console.log((saveMemory))
                                }}>
                                    <input type="file"   formEncType="multipart/form-data" className={props.style.monthCard}/>
                                    <button type="submit" className={props.style.goldBtn}>Upload</button>
                                 
                                </form>
                            </>
                            :
                            null
                        
                            }
                            <div className={`${props.style.memoryContainer} `}>
                            {memoryImg?
                                memoryImg.map((element)=>{
                                    console.log(element.fileName);
                                   return( <div className={props.style.image}>
                                    
                                    <img src={element.fileName} alt={element.uploadTimeLine} ></img>
                                    <h4 className={props.style.text}> {element.uploadTimeLine}</h4>
                                   </div>)
                                })
                                :null
                            }
                            </div>
                            {(props.edit==props.element.id)?
                                <>
                                <form onSubmit={async(e:FormEvent<HTMLFormElement>)=>{
                                    e.preventDefault();
                                    console.log("editDone");
                                    const nameOfPersonId=props.element.id;
                                    const editReq=await axios.put("https://birthdays-639v.onrender.com/edit-event",{
                                        nameOfPersonId,
                                        userId:props.userId,
                                        editName:props.editName,
                                        editDob:props.editDob,
                                        editNote:props.editNote,
                                        token:localStorage.getItem("token"),
                                        


                                    });
                                    console.log(editReq)
                                     

                                }} className={props.style.formCard}>

                                    <input type="text" placeholder={`previous Name: ${props.element.nameOfPerson}`} value={props.editName} onChange={(e)=>{
                                        setName(e.target.value || props.editName);
                                        props.setEditName(e.target.value)
                                    }} required/>
                                    <input type="date" value={props.element.dob} onChange={(e)=>{
                                        setDob(e.target.value);
                                        props.setEditDob(e.target.value);
                                    }} required/>
                                    <textarea placeholder={`Previous Note: ${props.element.note}`} onChange={(e)=>{
                                        props.setEditNote(e.target.value);
                                    }}>{props.element.note}</textarea>
                                    <button onClick={()=>{
                                         console.log((name || props.editName) ,dob,typeof(dob));
                                        console.log("clicked edit button");
                                        if((name || props.editName )&& dob ){
                                             
                                            props.editAlert();
                                        }
                                        
                                    }} className={props.style.goldBtn}>Confirm Changes</button>
                                </form>
                                </>
                            :null}
     </div>
    </>
    :
    "No events this month."
    
     
                                
                                
    
    )
 }
  
 export {Month}
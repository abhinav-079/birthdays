 import axios from "axios";
 import { useState, type FormEvent } from "react";
 import { InvalidPage } from "../pages/InvalidPage";
 import style from "../pages/pageOne.module.css"
 import { saveAs } from "file-saver";
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
 type MonthProps = {
    
    element : element;
    setEdit : React.Dispatch<React.SetStateAction<string|null>>;
    setEditName : React.Dispatch<React.SetStateAction<string|null>>;
    setEditDob : React.Dispatch<React.SetStateAction<string|null>>;
    setEditNote : React.Dispatch<React.SetStateAction<string|null>>;
    reqList : element[];
    index: number;
    userId: string;
    editName : null |string ;
    editDob : string|null;
    editNote : null |string;
    today: string;
    edit : null|string;
    setReqList : React.Dispatch<React.SetStateAction<element[]>>;
    editAlert: (msg:string) => void;
    month: string;
  };
  
   type MemoryObj={
    fileName:string,
    uploadTimeLine:string;
   }
 const Month=(props:MonthProps)=>{
    const [name,setName]=useState<string|null>("");
    const [dob,setDob]=useState<string|null>("");
    const [addMemory,setAddMemory]=useState<null|boolean>(null);
    const [newMemory,setnewMemory]=useState<null|boolean>(null);
    const [secondDelete,setSecondDelete]=useState<boolean|null>(null);

    const[memoryImg,setMemoryImg]=useState<MemoryObj[]>([]);
    console.log(props.today);
    let setToday:string=(props.today);
    if((setToday.slice(1,2))=='-'){
        setToday='0'+setToday;
    }
    console.log(setToday);
    console.log(props.element.dateOfUser,"date of user");
//18-08-2026 settoday
const countDown=(date:number,month: number)=>{
   console.log(typeof(date))
     if((Number(setToday.slice(3,5)))>Number(month)){
        return("/ Completed.")
     }
    else if((Number(setToday.slice(3,5)))==Number(month)){
        if(Number(setToday.slice(0,2))>date){
            return("/ Completed.")
        }
         else if(Number(setToday.slice(0,2))<date){
            return(`/ ${date-Number(setToday.slice(0,2))} days to go.`)
         }
    }
    else {
        let count;
         const days31=[1, 3, 5, 7, 8, 10, 12];
          if(days31.includes((Number(setToday.slice(3,5))))){
            count=31-(Number(setToday.slice(0,2)));
          }
          else{
            count=30-(Number(setToday.slice(0,2)));
          }
          for(let i=(Number(setToday.slice(3,5)))+1;i<month;i++){
            if(i==2){
                if(Number(setToday.slice(6))%4==0){
                    count+=29;
                }
                else{
                    count+=28;
                }
                
            }
            if(days31.includes(i)){
                count+=31;
            }
            else{
                count+=30;
            }

          }
          
          count+=Number(date);
          return(`/ ${count} days to go.`)
    }

}
 
const deleteMemory=async(memoryIndex:number,eventIndex:number)=>{
    console.log(props.userId);
    const userId=props.userId;
    const eventId=props.element.id;
    console.log(userId,eventId,eventIndex,memoryIndex);
    const deleteMemoryReq=await axios.delete("https://birthdays-639v.onrender.com/deleteMemory",{params:{userId,eventId,memoryIndex}});
    console.log(deleteMemoryReq);
    if((deleteMemoryReq.data.message)=="Some Error Occured, Please Try Again Later."){
        props.editAlert("Some Error Occured, Please Try Again Later.")
    }
    else if((deleteMemoryReq.data.message)=="Memory Deleted, Please refresh the page to see the changes."){
        props.editAlert("Memory Deleted, Please refresh the page to see the changes.");
    }
}
    const showMemories=()=>{
        setnewMemory(false)
        props.setEdit(null);
        console.log("Memories",(props.element).memories[0]);
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
     <div className={style.data}>
        <div className={style.eventHeader}>
        {(props.element.profile)?
              <div className={style.profileAvatar}>
            <img src={props.element.profile} ></img>
            </div>
        

            :
            <>
            <div className={style.commentAvatar}>
                {props.element.nameOfPerson.charAt(0).toUpperCase()}
            </div>
             
            </>
        }      
     
                        <h3 className={style.h3}>{props.element.nameOfPerson}</h3>
        </div>
        

                        <p className={style.date}>
                        • {props.element.dateOfUser}-{props.month}
                            {(`${props.element.dateOfUser}-${props.element.monthOfUser}-${props.element.yearOfUser}`==setToday)?"/   Today":countDown(Number(props.element.dateOfUser),Number(props.element.monthOfUser))}
                        </p>

                        <p className={style.note}>
                            {props.element.note}
                        </p>
                        <button className={style.goldBtn} 
                            onClick={()=>{
                                setnewMemory(false)
                                setAddMemory(false);
                                setSecondDelete(false)
                                //setMemoryImg(false);
                                props.setEdit(null);
                                props.setEditName(props.element.nameOfPerson);
                                setTimeout(()=>{props.setEdit(props.element.id);},1)
                                

                            }}
                        >Edit </button>
                        <button onClick={()=>{
                            setSecondDelete(true);
                            props.setEdit(null)
                        }} className={style.deleteBtn1}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F19E39"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
                        {secondDelete?
                        <>
                       <br />
                       
                       <button onClick={()=>{
                        setSecondDelete(false)
                       }} style={{cursor:"pointer"}} className={style.cancelBtn}>cancel </button>
                        <span   onClick={async()=>{
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
                            if(deleteRequest.data.error){
                                <InvalidPage message={deleteRequest.data.message} messageToken={null}/>
                            }
                            console.log(deleteRequest)

                             

                        }} style={{cursor:"pointer"}} className={style.delete}>
                             
                             Confirm Delete</span>
                            </>
                            :null
                    
                        }
                        

                            <hr>
                            </hr>
                            <button className={style.goldBtn} onClick={showMemories}>Memories</button>
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
                                <form className={style.formCard}
                                onSubmit={async(e:React.FormEvent<HTMLFormElement>)=>{
                                    e.preventDefault();
                                    console.log("Prevented Default")
                                    const form=e.target as HTMLFormElement;
                                    const file=((form[0] as HTMLInputElement).files?.[0]);
                                     
                                    const formData=new FormData();
                                    if(file)
                                    {formData.append("file",file);}
                                    const userId=props.userId;
                                    formData.append("userId",userId);
                                    const eventId=props.element.id
                                    formData.append("eventId",eventId)
                                    const token=localStorage.getItem("token");
                                    if(token){
                                        formData.append("token",token);
                                    }
                                    
                                    const saveMemory=await axios.post("https://birthdays-639v.onrender.com/new-memory",formData)
                                    console.log((saveMemory));
                                    if(saveMemory.data.error){
                                        <InvalidPage message={saveMemory.data.message} messageToken={null}/>
                                    }
                                    props.editAlert("Memory Saved, Please refersh the page to see changes.");
                                }}>
                                    <input type="file"   formEncType="multipart/form-data" className={style.monthCard}/>
                                    <button type="submit" className={style.goldBtn}>Upload</button>
                                 
                                </form>
                            </>
                            :
                            null
                        
                            }
                            <div className={`${style.memoryContainer} `}>
                            {memoryImg?
                                memoryImg.map((element:MemoryObj,index:number)=>{
                                    console.log(element.fileName);
                                   return( 
                                     <>
                                   <div className={style.image}>
                                   <h4 className={style.memoryDelete}
                                   title= "Delete Memory"
                                   onClick={()=>{
                                    console.log("Deleting.")
                                    const eventIndex=props.index;
                                    deleteMemory(index,eventIndex);
                                   }}
                                   > Delete</h4>
                                   <h4 className={style.memoryDownload} 
                                   onClick={()=>{
                                    console.log("Downloading File...")
                                     saveAs(element.fileName,"memory.png")
                                   }}
                                     >
                                     Download
                                   </h4>
                                    <img src={element.fileName} alt={element.uploadTimeLine} ></img>
                                    <h4 className={style.text}> {element.uploadTimeLine.slice(5)}</h4>
                                    
                                    
                                   </div>
                                   </>
                                   )
                                })
                                :null
                            }
                            </div>
                            {(props.edit==props.element.id)?
                                <>
                                <div className={style.formCard}>
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
                                        if(editReq.data.error){
                                            <InvalidPage message={editReq.data.message} messageToken={null}/>
                                        }
                                        console.log(editReq)
                                        

                                    }} >

                                        <input type="text" placeholder={`previous Name: ${props.element.nameOfPerson}`} value={props.editName??""} onChange={(e)=>{
                                            setName(e.target.value || props.editName);
                                            props.setEditName(e.target.value)
                                        }} required/>
                                        <input type="date"  onChange={(e)=>{
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
                                                
                                                props.editAlert("Event Edited, Please refersh the page to see changes.");
                                            }
                                            
                                        }} className={style.goldBtn}>Confirm Changes</button>
                                    </form>
                                </div>
                                </>
                            :null}
     </div>
    </>
    :
    "No events this month."
    
     
                                
                                
    
    )
 }
  
 export {Month}
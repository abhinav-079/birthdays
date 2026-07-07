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
    console.log(props.today);
    let setToday:string=(props.today);
    if((setToday.slice(1,2))=='-'){
        setToday='0'+setToday;
    }
    console.log(setToday);
    console.log(props.element.dateOfUser,"date of user");
    return(<>
     <div className={props.style.data}>
                        
                        <h3>{props.element.nameOfPerson}</h3>

                        <p className={props.style.date}>
                        • {props.element.dateOfUser}-{props.month}
                            {(`${props.element.dateOfUser}-${props.element.monthOfUser}-${props.element.yearOfUser}`==setToday)?"/   Today":null}
                        </p>

                        <p className={props.style.note}>
                            {props.element.note}
                        </p>
                        <button className={props.style.goldBtn} 
                            onClick={()=>{
                                props.setEdit(false);
                                props.setEditName(props.element.nameOfPerson);
                                props.setEdit(props.element.id);

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
    </>)
 }
  
 export {Month}
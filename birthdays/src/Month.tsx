 import axios from "axios";
 let Month=(props)=>{
    console.log(props.style.goldBtn)
    return(<>
     <div className={props.style.data}>
                        
                        <h3>{props.element.nameOfPerson}</h3>

                        <p className={props.style.date}>
                            🎂 {props.element.dateOfUser}-{props.month}-{props.element.yearOfUser}
                            {(`${props.element.dateOfUser}-${props.element.monthOfUser}-${props.element.yearOfUser}`==props.today)?"/   Today":null}
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
                                let sample=[...(props.reqList)];
                                console.log(props.index);
                                sample.splice(props.index,1);
                                console.log(sample);
                                props.setReqList(sample);
                                let editId=props.element.id;
                                let userId=props.userId;
                                let token=localStorage.getItem("token");
                                let deleteRequest=await axios.put("http://localhost:4000/delete-event",{
                                    userId,editId,token
                                });
    
                                 
    
                            }} className={props.style.goldBtn}>Delete</button>

                            <hr>
                            </hr>
                            {(props.edit==props.element.id)?
                                <>
                                <form onSubmit={async(e)=>{
                                    e.preventDefault();
                                    console.log("editDone");
                                    let nameOfPersonId=props.element.id;
                                    let editReq=await axios.put("http://localhost:4000/edit-event",{
                                        nameOfPersonId,
                                        userId:props.userId,
                                        editName:props.editName,
                                        editDob:props.editDob,
                                        editNote:props.editNote,
                                        token:localStorage.getItem("token"),
                                        


                                    });
                                     

                                }} className={props.style.formCard}>

                                    <input type="text" placeholder={`previous Name: ${props.element.nameOfPerson}`} value={props.editName} onChange={(e)=>{
                                        props.setEditName(e.target.value)
                                    }} required/>
                                    <input type="date" value={props.element.dob} onChange={(e)=>{
                                        props.setEditDob(e.target.value);
                                    }} required/>
                                    <textarea placeholder={`Previous Note: ${props.element.note}`} onChange={(e)=>{
                                        props.setEditNote(e.target.value);
                                    }}>{props.element.note}</textarea>
                                    <button onClick={()=>{
                                         
                                        console.log("clicked edit button")
                                        props.editAlert();
                                    }} className={props.style.goldBtn}>Confirm Changes</button>
                                </form>
                                </>
                            :null}
     </div>
    </>)
 }

 export {Month}
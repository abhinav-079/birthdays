const {dbModel}=require("../models/userModel.js");
const dbManager=dbModel;
const{sendGmail}=require("../utils/emailService.js");

const sendMail=async(req,res)=>{

    console.log("send-mail----------------------------")
    
        console.log("SEND MAIL HIT");
        console.log("IP:", req.ip);
        console.log("USER AGENT:", req.headers["user-agent"]);
        console.log("QUERY:", req.query);
    
         
    let allusers=await dbManager.find({});
    let setToday=new Date();
    console.log(setToday.getDate(),setToday.getMonth());
            let thisMonth=0;
            if((setToday.getMonth())<10){

                thisMonth=(`0${(setToday.getMonth())+1}`);
                
            }
            else{
                thisMonth=(setToday.getMonth())+1;
            }
            let thisDay=0;
            if(setToday.getDate()<10){
                thisDay=`0${setToday.getDate()}`;
            }
            else{
                thisDay=setToday.getDate();
            }
            let today=`${thisDay}/${((thisMonth))}`;
            console.log(today)
    for(let i=0;i<allusers.length;i++){
        console.log("User: ",allusers[i].username);
        let username=allusers[i].username;
        let userMail=allusers[i].email;
        console.log(userMail,today);
        let todayEvents=[];
        let everyMonthEventsArr=[];
        for(let j=0;j<(allusers[i].details).length;j++){
            if(`${(allusers[i].details)[j].dateOfUser}/${(allusers[i].details)[j].monthOfUser}`===today){
                let profile=(allusers[i].details)[j].profile;
                let birthdayBoy=(allusers[i].details)[j].nameOfPerson;
                let note=(allusers[i].details)[j].note ;
                let obj={
                    profile,
                    wishes:birthdayBoy,
                    notes:note?note:null,
                }
                todayEvents.push(obj);
                /*  */
            }
            
            
        }
        for(let l=0;l<(allusers[i].everyMonthEvents).length;l++){
            if(`${((allusers[i].everyMonthEvents)[l].dateOfUser)}`==setToday.getDate()){
                let profile=(allusers[i].details)[j].profile;
                let birthdayBoy=(allusers[i].everyMonthEvents)[l].nameOfPerson;
                let dates=`${(allusers[i].everyMonthEvents)[l].dateOfUser}/ ${(allusers[i].everyMonthEvents)[l].monthOfUser}/ ${(allusers[i].everyMonthEvents)[l].yearOfUser}`;
                let note=(allusers[i].everyMonthEvents)[l].note ;
                let obj={
                    profile,
                    wishes:birthdayBoy,
                    dates,
                    notes:note?note:null,
                }
                everyMonthEventsArr.push(obj);
            }
        }
        console.log(todayEvents,everyMonthEventsArr);
        let finalArray=[];
        let finalEveryMonthArr=[];
        for(let l=0;l<todayEvents.length;l++){
            finalArray.push(`<tr>
                <td style="padding:0 0 14px 0;">
                    <div style="
                        background:#2C2C2E;
                        border:1px solid rgba(255,255,255,.07);
                        border-left:3px solid #0A84FF;
                        border-radius:8px;
                        padding:18px 20px;
                    ">
                        <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px;">
                            ${todayEvents[l].profile
                                ? `<img src="${todayEvents[l].profile}" width="44" height="44" style="border-radius:50%;object-fit:cover;display:block;border:2px solid #0A84FF;" />`
                                : `<div style="width:36px;height:36px;border-radius:50%;background:#0A84FF;color:#1C1C1E;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">${todayEvents[l].nameOfPerson.charAt(0).toUpperCase()}</div>`
                            }
                            <span style="font-size:17px;font-weight:600;color:#F5F5F7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
                                ${todayEvents[l].wishes}
                            </span>
                        </div>
            
                        <div style="
                            font-size:13px;
                            color:rgba(245,245,247,.72);
                            line-height:1.6;
                            margin-bottom:10px;
                            font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;
                        ">
                            ${todayEvents[l].notes || ""}
                        </div>
            
                        <div style="
                            display:inline-block;
                            background:rgba(10,132,255,.12);
                            color:#409CFF;
                            padding:5px 14px;
                            border-radius:6px;
                            font-size:12px;
                            font-weight:600;
                            letter-spacing:0.5px;
                            font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;
                        ">
                            ${todayEvents[l].date || ""}
                        </div>
                    </div>
                </td>
            </tr>`);
        }
        for(let l=0;l<everyMonthEventsArr.length;l++){
            finalArray.push(`<tr>
                <td style="padding:0 0 14px 0;">
                    <div style="
                        background:#2C2C2E;
                        border:1px solid rgba(255,255,255,.07);
                        border-left:3px solid #0A84FF;
                        border-radius:8px;
                        padding:18px 20px;
                    ">
                        <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px;">
                            ${everyMonthEventsArr[l].profile
                                ? `<img src="${everyMonthEventsArr[l].profile}" width="44" height="44" style="border-radius:50%;object-fit:cover;display:block;border:2px solid #0A84FF;" />`
                                : `<div style="width:36px;height:36px;border-radius:50%;background:#0A84FF;color:#1C1C1E;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">${everyMonthEventsArr[l].nameOfPerson.charAt(0).toUpperCase()}</div>`
                            }
                            <span style="font-size:17px;font-weight:600;color:#F5F5F7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
                                ${everyMonthEventsArr[l].wishes}
                            </span>
                        </div>
             
                        <div style="
                            font-size:13px;
                            color:rgba(245,245,247,.72);
                            line-height:1.6;
                            margin-bottom:10px;
                            font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;
                        ">
                            ${everyMonthEventsArr[l].notes || ""}
                        </div>
            
                        <div style="
                            display:inline-block;
                            background:rgba(10,132,255,.12);
                            color:#409CFF;
                            padding:5px 14px;
                            border-radius:6px;
                            font-size:12px;
                            font-weight:600;
                            letter-spacing:0.5px;
                            font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;
                        ">
                            ${everyMonthEventsArr[l].date || ""}
                        </div>
                    </div>
                </td>
            </tr>`);
        }
        console.log(finalArray.length);
        if(finalEveryMonthArr.length){
            console.log("Ssending mail, every month.")
            const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>Annual Reminder</title>
</head>

<body style="
    margin:0;
    padding:24px;
    background:#000000;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;
">

<!-- Preheader (hidden, improves inbox preview text — helps deliverability) -->
<div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">
    Your upcoming dates, quietly kept on your behalf.
</div>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
<tr>
<td align="center">

<table role="presentation" width="640" cellspacing="0" cellpadding="0" style="
    max-width:640px;
    width:100%;
    background:#1C1C1E;
    border-radius:20px;
    overflow:hidden;
    border:1px solid rgba(255,255,255,.07);
">

    <!-- Header -->
    <tr>
    <td style="
        background:#000000;
        padding:40px 32px;
        text-align:center;
        border-bottom:1px solid rgba(255,255,255,.12);
    ">
        <p style="
            margin:0 0 6px 0;
            color:#409CFF;
            font-size:11px;
            letter-spacing:3px;
            text-transform:uppercase;
            font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;
            font-weight:600;
        ">
            Personal Calendar
        </p>
        <h1 style="
            margin:0;
            color:#F5F5F7;
            font-size:26px;
            font-weight:700;
            letter-spacing:-.5px;
        ">
            Your Annual Reminders
        </h1>
    </td>
    </tr>

    <!-- Content -->
    <tr>
    <td style="padding:36px 32px;">

        <p style="
            color:#F5F5F7;
            font-size:16px;
            margin:0 0 4px 0;
        ">
            Dear <strong>${username}</strong>,
        </p>

        <p style="
            color:rgba(245,245,247,.72);
            font-size:14px;
            line-height:1.7;
            margin:0 0 28px 0;
            font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;
        ">
            A few dates worth holding onto are approaching. Here they are, gathered in one place for you.
        </p>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
${finalEveryMonthArr}
        </table>

    </td>
    </tr>

    <!-- Footer -->
    <tr>
    <td style="
        background:#2C2C2E;
        padding:28px 32px;
        text-align:center;
        border-top:1px solid rgba(255,255,255,.07);
        font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;
    ">
        <p style="
            margin:0 0 14px 0;
            color:rgba(245,245,247,.45);
            font-size:12px;
            line-height:1.6;
        ">
            Sent with care, on schedule, so nothing important slips by.
        </p>

        <p style="margin:0 0 10px 0; color:rgba(245,245,247,.45); font-size:11px;">
            You're receiving this because you set up a reminder with us.
             
             
        </p>
 
    </td>
    </tr>

</table>

</td>
</tr>
</table>

</body>
</html>`;
            console.log(html);
            let sendMail=await sendGmail(
                userMail, // ANY email (not just yours!)
                `Events Reminder! to: ${username}`,
                `Event: ${JSON.stringify(everyMonthEventsArr, null, 7)}`,html
            );
            console.log(sendMail," Gmail.");
    }
        if(finalArray.length){
            console.log("Ssending mail")
            const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>Annual Reminder</title>
</head>

<body style="
    margin:0;
    padding:24px;
    background:#000000;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;
">

<!-- Preheader (hidden, improves inbox preview text — helps deliverability) -->
<div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">
    Your upcoming dates, quietly kept on your behalf.
</div>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
<tr>
<td align="center">

<table role="presentation" width="640" cellspacing="0" cellpadding="0" style="
    max-width:640px;
    width:100%;
    background:#1C1C1E;
    border-radius:20px;
    overflow:hidden;
    border:1px solid rgba(255,255,255,.07);
">

    <!-- Header -->
    <tr>
    <td style="
        background:#000000;
        padding:40px 32px;
        text-align:center;
        border-bottom:1px solid rgba(255,255,255,.12);
    ">
        <p style="
            margin:0 0 6px 0;
            color:#409CFF;
            font-size:11px;
            letter-spacing:3px;
            text-transform:uppercase;
            font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;
            font-weight:600;
        ">
            Personal Calendar
        </p>
        <h1 style="
            margin:0;
            color:#F5F5F7;
            font-size:26px;
            font-weight:700;
            letter-spacing:-.5px;
        ">
            Your Annual Reminders
        </h1>
    </td>
    </tr>

    <!-- Content -->
    <tr>
    <td style="padding:36px 32px;">

        <p style="
            color:#F5F5F7;
            font-size:16px;
            margin:0 0 4px 0;
        ">
            Dear <strong>${username}</strong>,
        </p>

        <p style="
            color:rgba(245,245,247,.72);
            font-size:14px;
            line-height:1.7;
            margin:0 0 28px 0;
            font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;
        ">
            A few dates worth holding onto are approaching. Here they are, gathered in one place for you.
        </p>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
${finalArray}
        </table>

    </td>
    </tr>

    <!-- Footer -->
    <tr>
    <td style="
        background:#2C2C2E;
        padding:28px 32px;
        text-align:center;
        border-top:1px solid rgba(255,255,255,.07);
        font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;
    ">
        <p style="
            margin:0 0 14px 0;
            color:rgba(245,245,247,.45);
            font-size:12px;
            line-height:1.6;
        ">
            Sent with care, on schedule, so nothing important slips by.
        </p>

        <p style="margin:0 0 10px 0; color:rgba(245,245,247,.45); font-size:11px;">
            You're receiving this because you set up a reminder with us.
             
             
        </p>
 
    </td>
    </tr>

</table>

</td>
</tr>
</table>

</body>
</html>`;
                console.log(html);
                let sendMail=await sendGmail(
                    userMail, // ANY email (not just yours!)
                    `Events Reminder! to: ${username}`,
                    `Send Wishes to: ${JSON.stringify(todayEvents, null, 7)}`,html
                );
                console.log(sendMail," Gmail.");
        }
        
    }
}

module.exports={sendMail};
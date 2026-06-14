class HandleError extends Error{
    constructor(message,status=400){
        super();
        this.message=message;
        this.status=status;
    }
}
module.exports=HandleError;
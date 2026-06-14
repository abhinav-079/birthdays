import axios from "axios";


let axiosManager=axios.create({
    baseURL:"https://birthdays-639v.onrender.com"
});

export {axiosManager};
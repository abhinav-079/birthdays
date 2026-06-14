import axios from "axios";


let axiosManager=axios.create({
    baseURL:"http://localhost:4000"
});

export {axiosManager};
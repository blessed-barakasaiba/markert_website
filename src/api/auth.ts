import API from "./main";
interface Formdata {
    username:string;
    password:string;
}

export const login = async (data:Formdata) => API.post("auth/login/", data);
export const logout = async () => API.post("auth/logout");
import API from "./main";

interface ProductUploadData {
    product_name: string;
    price: string;
    product_image: File;
}

export const uploadproduct = async (data: ProductUploadData) =>API.post('post_products/', data, {
    headers:{
        'Authorization':`Token ${localStorage.getItem('token')}`,
    }
});

export const product = async ()=> await API.get("products/");

export const addComment = async (data:{comment:string; product:string}) =>API.post("addcomment/", data,{
    headers:{
        'Authorization':`Token ${localStorage.getItem('token')}`,
    }
});

export const fetchComment = async (pk)=> await API.get(`fetchcomment/${pk}/`);

export const like = async (data:{like:boolean}) => await API.post('like/', data, {
    headers:{
        'Authorization':`Token ${localStorage.getItem('token')}`,
    }
})



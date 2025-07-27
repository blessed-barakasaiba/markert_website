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
})

export const product = async ()=> await API.get("products/");


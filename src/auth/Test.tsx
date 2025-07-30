import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { file, z } from 'zod';
import { login } from "../api/auth";

const schema = z.object({
    username:z.string(),
    password:z.string().min(6, "Password must be at least 6 character"),
    image:z.any().refine((files)=>files instanceof FileList && files.length > 0, {
        message:"image required"
    }),
    document:z.any().refine((files)=>files instanceof FileList && files.length > 0, {
        message:"Document required"
    }),
});

type FormFields = z.infer<typeof schema>;



const Test = () => {

    const { register, handleSubmit,setError, formState:{errors, isSubmitting} } = useForm<FormFields>({
        defaultValues:{
            username:"blessed",
        },
        resolver: zodResolver(schema),
    });
    const onSubmit: SubmitHandler<FormFields> = async (data) =>{
        try{
            console.log(data);
            const res= await login(data);
            console.log(res.data);
        }
        catch(error){
            setError("root", {error});
        }
    };

  return (
    <div className="max-w-md mx-auto mt-24">
        <form action="" onSubmit={handleSubmit(onSubmit)} className="shadow-lg flex flex-col gap-4 bg-gray-100">
            <input type="text" {...register("username")}  className="px-4 py-2 w-full border border-gray-600 rounded-md"
            />
            {errors.username && (
                <div className="text-red-500">
                    {errors.username.message}
                </div>
            )}
            <input type="password" {...register("password")} className="px-4 py-2 w-full border border-gray-600 rounded-md"
            />
            {errors.password && (
                <div className="text-red-600">
                    {errors.password.message}
                </div>
            )}

            <input type="file" {...register('image')} className="px-4 py-2 w-full border border-gray-600 rounded-md" />
            {errors.image &&(
                <div className="text-red-600">
                    {errors.image.message}
                </div>
            )}

            <input type="file" {...register('document') } className="px-4 py-2 w-full border border-gray-600 rounded-md" />
            {errors.document && (
                <div className="text-red-700">
                    {errors.document.message}
                </div>
            )}
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-md bg-green-600">{isSubmitting ? "Submitting...":"Submit"} </button>
            {errors.root &&(<div className="bg-red-700">{errors.root.message}</div>)}
        </form>
    </div>
  )
}
export default Test;
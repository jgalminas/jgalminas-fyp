import { useAuth } from "../auth/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Input from "../core/Input";
import Button from "../core/Button";
import ErrorMessage from "../core/message/ErrorMessage";
import { Link } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required"),
  username: z.string().min(3, "Username is required (min 3 letters)"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have more than 8 characters"),
  confirmPassword: z.string().min(1, "Password confirmation is required"),
})
.refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

type SignUpSchemaType = z.infer<typeof formSchema>;

const SignUp = () => {

  const { signUp } = useAuth(); 

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpSchemaType>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur'
  });

  const [responseError, setResponseError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  const onSubmit = handleSubmit(async(data) => {
    setLoading(true);
    setResponseError(null);
    
    const error = await signUp(data);

    if (error) {
      setResponseError(error.message);
    }

    setLoading(false);
  });

  return (
    <div className="flex h-screen justify-center items-center bg-woodsmoke-900">
      <div className="w-full h-full hidden md:block">
        <img src="/images/splash.jpg" className="h-full w-full object-cover"/>
      </div>
    
      <div className="flex flex-col gap-10 w-full md:w-3/5 ml-auto h-full items-center justify-center">
        <div className="flex flex-col gap-12 p-12">
          <div className="flex flex-col justify-start">
            <h1 className="text-2xl font-medium text-star-dust-200"> Get Started </h1>
            <h2 className="text-star-dust-300"> Create a new account </h2>
          </div>

          <form onSubmit={onSubmit}
          className="flex flex-col w-80 gap-5">
            
            <Input
            label="Email"
            placeholder="you@email.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email", { required: true })}/>

            <Input
            label="Username"
            placeholder="your username"
            autoComplete="username"
            error={errors.username?.message}
            {...register("username", { required: true })}/>

            <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="**************"
            error={errors.password?.message}
            {...register("password", { required: true })}/>

            <Input
            label="Repeat Password"
            type="password"
            autoComplete="new-password"
            placeholder="**************"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword", { required: true })}/>

            <Button isLoading={isLoading} type="submit" className="self-end"> Sign Up </Button>
            
            <Link to="/login" className="text-star-dust-300 text-sm">
              Already have an account?
              <em> <u> Sign in </u> </em>
            </Link>

            { responseError && 
              <ErrorMessage>
                { responseError }
              </ErrorMessage>
            }

          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp;
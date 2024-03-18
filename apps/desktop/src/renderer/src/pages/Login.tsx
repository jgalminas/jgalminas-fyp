import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Input from "../core/Input";
import Button from "../core/Button";
import ErrorMessage from "../core/message/ErrorMessage";
import { Link } from "react-router-dom";
import splash from "@assets/images/splash.jpg";

const formSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required")
});

type SignIpSchemaType = z.infer<typeof formSchema>;

const Login = () => {

  const { signIn } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<SignIpSchemaType>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur'
  });

  const [responseError, setResponseError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  const onSubmit = handleSubmit(async(data) => {
    setLoading(true);
    setResponseError(null);

    const error = await signIn({
      email: data.email,
      password: data.password
    });

    if (error) {
      setResponseError(error.message);
    }

    setLoading(false);
  });

  return (
    <div className="flex h-screen justify-center items-center bg-woodsmoke-900">
      <div className="w-full h-full hidden md:block">
        <img src={splash} className="h-full w-full object-cover"/>
      </div>

      <div className="flex flex-col gap-10 w-full md:w-3/5 ml-auto h-full items-center justify-center">

        <div className="flex flex-col gap-12 p-12">
          <div className="flex flex-col justify-start">
            <h1 className="text-2xl font-medium text-star-dust-200"> Welcome Back </h1>
            <h2 className="text-star-dust-300"> Sign in to your account </h2>
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
            label="Password"
            type="password"
            autoComplete="password"
            placeholder="**************"
            error={errors.password?.message}
            {...register("password", { required: true })}/>

            <Button className="self-end" isLoading={isLoading} type="submit"> Sign In </Button>

            <Link to="/signup" className="text-star-dust-300 text-sm">
              Don't have an account?
              <em> <u> Sign up </u> </em>
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

export default Login;

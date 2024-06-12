/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch } from "@/redux/hooks";
import authService from "@/services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLock, IconMail } from "@tabler/icons-react";
import { App } from "antd";
import { useEffect, useRef, Fragment, FunctionComponent } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

interface LoginPageProps {}
const schema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  password: z.string().min(1),
});

// Define your form values type
type FormValues = z.infer<typeof schema>;

const remember = (
  rememberCheck: React.RefObject<HTMLInputElement>,
  data: FormValues
) => {
  if (rememberCheck.current) {
    if (rememberCheck.current.checked) {
      localStorage.setItem("myapp-email", data.email);
      localStorage.setItem("myapp-password", data.password);
    } else {
      localStorage.setItem("myapp-email", "");
      localStorage.setItem("myapp-password", "");
    }
  }
};
const LoginPage: FunctionComponent<LoginPageProps> = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const rememberCheck = useRef<HTMLInputElement>(null);
  const { message } = App.useApp();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    remember(rememberCheck, data);
    try {
      await authService.login(data, dispatch, navigate);
    } catch (error: any) {
      console.log(error.response.data);
      if (
        error.response &&
        error.response.data &&
        error.response.data.statusCode === 403
      ) {
        message.error("Bạn không có quyền truy cập tài nguyên này!");
      } else {
        // Xử lý các loại lỗi khác ở đây
      }
    }
  };

  const onError = (error: any): void => {
    console.log("ERROR:::", error);
  };
  useEffect(() => {
    // Check if window is defined (client side)
    if (typeof window !== "undefined") {
      const emailSaved = localStorage.getItem("myapp-email") || "";
      const password = localStorage.getItem("myapp-password") || "";
      setValue("email", emailSaved);
      setValue("password", password);
      if (rememberCheck.current && emailSaved && password) {
        rememberCheck.current.checked = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Fragment>
      <div className="w-[41.6666666667%] h-[100vh] bg-[url('https://uitheme.net/sociala/images/login-bg.jpg')] bg-no-repeat bg-cover"></div>
      <div className="px-[15px] flex-1">
        <div className="py-[100px]">
          <div className="w-[fit-content] mx-[auto] p-[16px] min-w-[380px] max-w-[400px]">
            <h2 className="text-[30px] font-[700] mb-[1rem] text-left">
              Login into
              <br /> your account
            </h2>
            <form onSubmit={handleSubmit(onSubmit, onError)}>
              <div className="mb-[16px] relative w-[100%] border-none">
                <IconMail
                  width={24}
                  height={24}
                  className="absolute left-[15px] top-[16px] text-[#9ca4b2]"
                ></IconMail>
                <input
                  placeholder="Your Email Address"
                  className="h-[60px] leading-[60px] w-[100%] rounded-[7px] outline-[#05f] block border-[2px] border-[#eee] border-solid py-[6px] pl-[48px] pr-[12px] text-[#212529] font-[600] text-[14px]"
                  {...register("email", {
                    required: "Field này là bắt buộc.",
                  })}
                ></input>
                {errors.email ? (
                  <span className="text-[red] text-[14px] pl-[16px] mb-[-12px] block">
                    {errors.email?.message}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="mb-[4px] relative w-[100%] border-none">
                <IconLock
                  width={24}
                  height={24}
                  className="absolute left-[15px] top-[16px] text-[#9ca4b2]"
                ></IconLock>
                <input
                  placeholder="Password"
                  type="password"
                  className="h-[60px] leading-[60px] w-[100%] rounded-[7px] outline-[#05f] block border-[2px] border-[#eee] border-solid py-[6px] pl-[48px] pr-[12px] text-[#212529] font-[600] text-[14px]"
                  {...register("password", {
                    required: "Field này là bắt buộc.",
                  })}
                ></input>
                {errors.password ? (
                  <span className="text-[red] text-[14px] pl-[16px] block">
                    {errors.password?.message}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="flex justify-between w-[100%] my-4">
                <span className="flex items-center ">
                  <input
                    ref={rememberCheck}
                    id="exampleCheck5"
                    type="checkbox"
                    className=" cursor-pointer rounded-[0.25em] mr-[6px] w-[1em] h-[1em] align-top bg-[#fff] bg-no-repeat bg-center bg-contain border-[1px] border-solid border-[#00000040] block appearance-none checked:bg-[#1e74fd] checked:border-[#1e74fd] "
                  ></input>
                  <label
                    htmlFor="exampleCheck5"
                    className="text-[#adb5bd] text-[14px] cursor-pointer select-none"
                  >
                    Remember me
                  </label>
                </span>
                <Link
                  to={"/"}
                  className="font-[600] text-[14px] text-[#495057]"
                >
                  Forgot your Password?
                </Link>
              </div>
              <div className="w-[100%]">
                <button
                  type="submit"
                  className="block h-[60px] leading-[60px] rounded-[7px] text-[14px] font-[600] bg-[#343a40] text-[#fff] text-center w-[100%] mb-[4px] "
                >
                  Login
                </button>
                <h6 className="font-[600] text-[#adb5bd] text-[14px] leading-[32px]">
                  Dont have account
                  <Link
                    to={"/register"}
                    className="font-[600] text-[blue] ml-[4px]"
                  >
                    Register
                  </Link>
                </h6>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default LoginPage;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch } from "@/redux/hooks";
import authService from "@/services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLock, IconMail, IconSquareKey } from "@tabler/icons-react";
import { App } from "antd";
import { Fragment, FunctionComponent } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

interface RegisterPageProps {}
const schema = z
  .object({
    secretKey: z
      .string()
      .min(1, { message: "Vui lòng nhập mã bí mật." })
      .refine(async (e) => {
        return await authService.checkSecretKey(e);
      }, "Mã bí mật không tồn tại hoặc đã được sử dụng"),
    email: z
      .string()
      .min(1, { message: "Vui lòng nhập email." })
      .email("Email không hợp lệ")
      .refine(async (e) => {
        return await authService.checkEmailValid(e);
      }, "Email đã tồn tại"),
    password: z.string().min(6),
    repassword: z.string().min(6),
    confirmRule: z.literal<boolean>(true, {
      errorMap: () => ({
        message: "Vui lòng chấp thuận điều khoản",
      }),
    }),
  })
  .refine((data) => data.password === data.repassword, {
    message: "Passwords do not match",
    path: ["repassword"],
  });

// Define your form values type
type FormValues = z.infer<typeof schema>;

const RegisterPage: FunctionComponent<RegisterPageProps> = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { repassword, confirmRule, ...user } = data;
    try {
      await authService.register(user, dispatch);
      message.success("Đăng ký thành công", 1000);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  const onError = (error: any): void => {
    console.log("ERROR:::", error);
  };
  return (
    <Fragment>
      <div className="w-[41.6666666667%] h-[100vh] bg-[url('https://uitheme.net/sociala/images/login-bg-2.jpg')] bg-no-repeat bg-cover"></div>
      <div className="px-[15px] flex-1">
        <div className="py-[100px]">
          <div className="w-[fit-content] mx-[auto] p-[16px] min-w-[380px] max-w-[400px]">
            <h2 className="text-[30px] font-[700] mb-[1rem] text-left">
              Create
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
              <div className="mb-[16px]  relative w-[100%] border-none">
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
                  <span className="text-[red] text-[14px] pl-[16px] mb-[-12px] block">
                    {errors.password?.message}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="mb-[16px]  relative w-[100%] border-none">
                <IconLock
                  width={24}
                  height={24}
                  className="absolute left-[15px] top-[16px] text-[#9ca4b2]"
                ></IconLock>
                <input
                  placeholder="Confirm Password"
                  type="password"
                  className="h-[60px] leading-[60px] w-[100%] rounded-[7px] outline-[#05f] block border-[2px] border-[#eee] border-solid py-[6px] pl-[48px] pr-[12px] text-[#212529] font-[600] text-[14px]"
                  {...register("repassword", {
                    required: "Field này là bắt buộc.",
                  })}
                ></input>
                {errors.repassword ? (
                  <span className="text-[red] text-[14px] pl-[16px] mb-[-12px] block">
                    {errors.repassword?.message}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="mb-[16px] relative w-[100%] border-none">
                <IconSquareKey
                  width={24}
                  height={24}
                  className="absolute left-[15px] top-[16px] text-[#9ca4b2]"
                ></IconSquareKey>
                <input
                  placeholder="Mã Bí Mật"
                  className="h-[60px] leading-[60px] w-[100%] rounded-[7px] outline-[#05f] block border-[2px] border-[#eee] border-solid py-[6px] pl-[48px] pr-[12px] text-[#212529] font-[600] text-[14px]"
                  {...register("secretKey", {
                    required: "Field này là bắt buộc.",
                  })}
                ></input>
                {errors.secretKey ? (
                  <span className="text-[red] text-[14px] pl-[16px] mb-[-12px] block">
                    {errors.secretKey?.message}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="flex justify-between w-[100%] mt-4px mb-[16px]">
                <span className="flex items-center ">
                  <input
                    id="exampleCheck5"
                    type="checkbox"
                    className=" cursor-pointer rounded-[0.25em] mr-[6px] w-[1em] h-[1em] align-top bg-[#fff] bg-no-repeat bg-center bg-contain border-[1px] border-solid border-[#00000040] block appearance-none checked:bg-[#1e74fd] checked:border-[#1e74fd] "
                    {...register("confirmRule", {
                      required: "Field này là bắt buộc.",
                    })}
                  ></input>

                  <label
                    htmlFor="exampleCheck5"
                    className="text-[#adb5bd] text-[14px] cursor-pointer select-none"
                  >
                    Accept Term and Conditions
                  </label>
                </span>
              </div>
              {errors.confirmRule ? (
                <span className="text-[red] text-[14px] pl-[16px] mt-[-10px] block">
                  {errors.confirmRule?.message}
                </span>
              ) : (
                ""
              )}
              <div className="w-[100%]">
                <button
                  type="submit"
                  className="block h-[60px] leading-[60px] rounded-[7px] text-[14px] font-[600] bg-[#343a40] text-[#fff] text-center w-[100%] mb-[4px] "
                >
                  Register
                </button>
                <h6 className="font-[600] text-[#adb5bd] text-[14px] leading-[32px]">
                  Already have account
                  <Link
                    to={"/login"}
                    className="font-[600] text-[blue] ml-[4px]"
                  >
                    Login
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

export default RegisterPage;

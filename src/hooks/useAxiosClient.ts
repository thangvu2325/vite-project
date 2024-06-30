import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { userData } from "@/redux/selector";
import { loginSuccess } from "@/redux/slices/authSlice";
import { createAxios, tokenType } from "@/services/createInstance";

const useAxiosClient = () => {
  const { currentUser } = useAppSelector(userData);
  const dispatch = useAppDispatch();
  return createAxios(currentUser as tokenType, dispatch, loginSuccess);
};

export default useAxiosClient;

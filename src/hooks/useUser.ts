import { RootState } from "@/redux";
import IUser from "@/types/User";
import { collocateMemberName } from "@/utils";
import { useSelector } from "react-redux";

const useUser = () => {
  const { user } = useSelector((state: RootState) => state["auth"]);

  return { ...user, fullname: collocateMemberName(user!) } as IUser;
};

export default useUser;

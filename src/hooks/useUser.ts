import { RootState } from "@/redux";
import { useSelector } from "react-redux";

const useUser = () => {
  const { user } = useSelector((state: RootState) => state["auth"]);

  return user;
};

export default useUser;

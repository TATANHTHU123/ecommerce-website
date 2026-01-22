import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";

const WishlistWrapper = ({ children }) => {
  const { user } = useContext(AuthContext);

  return (
    <WishlistProvider user={user}>
      {children}
    </WishlistProvider>
  );
};

export default WishlistWrapper;

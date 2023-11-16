import { useAuth } from "../auth/AuthContext";

const Header = () => {

  const { signOut } = useAuth();

  return (
    <div className="py-3 px-5 flex">
      <button onClick={signOut} className="ml-auto text-star-dust-300">
        Sign Out
      </button>
    </div>
  )
}

export default Header;
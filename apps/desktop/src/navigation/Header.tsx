import { useAuth } from "../auth/AuthContext";

const Header = () => {

  const { signOut, user } = useAuth();

  return (
    <div className="border-b border-slate-200 py-3 px-5 flex">
      Header
      <p className="px-5">
      { user?.userId }
      </p>
      <button onClick={signOut} className="ml-auto">
        Sign Out
      </button>
    </div>
  )
}

export default Header;
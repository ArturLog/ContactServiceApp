import './App.css'
import Login from './components/account_panel/guest/login'
import ContactPanel from './components/contact_panel/guest/contact_panel'
import Account from './components/account_panel/user/account'
import UserContactPanel from './components/contact_panel/user/user_contact_panel'
import useStateContext from './hooks/useStateContext'


function App() {
  const { context, setContext, resetContext } = useStateContext();

  return (
    <>
      {context.userId == 0 ? <><Login /><ContactPanel /></> : <><Account /><UserContactPanel /></>}
    </>
  );
}

export default App;

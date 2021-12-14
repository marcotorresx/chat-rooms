import './App.css';
import {Switch} from 'react-router-dom'
import LoginPage from './Pages/LoginPage';
import Layout from './Pages/Layout';
import PrivateRoute from './Routers/PrivateRoute';
import PublicRoute from './Routers/PublicRoute';
import Room from './Pages/Room';
import Home from './Pages/Home';

function App() {

  return(
    
    <Switch>

      {/* LOGIN */}
      <PublicRoute path="/login" component={LoginPage}/>

      {/* LAYOUT */}
      <Layout>

        {/* HOME */}
        <PrivateRoute path="/" exact component={Home}/>

        {/* ROOM */}
        <PrivateRoute path="/room/:roomID" component={Room}/>

      </Layout>

    </Switch>

  )
}

export default App;

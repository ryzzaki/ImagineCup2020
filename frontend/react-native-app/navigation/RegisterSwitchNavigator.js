import { 
  createAppContainer,
  createSwitchNavigator
} from 'react-navigation';

import RegisterScreen from '../screens/RegisterScreen';
import MainScreen from '../screens/MainScreen';
import LoginScreen from '../screens/LoginScreen';

const Switch = createSwitchNavigator(//check passing arguments to switch navigator
  {
    app: MainScreen,
    register: RegisterScreen,
    login: LoginScreen
  },{
    initialRouteName: 'register'//TOCHANGE
  }
);

export default RegisterSwitchNavigator = createAppContainer(Switch);
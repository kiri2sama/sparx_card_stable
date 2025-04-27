declare module '@react-navigation/native' {
  export function useNavigation(): any;
  export function NavigationContainer(props: any): JSX.Element;
}

declare module '@react-navigation/stack' {
  export function createStackNavigator(): any;
  export interface StackNavigationProp<ParamList, RouteName extends keyof ParamList> {}
}

declare module '@react-navigation/bottom-tabs' {
  export function createBottomTabNavigator(): any;
  export interface BottomTabNavigationProp<ParamList, RouteName extends keyof ParamList> {}
}

declare module 'react-native-nfc-manager';
declare module 'react-native-qrcode-svg';
declare module '@react-native-async-storage/async-storage';
declare module 'expo-barcode-scanner';
declare module 'react-native-contacts'; 
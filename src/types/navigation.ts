export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Main: undefined;
  MyProfile: undefined;
  MyProfileEdit: { userDetail: any };
  Home: undefined;
  Profile: undefined;
  TodoList: undefined;
  ChangePassword: undefined;
  About: undefined;
  TaskDetail: { taskID: number };
  Notification: undefined;
  AboutApp: undefined;
  FAQ: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 
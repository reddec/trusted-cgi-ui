import {App} from "src/api/project_api";

export interface UserState {
  token: string;
  logging: boolean;
  apps: App[];
  appsLoading: boolean;
  selectedApp: App | undefined;
  loadingApp: boolean;
}

const state: UserState = {
  token: "",
  logging: false,
  appsLoading: false,
  apps: [],
  selectedApp: undefined,
  loadingApp: false,
};

export default state;

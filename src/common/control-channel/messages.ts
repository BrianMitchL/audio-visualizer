export type ViewType = "control" | "visualizer";
export interface View {
  id: string;
  type: ViewType;
}

export interface RegisterView {
  name: "register";
  data: View;
}

export interface UnregisterView {
  name: "unregister";
  data: View;
}

export interface PingView {
  name: "ping";
  data: View;
}

export type ControlMessages = RegisterView | UnregisterView | PingView;

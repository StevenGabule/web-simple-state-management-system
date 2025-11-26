declare interface ImportMeta {
  env?: {
    MODE: string;
  };
}
interface Window {
  __REDUX_DEVTOOLS_EXTENSION__?: {
    connect(options?: any): any;
    disconnect(): void;
  };
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
}

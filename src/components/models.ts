export interface ValidationInput {
  productData: any;
  state: any;
}

export interface ErrorInterface {
  message: string; severity: "error" | "warning"
}

export interface Component {
  component: (props: any) => JSX.Element;
  getError: (
    input: ValidationInput
  ) => void | ErrorInterface;
  sendData: (input: ValidationInput) => void;
  data_needed: string[];
}

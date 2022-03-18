export interface ValidationInput {
  productData: any;
  state: any;
}

export interface Component {
  component: (props: any) => JSX.Element;
  getError: (
    input: ValidationInput
  ) => void | { message: string; severity: "error" | "warning" };
  sendData: (input: ValidationInput) => void;
  data_needed: string[];
}

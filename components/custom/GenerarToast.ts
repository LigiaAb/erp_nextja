import { toast } from "sonner";

type Props = {
  message: string;
};

const GenerarToast = ({ message }: Props) => toast(message, { position: "bottom-right" });
export default GenerarToast;

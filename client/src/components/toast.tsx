import toast from "react-hot-toast";
import { WSMessageType } from "../../types";
import {
  IconCircleCheck,
  IconExclamationCircle,
  IconInfoCircle,
  Icon,
} from "@tabler/icons-react";
import { classnames } from "@/utils/classnames";

const pushToast = (message: JSX.Element | string, type: WSMessageType) => {
  const Icon: Record<WSMessageType, JSX.Element> = {
    Success: <IconCircleCheck className="text-white" />,
    Error: <IconExclamationCircle className="text-white" />,
    Info: <IconInfoCircle className="text-white" />,
  };

  toast(message, {
    icon: Icon[type as WSMessageType],
    position: "top-center",
    className: classnames(
      type === "Error" && "!bg-red-500 !text-white",
      type === "Success" && "!bg-green-500 !text-white",
      type === "Info" && "!bg-blue-500 !text-white"
    ),
    duration: 3000,
  });
};

export { pushToast };

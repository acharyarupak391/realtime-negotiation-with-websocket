import { IconCopy, IconCopyCheck } from "@tabler/icons-react";
import { Button } from "./Button";
import { useState } from "react";
import { handleCopy } from "@/utils/copy";
import { classnames } from "@/utils/classnames";

const CopyButton = ({
  text,
  children,
  className,
}: {
  text: string;
  children?: (copied: boolean) => React.ReactNode;
  className?: string;
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = async () => {
    await handleCopy(text);

    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Button
      onClick={handleCopyClick}
      variant="outlined"
      className={classnames(
        "w-max px-2 py-1 rounded-full border-dashed hover:shadow-none hover:!bg-gray-100 text-gray-700",
        className
      )}
      Icon={isCopied ? IconCopyCheck : IconCopy}
      disabled={isCopied}
      size="sm"
    >
      {children ? children(isCopied) : isCopied ? "Copied!" : "Copy"}
    </Button>
  );
};

export { CopyButton };

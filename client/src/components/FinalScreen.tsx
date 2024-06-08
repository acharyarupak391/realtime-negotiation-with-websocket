import { formatCurrency } from "@/utils/format";
import { IconCircleCheck, IconLogout } from "@tabler/icons-react";
import { Button } from "./Button";

const FinalScreen = ({
  amount,
  onClose,
}: {
  amount: number;
  onClose: () => void;
}) => {
  return (
    <div>
      <div className="p-6 py-8 rounded-xl shadow-lg">
        <IconCircleCheck className="text-green-600 mx-auto" size={96} />

        <div className="mt-4 text-center">
          <p className="text-lg text-gray-800">
            Both parties have agreed on the amount of
          </p>
          <p
            className="mt-3 text-2xl font-semibold text-green-700"
            title={formatCurrency(amount).long}
          >
            {formatCurrency(amount).short}
          </p>
        </div>
      </div>

      <Button
        onClick={onClose}
        Icon={IconLogout}
        className="mt-6 w-full"
        variant="outlined"
        size="md"
      >
        Close
      </Button>
    </div>
  );
};

export { FinalScreen };

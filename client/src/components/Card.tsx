import { useMemo } from "react";
import { RESPONSE_TYPE, RESPONSE_VALUE, SENDER } from "../../types";
import { Button } from "./Button";
import { formatCurrency } from "@/utils/format";
import { classnames } from "@/utils/classnames";

const Card = ({
  party,
  type,
  value,
  lastValue,
  isYourMessage,
}: {
  party: SENDER;
  type: RESPONSE_TYPE;
  value: string | RESPONSE_VALUE;
  lastValue?: string;
  isYourMessage?: boolean;
}) => {
  const { isSubmitted, isModified, isAgreed, isDisputed } = useMemo(() => {
    return {
      isSubmitted: type === RESPONSE_TYPE.SUBMIT,
      isModified: type === RESPONSE_TYPE.MODIFIED,
      isDisputed: value === RESPONSE_VALUE.DISPUTE,
      isAgreed: value === RESPONSE_VALUE.AGREE,
    };
  }, [type, value]);

  return (
    <div
      className={classnames(
        "shadow-md rounded-xl w-full max-w-96 p-4 flex justify-between",
        isYourMessage ? "bg-blue-600 ml-auto" : "bg-gray-200 mr-auto"
      )}
    >
      <div className="">
        <h2
          className={classnames(
            "text-lg font-medium",
            isYourMessage ? "text-white" : "text-gray-900"
          )}
        >
          Party {party}
        </h2>

        <span
          className={classnames(
            "mt-3 block",
            isYourMessage ? "text-gray-100" : "text-gray-700"
          )}
        >
          {isSubmitted
            ? "Submitted"
            : isModified
            ? "Modified"
            : isDisputed
            ? "Disputed"
            : isAgreed
            ? "Agreed on"
            : "No Action on"}{" "}
          the Amount
        </span>
      </div>
      <div className="flex flex-col justify-end">
        {isModified && lastValue && (
          <p
            title={formatCurrency(lastValue).long}
            className={classnames(
              "line-through mb-1 text-right text-lg",
              isYourMessage ? "text-blue-300" : "text-gray-400"
            )}
          >
            {formatCurrency(lastValue).short}
          </p>
        )}

        <p
          title={
            formatCurrency(!isNaN(Number(value)) ? value : lastValue || 0).long
          }
          className={classnames(
            "text-3xl font-bold max-w-48 text-ellipsis overflow-hidden",
            isYourMessage ? "text-white" : "text-gray-700"
          )}
        >
          {formatCurrency(!isNaN(Number(value)) ? value : lastValue || 0).short}
        </p>
      </div>
    </div>
  );
};

export { Card };

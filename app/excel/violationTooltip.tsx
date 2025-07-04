import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";

export function ViolationTooltip({
  content,
  errors,
}: {
  content: string | undefined;
  errors: string[] | undefined;
}) {
  return (
    <>
        {errors && 
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={errors && 'text-red-500'}>{content || "[blank]"}</div>
          </TooltipTrigger>
          <TooltipContent className="bg-red-50 p-3 rounded">
            {errors?.map((errorMessage) => (
              <p key={errorMessage}>{errorMessage}</p>
            ))}
          </TooltipContent>
        </Tooltip>
        }
        {!errors && <span>{content}</span>}
    </>
  );
}

import { cn } from "@/lib/utils";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverHandler,
} from "@material-tailwind/react";
import { IconMessage } from "@tabler/icons-react";
import { FunctionComponent, useState } from "react";

interface ProfileInfoPopoverProps {
  customerId: string;
  active?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
}

const ProfileInfoPopover: FunctionComponent<ProfileInfoPopoverProps> = ({
  customerId,
  active = false,
  onClick,
}) => {
  const [openPopover, setOpenPopover] = useState(false);
  const triggers = {
    onMouseEnter: () => setOpenPopover(true),
    onMouseLeave: () => setOpenPopover(false),
  };
  return (
    <Popover
      open={openPopover}
      handler={setOpenPopover}
      placement="left"
      offset={{
        mainAxis: -4,
        crossAxis: -40,
      }}
    >
      <PopoverHandler {...triggers}>
        <Button
          variant="text"
          className={cn(
            "p-0 text-center hover:bg-[#2196f3] hover:text-white duration-500 ",
            active ? "bg-blue-400 text-white" : ""
          )}
        >
          <div className="py-1 px-2" onClick={onClick}>
            <IconMessage size={32}></IconMessage>
          </div>
        </Button>
      </PopoverHandler>
      <PopoverContent
        {...triggers}
        className="z-[99999999] max-w-[24rem] border-[1px] border-[#ccc] "
      >
        <div className="">{customerId}</div>
      </PopoverContent>
    </Popover>
  );
};

export default ProfileInfoPopover;

import React from "react";
import Spinner from "./Spinner";
import { Button } from "./ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { CloseCircle, CloudCross } from "iconsax-react";

const SectionLoader = ({
  className,
  error,
  loading,
  refetch,
}: Partial<{
  className: string;
  loading: boolean;
  error: boolean;
  refetch: VoidFunction;
}>) => {
  if (!loading && !error) return <></>;

  if (error) {
    return (
      <Empty className="border border-gray-400">
        <EmptyHeader>
          <EmptyMedia variant={"icon"}>
            <CloudCross color="#222" />
          </EmptyMedia>
          <EmptyTitle>Fetch Error</EmptyTitle>
          <EmptyDescription>
            An error occured while making the request, please try again
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={refetch}>Retry</Button>
        </EmptyContent>
      </Empty>
    );
  }
  return (
    <div
      className={`min-h-[150px] text-[30px] flex items-center justify-center ${
        className || ""
      }`}
    >
      {loading && <Spinner className="text-default" />}
    </div>
  );
};

export default SectionLoader;

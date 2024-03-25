"use client";

import { Button } from "@/components/ui/button";
import { PageDetails } from "@/types/pageEditor";
import clsx from "clsx";
import { EyeOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Recursive from "./recursive";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

type Props = {
  liveMode?: boolean;
  pageDetails: PageDetails | undefined;
};

export default function PageEditor({ pageDetails, liveMode }: Props) {
  const state = useAppSelector((state) => state.pageEditor);
  const dispatch = useAppDispatch();
  const [containerHeight, setContainerHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.scrollHeight);
    }
  }, [state.editor]);

  useEffect(() => {
    console.log("liveMode", liveMode);

    dispatch({
      type: "pageEditor/TOGGLE_LIVE_MODE",
      payload: {
        value: liveMode,
      },
    });
  }, [liveMode]);

  useEffect(() => {
    const fetchData = async () => {
      if (!pageDetails) return;

      dispatch({
        type: "pageEditor/loadData",
        payload: {
          elements: pageDetails.content ? JSON.parse(pageDetails?.content) : null,
          withLive: !!liveMode,
        },
      });
    };
    fetchData();

    return () => {
      dispatch({
        type: "pageEditor/clearData",
      });
    };
  }, [pageDetails]);

  const handleClick = () => {
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {},
    });
  };

  const hanldeUnpreview = () => {
    dispatch({
      type: "pageEditor/setPreviewMode",
    });
  };

  return (
    <div
      className={clsx("use-automation-zoom-in h-full l mr-[385px]  transition-all  pb-40", {
        "!p-0 !mr-0": state.editor.previewMode === true || state.editor.liveMode === true,
        "!w-[850px]": state.editor.device === "Tablet",
        "!w-[420px]": state.editor.device === "Mobile",
        "w-full": state.editor.device === "Desktop",
        "bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px] overflow-scroll ": !state.editor.liveMode,
      })}
      onClick={handleClick}
    >
      {state.editor.previewMode && (
        <Button variant={"ghost"} size={"icon"} className="w-6 h-6 bg-slate-600 p-[2px] fixed top-0 left-0 z-[100]" onClick={hanldeUnpreview}>
          <EyeOff />
        </Button>
      )}
      {Array.isArray(state.editor.elements) &&
        state.editor.elements.map((childElement) => <Recursive key={childElement.id} element={childElement} />)}
    </div>
  );
}
"use client";
import { Badge } from "@/components/ui/badge";
import { EditorBtns } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { EditorElement, customSettings } from "@/types/pageEditor";
import { Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { elements } from "..";
import { v4 } from "uuid";
import Recursive from "../../editor/recursive";
import useStyles from "@/hooks/useStyles";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

type Props = {
  element: EditorElement<EditorElement[]>;
};

export default function MainContainer({ element }: Props) {
  const { id, content, name, styles, type } = element;
  const state = useAppSelector((state) => state.pageEditor);
  const dispatch = useAppDispatch();

  const selectItemAndNotLiveMode = state.editor.selectedElement.id === id && !state.editor.liveMode;
  const isLiveMode = state.editor.liveMode;
  const canDrag = !isLiveMode;
  const { activeStyle } = useStyles({ styles });
  const device = state.editor.device;

  const handleOnDrop = (e: React.DragEvent, type: string) => {
    e.stopPropagation();
    if (!canDrag) return;

    const componentType = e.dataTransfer.getData("componentType") as EditorBtns;
    if (componentType === "__body") return;

    const Element = elements.find((element) => element.id === componentType);

    if (!Element) {
      console.log("Element not found");
      return;
    }

    dispatch({
      type: "pageEditor/addAnElement",
      payload: {
        elementDetails: {
          ...Element.defaultPayload,
          content: Array.isArray(Element.defaultPayload.content)
            ? Element.defaultPayload.content.map((element: EditorElement) => ({
                ...element,
                id: v4(),
              }))
            : Element.defaultPayload.content,
          id: v4(),
        },
        containerId: id,
      },
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleOnCLickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "pageEditor/setSelectedAnElement",
      payload: element,
    });
  };
  const handleDeleteElement = () => {
    dispatch({
      type: "pageEditor/deleteAnElement",
      payload: state.editor.selectedElement,
    });
  };

  return (
    <div
      style={activeStyle}
      className={cn("relative z-50 transition-all group", {
        "max-w-full w-full": type === "container" || type === "2Col",
        "h-fit": type === "container",
        "h-full": id === "__body",
        "overflow-scroll ": type === "__body",
        "flex flex-col md:!flex-row": type === "2Col",
        "!border-blue-500": state.editor.selectedElement.id === id && !state.editor.liveMode && state.editor.selectedElement.type !== "__body",
        "!border-yellow-400 !border-4":
          state.editor.selectedElement.id === id && !state.editor.liveMode && state.editor.selectedElement.type === "__body",
        "!border-solid": state.editor.selectedElement.id === id && !state.editor.liveMode || !state.editor.previewMode,
        "border-dashed border-[1px] border-slate-300 p-4": !state.editor.liveMode || !state.editor.previewMode,
      })}
      onDrop={(e) => handleOnDrop(e, id)}
      onDragOver={handleDragOver}
      onClick={handleOnCLickBody}
    >
      {state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
        <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg z-50">{state.editor.selectedElement.name}</Badge>
      )}

      {Array.isArray(content) && content.map((childElement) => <Recursive element={childElement} key={childElement.id} />)}

      {state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
        <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white z-50">
          <Trash
            className="cursor-pointer"
            size={16}
            onClick={() => {
              handleDeleteElement();
            }}
          />
        </div>
      )}
      {activeStyle.backgroundVideo && (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-[1] opacity-50 ">
          <video autoPlay loop muted className="w-full h-full object-cover">
            <source src={activeStyle.backgroundVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}



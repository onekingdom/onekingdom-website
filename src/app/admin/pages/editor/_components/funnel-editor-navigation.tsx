"use client";

import { DeviceTypes, useEditor } from "@/providers/editor/editor-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";
import { ArrowLeftCircle, EyeIcon, Laptop, Redo2, Smartphone, Tablet, Undo2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FocusEventHandler, useEffect } from "react";
import { toast } from "sonner";
import { PageDetails } from "@/types/PageBuilder";

type Props = {
  funnelId: string;
  funnelPageDetails: PageDetails;
  subaccountId: string;
};

export default function FunnelEditorNavigation({ funnelId, funnelPageDetails, subaccountId }: Props) {
  const router = useRouter();
  const { dispatch, state } = useEditor();



  useEffect(() => {
    dispatch({
      type: "SET_FUNNELPAGE_ID",
      payload: {
        funnelPageId: funnelPageDetails.id,
      },
    });
  }, [funnelPageDetails]);




  const handleOnBlurTitleChange: FocusEventHandler<HTMLInputElement> = async (event) => {
    if (event.target.value === funnelPageDetails.name) return;
    if (event.target.value) {
      // await upsertFunnelPage(
      //   subaccountId,
      //   {
      //     id: funnelPageDetails.id,
      //     name: event.target.value,
      //     order: funnelPageDetails.order,
      //   },
      //   funnelId
      // );
      toast.success("Updated Page Title");
      router.refresh();
    } else {
      toast.error("Page Title cannot be empty");
      event.target.value = funnelPageDetails.name;
    }
  };

  const handlePreviewClick = () => {
    dispatch({ type: "TOGGLE_PREVIEW_MODE" });
    dispatch({ type: "TOGGLE_LIVE_MODE" });
  };
  const handleUdo = () => {
    dispatch({
      type: "UNDO",
    });
  };
  const handleRedo = () => {
    dispatch({
      type: "REDO",
    });
  };
  const handleOnSave = async () => {
    const content = JSON.stringify(state.editor.elements);
    try {
      // const response = await upsertFunnelPage(
      //   subaccountId,
      //   {
      //     ...funnelPageDetails,
      //     content,
      //   },
      //   funnelId
      // );

      // await saveActivityLogsNotification({
      //   agencyId: undefined,
      //   description: `Update a funnel page | ${response?.name}`,
      //   subaccountId: subaccountId,
      // });
      toast.success("Saved");
    } catch (error) {
      toast.error("Failed to save");
    }
  };
  return (
    <TooltipProvider>
      <nav
        className={cn("border-b-[1px] flex items-center justify-between p-6 gap-2 transition-all", {
          "!h-0 !p-0 !overflow-hidden": state.editor.previewMode,
        })}
      >
        <aside className="flex items-center gap-4 max-w-[206px] w-[300px]">
          <Link href={`/subaccount/${subaccountId}/funnels/${funnelId}`}>
            <ArrowLeftCircle />
          </Link>
          <div className="flex flex-col w-full">
            <Input defaultValue={funnelPageDetails.name} className="border-none h-5 m-0 p-0 text-lg" onBlur={handleOnBlurTitleChange} />
            <span className="text-sm text-muted-foreground">Path: /{funnelPageDetails.pathName}</span>
          </div>
        </aside>
        <aside>
          <Tabs
            defaultValue="Desktop"
            className="w-fit"
            value={state.editor.device}
            onValueChange={(value) => {
              dispatch({
                type: "CHANGE_DEVICE",
                payload: { device: value as DeviceTypes },
              });
            }}
          >
            <TabsList className="grid w-full grid-cols-3 bg-transparent h-fit">
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger value="Desktop" className="data-[state=active]:bg-muted size-10 p-0">
                    <Laptop />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Desktop</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger value="Tablet" className="w-10 h-10 p-0 data-[state=active]:bg-muted">
                    <Tablet />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tablet</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger value="Mobile" className="w-10 h-10 p-0 data-[state=active]:bg-muted">
                    <Smartphone />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mobile</p>
                </TooltipContent>
              </Tooltip>
            </TabsList>
          </Tabs>
        </aside>
        <aside className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hover:bg-slate-800" onClick={handlePreviewClick}>
            <EyeIcon />
          </Button>
          <Button disabled={!(state.history.currentIndex > 0)} onClick={handleUdo} variant="ghost" size="icon" className="hover:bg-slate-800 mr-4">
            <Undo2 />
          </Button>
          <Button
            disabled={!(state.history.currentIndex < state.history.history.length - 1)}
            onClick={handleRedo}
            variant="ghost"
            size="icon"
            className="hover:bg-slate-800 mr-4"
          >
            <Redo2 />
          </Button>
          <div className="flex flex-col items-center mr-4">
            <div className="flex flex-row items-center gap-4">
              Draft
              <Switch disabled defaultChecked={true} />
              Publish
            </div>
            <span className="text-muted-foreground text-sm">Laste updated {funnelPageDetails.updatedAt.toLocaleDateString()}</span>
          </div>
          <Button onClick={handleOnSave}>Save</Button>
        </aside>
      </nav>
    </TooltipProvider>
  );
}
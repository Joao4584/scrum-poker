import { AccessorKeyColumnDef, createColumnHelper } from "@tanstack/react-table";
import React from "react";
import { Ban, Check, Clock, LayoutGrid, X } from "lucide-react";
import { useI18n } from "@/locales/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/modules/shared/ui/tooltip";
import { ServiceTableOutput } from "../../services/get-panel-services";

const columnHelper = createColumnHelper<ServiceTableOutput>();

type StatusStyle = {
  icon: React.ElementType;
  bgColor: string;
  name: string;
};

export function useColumns() {
  const t = useI18n();

  const statusStyles: { [key: string]: StatusStyle } = {
    DECLINED: { icon: X, bgColor: "bg-red-500", name: t("dashboard.friends.serviceTable.statuses.declined") },
    EXPIRED: { icon: Clock, bgColor: "bg-gray-500", name: t("dashboard.friends.serviceTable.statuses.expired") },
    FINISHED: { icon: Check, bgColor: "bg-green-500", name: t("dashboard.friends.serviceTable.statuses.finished") },
    CANCELLED: { icon: Ban, bgColor: "bg-red-500", name: t("dashboard.friends.serviceTable.statuses.cancelled") },
    DEFAULT: { icon: LayoutGrid, bgColor: "bg-transparent", name: t("dashboard.friends.serviceTable.statuses.unknown") },
    ACCEPTED: { icon: Check, bgColor: "bg-blue-500", name: t("dashboard.friends.serviceTable.statuses.accepted") },
  };

  const getStatusStyles = (status: string) => {
    return statusStyles[status] || statusStyles.DEFAULT;
  };

  return [
    columnHelper.accessor("dispatched", {
      meta: t("dashboard.friends.serviceTable.statusMeta"),
      cell: ({ getValue }) => {
        const status = getValue()?.info?.status;

        if (!status) return null;

        const { icon: Icon, bgColor, name } = getStatusStyles(status);
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`flex h-10 w-10 items-center justify-center rounded-md ${bgColor}`}>
                  <Icon className="size-4 text-white" />
                </div>
              </TooltipTrigger>
              <TooltipContent>{t("dashboard.friends.serviceTable.statusTooltip", { name })}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    }),
    columnHelper.accessor("protocol", {
      meta: t("dashboard.friends.serviceTable.protocolMeta"),
      cell: ({ row }) => {
        const { protocol, serviceType } = row.original;
        return (
          <div className="w-40">
            <p className="truncate !capitalize">{protocol}</p>
            <p className="font-semibold">{serviceType.abbreviation}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("dispatched.info.kmTotal", {
      meta: t("dashboard.friends.serviceTable.kmTotalMeta"),
      cell: ({ row }) => {
        const { dispatched } = row.original;
        return (
          <div className="w-40">
            {dispatched?.info.kmTotal && <p>{dispatched.info.kmTotal.toFixed(1)} Km</p>}
            {dispatched?.info.prevision && <p>{t("dashboard.friends.serviceTable.forecast", { minutes: dispatched.info.prevision })}</p>}
          </div>
        );
      },
    }),
    columnHelper.accessor("beneficiaryVehicleIsArmored", {
      meta: t("dashboard.friends.serviceTable.vehicleMeta"),
      cell: ({ row }) => {
        const { beneficiaryVehicleModel, beneficiaryVehicleLicensePlate } = row.original;
        return (
          <div className="w-40">
            <p className="truncate !capitalize">{beneficiaryVehicleModel}</p>
            <p>{beneficiaryVehicleLicensePlate}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("beneficiaryDocument", {
      meta: t("dashboard.friends.serviceTable.beneficiaryMeta"),
    }),
    columnHelper.accessor("beneficiaryCellphone", {
      meta: t("dashboard.friends.serviceTable.beneficiaryPhoneMeta"),
    }),
    columnHelper.accessor("serviceType.abbreviation", {
      meta: t("dashboard.friends.serviceTable.totalFareMeta"),
    }),
  ] as AccessorKeyColumnDef<ServiceTableOutput>[];
}

import { AccessorKeyColumnDef, createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import { ServiceTableOutput } from '../../services/get-panel-services';
import { Ban, Check, Clock, LayoutGrid, X } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/modules/shared/ui/tooltip';
const columnHelper = createColumnHelper<ServiceTableOutput>();

export function useColumns() {

const statusStyles: { [key: string]: { icon: React.ElementType; bgColor: string, name: string } } = {
  DECLINED: { icon: X, bgColor: 'bg-red-500', name: "Recusado" },
  EXPIRED: { icon: Clock, bgColor: 'bg-gray-500', name: "Expirado" },
  FINISHED: { icon: Check, bgColor: 'bg-green-500', name: "Finalizado" },
  CANCELLED: { icon: Ban, bgColor: 'bg-red-500', name: "Cancelado" },
  DEFAULT: { icon: LayoutGrid, bgColor: 'bg-transparent', name: "Não Identificado" },
  ACCEPTED: { icon: Check, bgColor: 'bg-blue-500', name: "Aceito" },
};

const getStatusStyles = (status: string) => {
  return statusStyles[status] || statusStyles.DEFAULT;
};

  return [
    columnHelper.accessor('dispatched', {
      meta: "Status",
      cell: ({ getValue }) => {
        const status = getValue()?.info?.status;

        if(!status) return null;
        
        const { icon: Icon, bgColor, name } = getStatusStyles(status);
        return (
          <TooltipProvider>
             <Tooltip>
             <TooltipTrigger asChild>
                <div className={`w-10 h-10 rounded-md ${bgColor} flex items-center justify-center`}>
                      <Icon className="text-white size-4" />
                </div>
             </TooltipTrigger>
             <TooltipContent >
                Serviço {name}
             </TooltipContent>
             </Tooltip>
          </TooltipProvider>
        
        );
      }
    }),
    columnHelper.accessor('protocol', {
      meta: "Protocolo",
      cell: ({ row }) => {
        const { protocol, serviceType } = row.original;
        return (
          <div className='w-40'>
            <p className='truncate !capitalize'>{protocol}</p>
            <p className='font-semibold'>{serviceType.abbreviation}</p>
          </div>
        );
      }
    }),
    columnHelper.accessor('dispatched.info.kmTotal', {
      meta: "KM Total",
      cell: ({ row }) => {
        const { dispatched } = row.original;
        return (
          <div className='w-40'>
            {dispatched?.info.kmTotal && <p>{dispatched.info.kmTotal.toFixed(1)} Km</p>}
            {dispatched?.info.prevision && <p>Previsão: {dispatched.info.prevision} min</p>}
          </div>
        );
      }
    }),
    columnHelper.accessor('beneficiaryVehicleIsArmored', {
      meta: "Veículo",
      cell: ({ row }) => {
        const { beneficiaryVehicleModel, beneficiaryVehicleLicensePlate } = row.original;
        return (
          <div className='w-40'>
            <p className='truncate !capitalize'>{beneficiaryVehicleModel}</p>
            <p>{beneficiaryVehicleLicensePlate}</p>
          </div>
        );
      }
    }),
    columnHelper.accessor('beneficiaryDocument', {
      meta: "Beneficiário",
    }),
    columnHelper.accessor('beneficiaryCellphone', {
      meta: "Beneficiário Telefone",
    }),
    columnHelper.accessor('serviceType.abbreviation', {
      meta: "Total Tarifa",
    }),
  ] as AccessorKeyColumnDef<ServiceTableOutput>[];
}

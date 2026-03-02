"use client";

import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, UserCheck, UserRoundX, Users } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/locales/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/shared/ui/avatar";
import { Button } from "@/modules/shared/ui/button";
import { DataTableEmptyState } from "@/modules/shared/components/data-table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/modules/shared/ui/dialog";
import { useListFriends } from "../../hooks/use-friends";
import { AddFriendDialog } from "./add-friend-dialog";
import { acceptFriendRequest } from "../../services/accept-friend-request";
import { deleteFriendRequest } from "../../services/delete-friend-request";
import { FriendRelationshipItem } from "../../services/get-list-friends";

function FriendRow({
  item,
  action,
  actionLabel,
  actionIcon: ActionIcon,
  secondaryAction,
  secondaryActionLabel,
}: {
  item: FriendRelationshipItem;
  action?: () => void;
  actionLabel?: string;
  actionIcon?: React.ElementType;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card/50 p-3">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          {item.user.avatar_url ? <AvatarImage src={item.user.avatar_url} /> : null}
          <AvatarFallback>{item.user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{item.user.name}</p>
          <p className="text-xs text-muted-foreground">{item.user.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {secondaryAction && secondaryActionLabel ? (
          <Button type="button" variant="outline" size="sm" onClick={secondaryAction}>
            {secondaryActionLabel}
          </Button>
        ) : null}
        {action && actionLabel ? (
          <Button type="button" size="sm" onClick={action}>
            {ActionIcon ? <ActionIcon className="h-4 w-4" /> : null}
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function FriendListTable() {
  const t = useI18n();
  const queryClient = useQueryClient();
  const { data, isLoading } = useListFriends();

  const acceptMutation = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      toast(t("dashboard.friends.list.toasts.acceptSuccessTitle"), {
        description: t("dashboard.friends.list.toasts.acceptSuccessDescription"),
      });
      queryClient.invalidateQueries({ queryKey: ["friends:list"] });
    },
    onError: () => {
      toast(t("dashboard.friends.list.toasts.acceptErrorTitle"), {
        description: t("dashboard.friends.list.toasts.acceptErrorDescription"),
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: deleteFriendRequest,
    onSuccess: () => {
      toast(t("dashboard.friends.list.toasts.removeSuccessTitle"), {
        description: t("dashboard.friends.list.toasts.removeSuccessDescription"),
      });
      queryClient.invalidateQueries({ queryKey: ["friends:list"] });
      queryClient.invalidateQueries({ queryKey: ["friends:search"] });
    },
    onError: () => {
      toast(t("dashboard.friends.list.toasts.removeErrorTitle"), {
        description: t("dashboard.friends.list.toasts.removeErrorDescription"),
      });
    },
  });

  const requests = data?.recent_requests ?? [];
  const friends = data?.friends ?? [];
  const isMutating = acceptMutation.isPending || removeMutation.isPending;

  if (!isLoading && requests.length === 0 && friends.length === 0) {
    return (
      <div className="space-y-3">
        <div className="mb-3 flex w-full items-center justify-between gap-2">
          <Button type="button" variant="outline">
            {t("dashboard.friends.list.requestButton", { count: 0 })}
          </Button>
          <AddFriendDialog />
        </div>
        <DataTableEmptyState
          title={t("dashboard.friends.table.emptyTitle")}
          description={t("dashboard.friends.list.emptyDescription")}
          icon={Users}
        />
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="mb-3 flex w-full items-center justify-between gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" variant="outline">
              {t("dashboard.friends.list.requestButton", { count: requests.length })}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{t("dashboard.friends.list.requestsDialogTitle")}</DialogTitle>
              <DialogDescription>{t("dashboard.friends.list.requestsDialogDescription")}</DialogDescription>
            </DialogHeader>
            <div className="max-h-[360px] space-y-3 overflow-y-auto">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">{t("dashboard.friends.list.loading")}</p>
              ) : null}
              {!isLoading && requests.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("dashboard.friends.list.noRecentRequests")}</p>
              ) : null}
              {requests.map((request) => (
                <FriendRow
                  key={request.public_id}
                  item={request}
                  action={
                    request.status === "pending_received"
                      ? () => acceptMutation.mutate(request.public_id)
                      : undefined
                  }
                  actionLabel={
                    request.status === "pending_received"
                      ? t("dashboard.friends.list.actions.accept")
                      : undefined
                  }
                  actionIcon={request.status === "pending_received" ? Check : undefined}
                  secondaryAction={() => removeMutation.mutate(request.public_id)}
                  secondaryActionLabel={
                    request.status === "pending_sent"
                      ? t("dashboard.friends.list.actions.cancel")
                      : t("dashboard.friends.list.actions.decline")
                  }
                />
              ))}
            </div>
          </DialogContent>
        </Dialog>
        <AddFriendDialog />
      </div>

      <div className="space-y-6">
        <section className="space-y-3 rounded-xl border border-border bg-card/40 p-4">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">
              {t("dashboard.friends.list.friendsTitle", { count: friends.length })}
            </h2>
          </div>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">{t("dashboard.friends.list.loading")}</p>
          ) : null}
          {!isLoading && friends.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("dashboard.friends.list.noFriends")}</p>
          ) : null}
          {friends.map((friend) => (
            <FriendRow
              key={friend.public_id}
              item={friend}
              action={() => removeMutation.mutate(friend.public_id)}
              actionLabel={t("dashboard.friends.list.actions.remove")}
              actionIcon={UserRoundX}
            />
          ))}
        </section>
      </div>

      {isMutating ? (
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          {t("dashboard.friends.list.processing")}
        </div>
      ) : null}
    </React.Fragment>
  );
}

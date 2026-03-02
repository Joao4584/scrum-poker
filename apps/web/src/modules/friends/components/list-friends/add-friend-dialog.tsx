"use client";

import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import { useI18n } from "@/locales/client";
import { toast } from "sonner";
import { Button } from "@/modules/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/shared/ui/dialog";
import { Input } from "@/modules/shared/ui/input";
import { Label } from "@/modules/shared/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/shared/ui/avatar";
import { searchUsers } from "@/modules/friends/services/search-users";
import { sendFriendRequest } from "@/modules/friends/services/send-friend-request";
import { useUser } from "@/modules/profile/hooks/use-user";
import { deleteFriendRequest } from "@/modules/friends/services/delete-friend-request";
import { SearchUserResult } from "@/modules/friends/services/search-users";

type SearchUsersCache = { data: SearchUserResult[] };

export function AddFriendDialog() {
  const t = useI18n();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const { data: currentUser } = useUser();

  const trimmedQuery = query.trim();
  const canSearch = trimmedQuery.length >= 2;

  const { data, isFetching } = useQuery({
    queryKey: ["friends:search", submittedQuery],
    queryFn: () => searchUsers(submittedQuery),
    enabled: open && submittedQuery.length >= 2,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
  });

  const results = useMemo(() => {
    const list = data?.data ?? [];
    if (!currentUser?.public_id) {
      return list;
    }
    return list.filter((user) => user.public_id !== currentUser.public_id);
  }, [data, currentUser?.public_id]);

  const requestMutation = useMutation({
    mutationFn: (friendPublicId: string) => sendFriendRequest(friendPublicId),
    onMutate: async (friendPublicId) => {
      await queryClient.cancelQueries({
        queryKey: ["friends:search", submittedQuery],
      });
      const previous = queryClient.getQueryData<{
        data: Array<{
          public_id: string;
          friendship?: { status: string; public_id?: string | null };
        }>;
      }>(["friends:search", submittedQuery]);

      if (previous) {
        queryClient.setQueryData(["friends:search", submittedQuery], {
          ...previous,
          data: previous.data.map((item) =>
            item.public_id === friendPublicId
              ? {
                  ...item,
                  friendship: { status: "pending_sent", public_id: null },
                }
              : item,
          ),
        });
      }

      return { previous };
    },
    onSuccess: (payload, friendPublicId) => {
      toast(t("dashboard.friends.addDialog.toasts.requestSentTitle"), {
        description: t("dashboard.friends.addDialog.toasts.requestSentDescription"),
      });
      queryClient.setQueryData(
        ["friends:search", submittedQuery],
        (current?: SearchUsersCache) => {
          if (!current) return current;
          return {
            ...current,
            data: current.data.map((item) =>
              item.public_id === friendPublicId
                ? {
                    ...item,
                    friendship: {
                      status: "pending_sent",
                      public_id: payload.public_id,
                    },
                  }
                : item,
            ),
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: ["friends:list"] });
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["friends:search", submittedQuery], context.previous);
      }
      toast(t("dashboard.friends.addDialog.toasts.requestErrorTitle"), {
        description: t("dashboard.friends.addDialog.toasts.requestErrorDescription"),
      });
    },
  });

  const handleAdd = (friendPublicId: string) => {
    requestMutation.mutate(friendPublicId);
  };

  const cancelMutation = useMutation({
    mutationFn: (publicId: string) => deleteFriendRequest(publicId),
    onSuccess: (_payload, publicId) => {
      toast(t("dashboard.friends.addDialog.toasts.cancelTitle"), {
        description: t("dashboard.friends.addDialog.toasts.cancelDescription"),
      });
      queryClient.setQueryData(
        ["friends:search", submittedQuery],
        (current?: SearchUsersCache) => {
          if (!current) return current;
          return {
            ...current,
            data: current.data.map((item) =>
              item.friendship?.public_id === publicId
                ? {
                    ...item,
                    friendship: { status: "none", public_id: null },
                  }
                : item,
            ),
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: ["friends:list"] });
    },
    onError: () => {
      toast(t("dashboard.friends.addDialog.toasts.cancelErrorTitle"), {
        description: t("dashboard.friends.addDialog.toasts.cancelErrorDescription"),
      });
    },
  });

  const handleSearch = () => {
    if (!canSearch) return;
    setSubmittedQuery(trimmedQuery);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="gap-2">
          <UserPlus className="h-4 w-4" />
          {t("dashboard.friends.addDialog.open")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("dashboard.friends.addDialog.title")}</DialogTitle>
          <DialogDescription>{t("dashboard.friends.addDialog.description")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="friend-search">{t("dashboard.friends.addDialog.nameLabel")}</Label>
            <div className="flex gap-2">
              <Input
                id="friend-search"
                placeholder={t("dashboard.friends.addDialog.searchPlaceholder")}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleSearch}
                disabled={!canSearch || isFetching}
              >
                {isFetching ? t("dashboard.friends.addDialog.searching") : t("dashboard.friends.addDialog.search")}
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            {submittedQuery.length >= 2 && !isFetching && results.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t("dashboard.friends.addDialog.noneFound")}
              </p>
            ) : null}
            {results.map((user) => {
              const status = user.friendship?.status ?? "none";
              return (
                <div
                  key={user.public_id}
                  className="flex items-center justify-between rounded-md border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      {user.avatar_url ? (
                        <AvatarImage src={user.avatar_url} />
                      ) : null}
                      <AvatarFallback>
                        {user.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      if (status === "pending_sent" && user.friendship?.public_id) {
                        cancelMutation.mutate(user.friendship.public_id);
                        return;
                      }
                      if (status === "none") {
                        handleAdd(user.public_id);
                      }
                    }}
                    disabled={
                      requestMutation.isPending ||
                      cancelMutation.isPending ||
                      status === "accepted" ||
                      status === "pending_received"
                    }
                  >
                    {status === "pending_sent"
                      ? t("dashboard.friends.addDialog.actions.cancel")
                      : status === "pending_received"
                        ? t("dashboard.friends.addDialog.actions.received")
                        : status === "accepted"
                          ? t("dashboard.friends.addDialog.actions.friend")
                          : t("dashboard.friends.addDialog.actions.add")}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

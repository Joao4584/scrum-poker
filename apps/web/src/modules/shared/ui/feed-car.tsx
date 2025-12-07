"use client";

import * as React from "react";
import { Card } from "./card";
import { Badge } from "./badge";

interface FeedCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  category?: string;
  tags?: string[];
  image?: string;
  timeAgo?: string;
  readTime?: string;
  engagement?: {
    likes?: number;
    comments?: number;
    shares?: number;
  };
  onClick?: () => void;
}

const FeedCard = React.forwardRef<HTMLDivElement, FeedCardProps>(
  (
    {
      icon,
      title,
      description,
      category,
      tags = [],
      image,
      timeAgo,
      readTime,
      engagement,
      onClick,
      ...props
    },
    ref,
  ) => (
    <Card
      ref={ref}
      className="cursor-pointer hover:bg-card/80 transition-colors group"
      onClick={onClick}
      {...props}
    >
      <div className="p-4">
        {/* Header com ícone e categoria */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {icon && <div className="text-accent text-lg">{icon}</div>}
            {category && (
              <Badge variant="outline" className="text-accent border-accent/50">
                {category}
              </Badge>
            )}
          </div>
        </div>

        {/* Título */}
        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Descrição */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{description}</p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Footer com metadata */}
        <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
          <div className="flex gap-2">
            {timeAgo && <span>{timeAgo}</span>}
            {readTime && <span>{readTime}</span>}
          </div>

          {engagement && (
            <div className="flex gap-3">
              {engagement.likes !== undefined && <span>👍 {engagement.likes}</span>}
              {engagement.comments !== undefined && <span>💬 {engagement.comments}</span>}
              {engagement.shares !== undefined && <span>🔗 {engagement.shares}</span>}
            </div>
          )}
        </div>
      </div>
    </Card>
  ),
);
FeedCard.displayName = "FeedCard";

export { FeedCard, type FeedCardProps };

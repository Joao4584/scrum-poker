"use client";

import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";

interface UserDropdownProps {
  onClose?: () => void;
}

export function UserDropdown({ onClose }: UserDropdownProps) {
  return (
    <div className="w-64 bg-card border border-border rounded-lg shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-2xl">
            👤
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground text-sm truncate">Joao Roberto</p>
            <p className="text-xs text-muted-foreground truncate">@joao4584</p>
          </div>
        </div>

        <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg py-2">
          ✨ Upgrade
        </Button>
      </div>

      {/* Primary Menu */}
      <nav className="p-2 space-y-1">
        <DropdownItem icon="👤" label="Your profile" />
        <DropdownItem icon="💎" label="Core wallet" />
        <DropdownItem icon="🏷️" label="DevCard" />
      </nav>

      <Separator />

      {/* Theme Toggle */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">Theme</span>
          <div className="flex gap-2">
            <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-lg">
              🌙
            </button>
            <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-lg">
              ☀️
            </button>
            <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-lg">
              🔄
            </button>
          </div>
        </div>
      </div>

      {/* Settings */}
      <nav className="p-2 space-y-1">
        <DropdownItem icon="⚙️" label="Settings" />
        <DropdownItem icon="🔔" label="Subscriptions" />
        <DropdownItem icon="🏢" label="Organizations" />
        <DropdownItem icon="👥" label="Invite friends" />
        <DropdownItem icon="📊" label="Ads dashboard" />
      </nav>

      <Separator />

      {/* Help & Support */}
      <nav className="p-2 space-y-1">
        <DropdownItem icon="📝" label="Changelog" />
        <DropdownItem icon="📢" label="Advertise" isExternal />
        <DropdownItem icon="📖" label="Docs" isExternal />
        <DropdownItem icon="❓" label="Support" isExternal />
      </nav>

      <Separator />

      {/* Footer */}
      <div className="p-3">
        <DropdownItem icon="🚪" label="Log out" isDanger />
      </div>

      {/* Terms */}
      <div className="px-3 py-2 text-xs text-muted-foreground border-t border-border flex gap-2 flex-wrap">
        <a href="#" className="hover:underline">
          Terms
        </a>
        <a href="#" className="hover:underline">
          Privacy
        </a>
        <a href="#" className="hover:underline">
          Guidelines
        </a>
      </div>
    </div>
  );
}

interface DropdownItemProps {
  icon: string;
  label: string;
  isExternal?: boolean;
  isDanger?: boolean;
  onClick?: () => void;
}

function DropdownItem({
  icon,
  label,
  isExternal = false,
  isDanger = false,
  onClick,
}: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
        isDanger
          ? "text-destructive hover:bg-destructive/10"
          : "text-foreground hover:bg-secondary"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {isExternal && <span className="text-xs">↗</span>}
    </button>
  );
}

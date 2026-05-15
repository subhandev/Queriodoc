import type { Appearance } from "@clerk/types";

/** Shared Clerk UI tokens so UserButton, UserProfile, and modals match Queriodoc. */
export const clerkAppearance: Appearance = {
  variables: {
    colorPrimary: "#7c6dfa",
    colorBackground: "#111114",
    colorInputBackground: "oklch(0.22 0.008 280)",
    colorNeutral: "oklch(0.62 0.012 280)",
    colorText: "oklch(0.955 0.005 280)",
    colorTextSecondary: "oklch(0.62 0.012 280)",
    borderRadius: "0.75rem",
  },
  elements: {
    userButtonPopoverCard:
      "bg-[#111114] border border-[rgba(255,255,255,0.08)] shadow-2xl rounded-xl",
    userButtonPopoverActionButton:
      "text-foreground hover:bg-white/[0.06] rounded-lg transition-colors",
    userButtonPopoverActionButtonText: "text-[13px]",
    userButtonPopoverFooter: "hidden",
    userPreviewMainIdentifier: "text-foreground",
    userPreviewSecondaryIdentifier: "text-muted-foreground text-[12px]",
    modalContent: "bg-[#111114] border border-[rgba(255,255,255,0.08)]",
    card: "bg-[#111114] border border-[rgba(255,255,255,0.08)] shadow-xl",
    navbar: "bg-[#111114]",
    headerTitle: "text-foreground",
    socialButtonsBlockButton: "border-[rgba(255,255,255,0.1)] bg-white/[0.03] text-foreground",
    formButtonPrimary: "bg-primary hover:opacity-90 text-primary-foreground",
    formFieldInput:
      "bg-input/30 border-[rgba(255,255,255,0.1)] text-foreground placeholder:text-muted-foreground",
    footerActionLink: "text-primary hover:text-primary",
  },
};

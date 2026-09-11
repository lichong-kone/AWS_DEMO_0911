"use client";

import type { FrogState, Species } from "@/lib/types";
import { AssetImage } from "./AssetImage";
import { FrogSprite } from "./FrogSprite";

// design-v3 pose assets (public/art/characters/*.svg)
export type Pose =
  | "idle"
  | "reading"
  | "packing"
  | "walking"
  | "waving"
  | "returning"
  | "sleeping"
  | "mail";

/** Only the frog has full pose art; otter/hedgehog ship idle only. */
function poseSrc(species: Species, pose: Pose): string {
  if (species !== "frog" || pose === "idle") {
    return `/art/characters/${species}-idle.svg`;
  }
  return `/art/characters/frog-${pose}.svg`;
}

export interface PoseContext {
  /** unopened mail waiting at home */
  hasNewMail?: boolean;
  /** local hour 0-23; drives the sleeping pose at night */
  hour?: number;
}

/**
 * Pick the pose art for the current situation. Exported (and pure) so the
 * mapping is unit-testable.
 */
export function poseForState(state: FrogState, ctx: PoseContext = {}): Pose {
  switch (state) {
    case "TRAVELING":
      return "walking";
    case "RETURNING":
      return "returning";
    case "PACK_READY":
      return "packing";
    default: {
      if (ctx.hasNewMail) return "mail";
      const h = ctx.hour;
      if (typeof h === "number" && (h >= 22 || h < 6)) return "sleeping";
      return "reading";
    }
  }
}

export function Critter({
  species,
  size = 96,
  pose = "idle",
  blink = true,
}: {
  species: Species;
  size?: number;
  pose?: Pose;
  blink?: boolean;
}) {
  return (
    <div style={{ width: size, height: size }} className="flex items-center justify-center">
      <AssetImage
        src={poseSrc(species, pose)}
        alt={species}
        className="h-full w-full object-contain"
        fallback={<FrogSprite species={species} size={size} blink={blink} />}
      />
    </div>
  );
}

// backwards-compatible alias
export const CritterBox = Critter;

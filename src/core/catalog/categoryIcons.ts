import {
  Smartphone,
  Laptop,
  Headphones,
  Gamepad2,
  Watch,
  Home as HomeIcon,
  Camera,
  Aperture,
  Video,
  Lightbulb,
  Mic,
  Tag,
  Briefcase,
  MemoryStick,
  Sliders,
  Film,
  FlaskConical,
  Zap,
  type LucideIcon,
} from 'lucide-react';

// Maps the string icon name stored in a client's navigationCategories config
// to the actual Lucide component. Keeping this as a lookup (instead of
// storing components directly in config) keeps ClientConfig JSON-serializable
// and easy to validate with Zod.
const ICON_BY_NAME: Record<string, LucideIcon> = {
  Smartphone,
  Laptop,
  Headphones,
  Gamepad2,
  Watch,
  Home: HomeIcon,
  Camera,
  Aperture,
  Video,
  Lightbulb,
  Mic,
  Tag,
  Briefcase,
  MemoryStick,
  Sliders,
  Film,
  FlaskConical,
};

export function getCategoryIcon(iconName: string): LucideIcon {
  return ICON_BY_NAME[iconName] ?? Zap;
}

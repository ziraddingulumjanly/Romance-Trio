import {
  Activity, Accessibility, AlertTriangle, AlignLeft, ArrowDownRight, Atom, Ban, BookOpen, BookOpenCheck,
  BriefcaseBusiness, Brush, Building2, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp,
  Clapperboard, Clock3, CloudSun, Coffee, GraduationCap, Hash, Heart, HeartPulse, House, Landmark,
  Laptop, LibraryBig, Lightbulb, Link2, ListFilter, MessageCircle, MessageCircleMore, MessagesSquare,
  Music2, Palette, PawPrint, Plane, Scale, ShoppingBag, Trees, Trophy, Users, Utensils, ChartNoAxesCombined,
  GitCompareArrows, type LucideIcon
} from 'lucide-react';
export const ICONS: Record<string,LucideIcon>={Activity,Accessibility,AlertTriangle,AlignLeft,ArrowDownRight,Atom,Ban,BookOpen,BookOpenCheck,BriefcaseBusiness,Brush,Building2,Check,ChevronDown,ChevronLeft,ChevronRight,CircleHelp,Clapperboard,Clock3,CloudSun,Coffee,GraduationCap,Hash,Heart,HeartPulse,House,Landmark,Laptop,LibraryBig,Lightbulb,Link2,ListFilter,MessageCircle,MessageCircleMore,MessagesSquare,Music2,Palette,PawPrint,Plane,Scale,ShoppingBag,Trees,Trophy,Users,Utensils,ChartNoAxesCombined,GitCompareArrows};
export function TopicIcon({name,size=21}:{name:string,size?:number}) { const I=ICONS[name]??BookOpen; return <I size={size} strokeWidth={2} aria-hidden="true"/>; }

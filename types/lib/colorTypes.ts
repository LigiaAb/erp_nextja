import colors from "tailwindcss/colors";

type CustomColors = "primary" | "secondary" | "muted" | "accent" | "destructive";

type TailwindColor = Exclude<keyof typeof colors, "inherit" | "current" | "transparent">;

type ColorName = TailwindColor | CustomColors;

type Shade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

type HexFormat = `[#${string}]`;

type Text = `text-${HexFormat}` | `text-${ColorName}` | `text-${ColorName}-${Shade}` | `text-${ColorName}-foreground`;
type Bg = `bg-${HexFormat}` | `bg-${ColorName}` | `bg-${ColorName}-${Shade}` | `bg-${ColorName}-foreground`;
type Border = `border-${HexFormat}` | `border-${ColorName}` | `border-${ColorName}-${Shade}` | `border-${ColorName}-foreground`;

export type TextColor = `!${Text}` | Text;

export type BackgroundColor = `!${Bg}` | Bg;

export type BorderColor = `!${Border}` | Border;

type ColorClass = TextColor | BackgroundColor | BorderColor;

export type HoverColor<T extends string> = `hover:${T}`;
export type DarkColor<T extends string> = `dark:${T}`;
export type DarkHoverColor<T extends string> = `dark:hover:${T}`;
export type HoverDarkColor<T extends string> = `hover:dark:${T}`;

export type TailwindColorClass = ColorClass | HoverColor<ColorClass> | DarkColor<ColorClass> | DarkHoverColor<ColorClass> | HoverDarkColor<ColorClass>;

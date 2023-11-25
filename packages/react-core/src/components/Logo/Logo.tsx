import { cn } from '@douglasneuroinformatics/ui';

export type LogoProps = React.SVGProps<SVGSVGElement> & {
  /** The color of the logo. If set to auto, will be dark by default and light in dark mode */
  variant: 'auto' | 'dark' | 'light';
};

export const Logo = ({ className, variant = 'auto', ...props }: LogoProps) => (
  <svg
    className={cn(
      {
        'fill-sky-900': variant === 'dark',
        'fill-sky-900 dark:fill-slate-300': variant === 'auto',
        'fill-slate-300': variant === 'light'
      },
      className
    )}
    viewBox="0 0 320 259"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1399 2576c-165-24-516-124-657-187-188-84-421-286-539-467-210-320-252-646-118-913 88-174 249-284 511-349 37-9 45-16 70-68 38-75 161-199 234-234 69-33 170-52 235-43 193 24 422 85 710 189 55 20 114 36 130 36 29 0 63-8 360-79 72-17 180-38 240-47l110-16 70 27c225 84 361 265 385 510 5 44 18 106 30 139 46 127 33 260-40 410-22 46-40 93-40 106 0 87-67 234-146 320-28 30-64 80-80 110-45 86-173 208-268 255-43 22-95 55-115 74-52 48-126 94-201 124-90 35-135 46-258 63-59 7-138 21-177 29-102 22-330 27-446 11zm259-241c113-27 230-102 294-190 32-43 35-44 74-39 23 3 68 0 100-6 159-33 280-153 313-310l12-55 77-37c137-65 230-169 280-312 51-144 28-322-56-451-48-73-189-210-236-230-29-12-147-15-738-15-789-1-735-5-864 75-248 155-331 433-207 693 38 79 159 198 240 236l61 29-1 81c-2 152 51 283 158 390 131 130 314 183 493 141z"
      transform="matrix(.1 0 0 -.1 0 259)"
    />
    <path
      d="M1133 1826l-28-24-3-502c-2-367 1-506 9-516 16-20 1281-21 1296-1 12 14 173 657 173 688 0 11-13 34-29 50-25 24-38 29-79 29h-50l-4 65c-3 51-9 70-26 88-23 22-23 22-456 25l-433 3-18 40c-33 72-50 79-196 79-121 0-129-1-156-24zm312-94l30-57 880-10 6-114-1043-6-21-25c-15-18-39-93-77-245l-55-220-3 355c-1 195 0 361 3 367 3 10 38 13 127 13h123l30-58zm1078-256c4-10-80-366-144-608l-10-38h-599c-398 0-600 3-600 10 0 24 154 626 163 638 15 19 1183 18 1190-2z"
      transform="matrix(.1 0 0 -.1 0 259)"
    />
    <path
      d="M2004 935c-10-25 4-47 28-43 17 2 24 11 26 31 3 23 0 27-23 27-14 0-28-7-31-15zM2124 935c-10-25 4-47 28-43 17 2 24 11 26 31 3 23 0 27-23 27-14 0-28-7-31-15zM2244 935c-10-25 4-47 28-43 17 2 24 11 26 31 3 23 0 27-23 27-14 0-28-7-31-15zM1940 401c-70-22-136-57-227-119l-73-49 28-35c79-104 244-177 438-193 159-13 324 46 438 159 52 51 126 154 126 177 0 3-51 9-112 13-62 4-191 20-286 37-198 33-255 35-332 10z"
      transform="matrix(.1 0 0 -.1 0 259)"
    />
  </svg>
);
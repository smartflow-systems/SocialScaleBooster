{
  "include": ["client/src/**/*", "shared/**/*"],
  "exclude": ["node_modules", "build", "dist", "**/*.test.ts"],

  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./.tsbuildinfo",

    "noEmit": true,

    "module": "ESNext",
    "moduleResolution": "bundler",

    "strict": true,

    "lib": ["ESNext", "DOM", "DOM.Iterable"],

    "jsx": "react-jsx",

    "esModuleInterop": true,
    "skipLibCheck": true,

    "baseUrl": ".",

    "types": ["node", "vite/client"],

    "paths": {
      "@/*": ["./client/src/*"],
      "@shared/*": ["./shared/*"]
    }
  }
}
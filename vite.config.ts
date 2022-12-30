import { rmSync } from 'fs'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron, { onstart } from 'vite-plugin-electron'
import pkg from './package.json'
import { resolve } from 'path'

rmSync('dist', { recursive: true, force: true }) // v14.14.0
console.log('process.env', process.env);

export default ({ mode }: any) => {
  const env = loadEnv(mode, process.cwd())
  console.log("loadEnv", env);

  const getServer = () => {
    if (process.env.VSCODE_DEBUG) {
      return {
        host: pkg.debug.env.VITE_DEV_SERVER_HOSTNAME,
        port: pkg.debug.env.VITE_DEV_SERVER_PORT,
        proxy: {
          '/bydApis': {
            target: 'https://bydcloud.byd.com',
            changeOrigin: true,
            rewrite: (path) => {
              path = path.replace(/^\/bydApis/, '')
              return path
            },
          }
        }
      }
    } else {
      return {
        proxy: {
          '/bydApis': {
            target: 'https://bydcloud.byd.com',
            changeOrigin: true,
            rewrite: (path) => {
              path = path.replace(/^\/bydApis/, '')
              return path
            },
          }
        }
      }
    }
  }
  // https://vitejs.dev/config/
  return defineConfig({
    plugins: [
      vue(),
      electron({
        main: {
          entry: 'electron/main/index.ts',
          vite: {
            build: {
              // For Debug
              sourcemap: true,
              outDir: 'dist/electron/main',
            },
            // Will start Electron via VSCode Debug
            plugins: [process.env.VSCODE_DEBUG ? onstart() : null],
          },
        },
        preload: {
          input: {
            // You can configure multiple preload here
            index: path.join(__dirname, 'electron/preload/index.ts'),
          },
          vite: {
            build: {
              // For Debug
              sourcemap: 'inline',
              outDir: 'dist/electron/preload',
            },
          },
        },
        // Enables use of Node.js API in the Renderer-process
        // https://github.com/electron-vite/vite-plugin-electron/tree/main/packages/electron-renderer#electron-renderervite-serve
        renderer: {},
      }),
    ],
    server: getServer(),
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src') // 设置 @ 指向 src
      }
    }
  })
}


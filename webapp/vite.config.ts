import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../website',  // 构建输出到现有的website目录
    emptyOutDir: true,       // 清空输出目录
  },
  publicDir: 'public',   // 指定公共文件目录
  root: '.',             // 指定项目根目录
});
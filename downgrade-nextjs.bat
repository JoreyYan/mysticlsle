@echo off
echo ================================
echo ChillFit Rave - Next.js 降级脚本
echo ================================
echo.
echo 当前操作只影响这个项目，不会影响你的其他项目
echo.
pause

cd frontend

echo 1. 备份当前的 package.json...
copy package.json package.json.backup

echo 2. 卸载 Next.js 15...
npm uninstall next

echo 3. 安装 Next.js 14...
npm install next@14.2.5

echo 4. 清理缓存...
rmdir /s /q .next 2>nul
rmdir /s /q node_modules\.cache 2>nul

echo 5. 重新安装依赖...
npm install

echo.
echo ================================
echo 降级完成！
echo ================================
echo.
echo 现在可以运行: npm run dev
echo 如果有问题，可以还原: copy package.json.backup package.json
echo.
pause
<h2 align="center">
coderstation-frontSystem(前台系统)
</h2>

## 📰 介绍

一个现代化的技术学习社区前端系统，为程序员提供技术问答、书籍推荐、面试准备等一站式学习平台。

## 🌟 技术亮点

🔧 现代化技术栈: React + Redux Toolkit + React Router

🔩 企业级UI组件: Ant Design

🔑 路由权限控制: 基于路由守卫的页面访问权限管理

⌨ 富文本编辑: 集成 Toast UI Editor 支持 Markdown 编辑

## 🏗️ 项目结构

```bash
├── config/               # 构建配置
├── data/                 # 原始数据
├── public/               # 静态资源
├── scripts/              # 构建脚本
├── src/
│   ├── api/              # API接口层
│   ├── components/       # 通用组件
│   ├── css/              # 局部样式
│   ├── fonts/            # 字体图标
│   ├── pages/            # 页面组件
│   ├── redux/            # 状态管理
│   ├── router/           # 路由配置
│   ├── utils/            # 工具函数
│   ├── App.jsx           # 根组件
│   ├── index.css         # 全局样式
│   ├── index.js          # 应用入口
│   └── setupProxy.js     # 开发环境代理配置
└── package.json          # 项目依赖
```

## 🚀 快速开始

```bash
git clone https://github.com/Yang0107-liyyy/coderstation-frontSystem.git
cd coderstation-frontSystem
npm install
npm start
```

### 构建

```bash
npm run build
```
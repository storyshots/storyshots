"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[3155],{5087:(e,r,s)=>{s.r(r),s.d(r,{assets:()=>a,contentTitle:()=>c,default:()=>p,frontMatter:()=>i,metadata:()=>o,toc:()=>d});const o=JSON.parse('{"id":"modules/proxy","title":"@storyshots/proxy","description":"\u0421\u0435\u0440\u0432\u0435\u0440 preview \u043f\u0440\u043e\u043a\u0441\u0438\u0440\u0443\u044e\u0449\u0438\u0439 \u043e\u0431\u0440\u0430\u0449\u0435\u043d\u0438\u044f \u043d\u0430 \u043f\u0435\u0440\u0435\u0434\u0430\u043d\u043d\u044b\u0439 \u0430\u0434\u0440\u0435\u0441.","source":"@site/docs/modules/proxy.md","sourceDirName":"modules","slug":"/modules/proxy","permalink":"/modules/proxy","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":7,"frontMatter":{"sidebar_position":7},"sidebar":"defaultSidebar","previous":{"title":"@storyshots/msw-externals","permalink":"/modules/msw"}}');var t=s(4848),n=s(8453);const i={sidebar_position:7},c="@storyshots/proxy",a={},d=[{value:"createProxyServer",id:"createproxyserver",level:2}];function l(e){const r={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",...(0,n.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(r.header,{children:(0,t.jsx)(r.h1,{id:"storyshotsproxy",children:"@storyshots/proxy"})}),"\n",(0,t.jsxs)(r.p,{children:[(0,t.jsx)(r.a,{href:"/modules/scheme#ipreviewserver",children:"\u0421\u0435\u0440\u0432\u0435\u0440"})," ",(0,t.jsx)(r.code,{children:"preview"})," \u043f\u0440\u043e\u043a\u0441\u0438\u0440\u0443\u044e\u0449\u0438\u0439 \u043e\u0431\u0440\u0430\u0449\u0435\u043d\u0438\u044f \u043d\u0430 \u043f\u0435\u0440\u0435\u0434\u0430\u043d\u043d\u044b\u0439 \u0430\u0434\u0440\u0435\u0441."]}),"\n",(0,t.jsx)(r.h2,{id:"createproxyserver",children:"createProxyServer"}),"\n",(0,t.jsxs)(r.p,{children:["\u0421\u043e\u0437\u0434\u0430\u0435\u0442 ",(0,t.jsx)(r.code,{children:"proxy"})," \u0434\u043e \u0437\u0430\u0434\u0430\u043d\u043d\u043e\u0433\u043e \u0441\u0435\u0440\u0432\u0435\u0440\u0430:"]}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{className:"language-ts",children:"import { ManagerConfig } from '@storyshots/core/manager';\nimport { createProxyServer } from '@storyshots/proxy';\n\nexport default {\n    preview: createProxyServer('http://localhost:3000'),\n    /* ... */\n} satisfies ManagerConfig;\n"})}),"\n",(0,t.jsxs)(r.admonition,{title:"\u0412\u0430\u0436\u043d\u043e",type:"warning",children:[(0,t.jsxs)(r.p,{children:[(0,t.jsx)(r.code,{children:"@storyshots/proxy"})," \u0441\u043b\u0435\u0434\u0443\u0435\u0442 \u0440\u0430\u0441\u0441\u043c\u0430\u0442\u0440\u0438\u0432\u0430\u0442\u044c \u043a\u0430\u043a \u0432\u0440\u0435\u043c\u0435\u043d\u043d\u043e\u0435 \u0440\u0435\u0448\u0435\u043d\u0438\u0435 \u043f\u0440\u0438 \u0438\u043d\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u0438 ",(0,t.jsx)(r.code,{children:"storyshots"})," \u0432 \u043f\u0440\u043e\u0435\u043a\u0442."]}),(0,t.jsx)(r.p,{children:"\u041c\u043e\u0434\u0443\u043b\u044c \u0445\u043e\u0442\u044c \u0438 \u043f\u043e\u0437\u0432\u043e\u043b\u044f\u0435\u0442 \u043e\u0431\u043b\u0435\u0433\u0447\u0438\u0442\u044c \u0438\u043d\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u044e, \u043e\u0434\u043d\u0430\u043a\u043e \u043d\u0435 \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442 \u043d\u0435\u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u0438\u0437 \u0444\u0443\u043d\u043a\u0446\u0438\u0439, \u0442\u0430\u043a\u0438\u0435 \u043a\u0430\u043a \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0430\u044f\n\u043f\u0435\u0440\u0435\u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0430 \u0438\u0441\u0442\u043e\u0440\u0438\u0439, \u0430 \u0442\u0430\u043a\u0436\u0435 \u043d\u0435 \u043f\u043e\u0437\u0432\u043e\u043b\u044f\u0435\u0442 \u0438\u043d\u0442\u0435\u0433\u0440\u0438\u0440\u043e\u0432\u0430\u0442\u044c UI \u0440\u0435\u0436\u0438\u043c \u0432 \u043f\u043e\u043b\u043d\u043e\u0439 \u043c\u0435\u0440\u0435."})]})]})}function p(e={}){const{wrapper:r}={...(0,n.R)(),...e.components};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(l,{...e})}):l(e)}},8453:(e,r,s)=>{s.d(r,{R:()=>i,x:()=>c});var o=s(6540);const t={},n=o.createContext(t);function i(e){const r=o.useContext(n);return o.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function c(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:i(e.components),o.createElement(n.Provider,{value:r},e.children)}}}]);
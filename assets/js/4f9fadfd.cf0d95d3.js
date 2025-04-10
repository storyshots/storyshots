"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[7937],{4967:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>h,frontMatter:()=>c,metadata:()=>t,toc:()=>a});const t=JSON.parse('{"id":"modules/web-api","title":"@storyshots/web-api-externals","description":"\u041f\u043e\u0434\u043c\u0435\u043d\u044f\u0435\u0442 WebAPI \u043d\u0430 \u0438\u0445 \u0442\u0435\u0441\u0442\u0438\u0440\u0443\u0435\u043c\u044b\u0435 \u0430\u043d\u0430\u043b\u043e\u0433\u0438","source":"@site/docs/modules/web-api.md","sourceDirName":"modules","slug":"/modules/web-api","permalink":"/storyshots/modules/web-api","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":4,"frontMatter":{"sidebar_position":4},"sidebar":"defaultSidebar","previous":{"title":"@storyshots/webpack","permalink":"/storyshots/modules/webpack"},"next":{"title":"@storyshots/arrangers","permalink":"/storyshots/modules/arrangers"}}');var i=s(4848),r=s(8453);const c={sidebar_position:4},o="@storyshots/web-api-externals",l={},a=[{value:"install",id:"install",level:2},{value:"clock",id:"clock",level:2},{value:"tick",id:"tick",level:2},{value:"\u0412\u0430\u0436\u043d\u043e",id:"\u0432\u0430\u0436\u043d\u043e",level:2}];function d(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,r.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"storyshotsweb-api-externals",children:"@storyshots/web-api-externals"})}),"\n",(0,i.jsxs)(n.p,{children:["\u041f\u043e\u0434\u043c\u0435\u043d\u044f\u0435\u0442 ",(0,i.jsx)(n.code,{children:"WebAPI"})," \u043d\u0430 \u0438\u0445 ",(0,i.jsx)(n.a,{href:"/specification/requirements/env",children:"\u0442\u0435\u0441\u0442\u0438\u0440\u0443\u0435\u043c\u044b\u0435 \u0430\u043d\u0430\u043b\u043e\u0433\u0438"}),"\n\u0447\u0435\u0440\u0435\u0437 ",(0,i.jsx)(n.a,{href:"/patterns/replace#%D0%BF%D0%BE%D0%B4%D0%BC%D0%B5%D0%BD%D0%B0-%D1%87%D0%B5%D1%80%D0%B5%D0%B7-%D1%81%D0%B0%D0%B9%D0%B4-%D1%8D%D1%84%D1%84%D0%B5%D0%BA%D1%82%D1%8B",children:"\u0438\u043d\u0432\u0430\u0437\u0438\u0432\u043d\u044b\u0439 \u043c\u0435\u0442\u043e\u0434"}),"."]}),"\n",(0,i.jsx)(n.h2,{id:"install",children:"install"}),"\n",(0,i.jsx)(n.p,{children:"\u0424\u0443\u043d\u043a\u0446\u0438\u044f \u0432\u044b\u043f\u043e\u043b\u043d\u044f\u044e\u0449\u0430\u044f \u043f\u043e\u0434\u043c\u0435\u043d\u0443 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u043d\u043e\u0433\u043e API."}),"\n",(0,i.jsx)(n.admonition,{type:"warning",children:(0,i.jsx)(n.p,{children:"\u0414\u043b\u044f \u043a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u043e\u0439 \u0440\u0430\u0431\u043e\u0442\u044b \u0434\u043e\u043b\u0436\u043d\u0430 \u0432\u044b\u0437\u044b\u0432\u0430\u0442\u044c\u0441\u044f \u0434\u043e \u0432\u044b\u043f\u043e\u043b\u043d\u0435\u043d\u0438\u044f \u043b\u044e\u0431\u043e\u0433\u043e \u0434\u0440\u0443\u0433\u043e\u0433\u043e \u043a\u043e\u0434\u0430 \u043d\u0430 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0435."})}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"import { install } from '@storyshots/web-api-externals';\n\n// \u0417\u0430\u043c\u043e\u0440\u0430\u0436\u0438\u0432\u0430\u0435\u0442 \u0432\u0440\u0435\u043c\u044f \u043d\u0430 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0435 \u043d\u0430 \u043e\u0442\u043c\u0435\u0442\u043a\u0435 13.01.2024 12:00\nexport const clock = install({ date: new Date(2024, 0, 13, 12) });\n"})}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"@storyshots/web-api-externals"})," \u0442\u0430\u043a\u0436\u0435 \u043f\u043e\u0434\u043c\u0435\u043d\u044f\u0435\u0442 \u043b\u043e\u043a\u0430\u043b\u044c\u043d\u044b\u0435 \u0445\u0440\u0430\u043d\u0438\u043b\u0438\u0449\u0430 \u043d\u0430 \u0442\u0435, \u0447\u0442\u043e \u0445\u0440\u0430\u043d\u044f\u0442 \u0441\u0432\u043e\u0438 \u0434\u0430\u043d\u043d\u044b\u0435 \u0432\u043e \u0432\u0440\u0435\u043c\u0435\u043d\u043d\u043e\u0439 \u043f\u0430\u043c\u044f\u0442\u0438."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"// \u0414\u0430\u043d\u043d\u0430\u044f \u0437\u0430\u043f\u0438\u0441\u044c \u0431\u0443\u0434\u0435\u0442 \u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0438 \u0441\u0442\u0451\u0440\u0442\u0430 \u043f\u0440\u0438 \u0437\u0430\u043f\u0443\u0441\u043a\u0435 \u043d\u043e\u0432\u043e\u0439 \u0438\u0441\u0442\u043e\u0440\u0438\u0438\nlocalStorage.setItem('token', '...');\n"})}),"\n",(0,i.jsx)(n.admonition,{type:"note",children:(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"IndexedDB"})," \u043d\u0435 \u0437\u0430\u043c\u0435\u043d\u044f\u0435\u0442\u0441\u044f \u0434\u0430\u043d\u043d\u044b\u043c \u043c\u043e\u0434\u0443\u043b\u0435\u043c."]})}),"\n",(0,i.jsx)(n.h2,{id:"clock",children:"clock"}),"\n",(0,i.jsxs)(n.p,{children:["\u0424\u0443\u043d\u043a\u0446\u0438\u044f ",(0,i.jsx)(n.code,{children:"install"})," \u0432\u043e\u0437\u0432\u0440\u0430\u0449\u0430\u0435\u0442 \u0441\u043f\u0435\u0446\u0438\u0430\u043b\u044c\u043d\u044b\u0439 \u043e\u0431\u044a\u0435\u043a\u0442 ",(0,i.jsx)(n.code,{children:"clock"}),", \u0447\u0435\u0440\u0435\u0437 \u043a\u043e\u0442\u043e\u0440\u044b\u0439 \u0438\u0437\u043c\u0435\u043d\u044f\u0442\u044c \u0434\u0430\u0442\u0443 \u043f\u043e \u0443\u043c\u043e\u043b\u0447\u0430\u043d\u0438\u044e \u0432 \u043e\u0442\u0434\u0435\u043b\u044c\u043d\u043e \u0432\u0437\u044f\u0442\u044b\u0445\n\u0438\u0441\u0442\u043e\u0440\u0438\u044f\u0445:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"it('...', {\n    arrange: (externals) => {\n        clock.set(new Date(/*...*/));\n        \n        return externals;\n    },\n});\n"})}),"\n",(0,i.jsx)(n.h2,{id:"tick",children:"tick"}),"\n",(0,i.jsxs)(n.p,{children:["\u041c\u043e\u0434\u0443\u043b\u044c \u0442\u0430\u043a\u0436\u0435 \u043a\u043e\u0440\u0440\u0435\u043a\u0442\u0438\u0440\u0443\u0435\u0442 \u043f\u043e\u0432\u0435\u0434\u0435\u043d\u0438\u0435 ",(0,i.jsx)(n.code,{children:"setTimeout"})," \u0442\u0430\u043a\u0438\u043c \u043e\u0431\u0440\u0430\u0437\u043e\u043c, \u0447\u0442\u043e \u0437\u0430\u0434\u0435\u0440\u0436\u043a\u043e\u0439 \u043c\u043e\u0436\u043d\u043e \u0443\u043f\u0440\u0430\u0432\u043b\u044f\u0442\u044c \u0438\u0437\u0432\u043d\u0435:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"// \u0423\u0432\u0435\u0434\u043e\u043c\u043b\u0435\u043d\u0438\u0435 \u0437\u0430\u043a\u0440\u044b\u0432\u0430\u0435\u0442\u0441\u044f \u0447\u0435\u0440\u0435\u0437 5 \u0441\u0435\u043a\u0443\u043d\u0434\nsetTimeout(() => closeNotification(), 5_000);\n"})}),"\n",(0,i.jsxs)(n.p,{children:["\u0414\u043b\u044f \u0442\u043e\u0433\u043e \u0447\u0442\u043e\u0431\u044b \u043d\u0435 \u0436\u0434\u0430\u0442\u044c \u0432 \u0438\u0441\u0442\u043e\u0440\u0438\u0438 \u0442\u0430\u043a \u0434\u043e\u043b\u0433\u043e, \u043c\u043e\u0436\u043d\u043e \u0432\u043e\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c\u0441\u044f \u0441\u043f\u0435\u0446\u0438\u0430\u043b\u044c\u043d\u044b\u043c \u043c\u0435\u0442\u043e\u0434\u043e\u043c ",(0,i.jsx)(n.code,{children:"tick"}),":"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"it('closes notification', {\n    act: (actor) => actor\n        .screenshot('NotificationShown')\n        // \u041f\u0435\u0440\u0435\u043c\u043e\u0442\u0430\u0442\u044c \u043d\u0430 5 \u0441\u0435\u043a\u0443\u043d\u0434 \u0432\u043f\u0435\u0440\u0451\u0434\n        .exec(() => window.tick(5_000))\n        .screenshot('NotificationHidden')\n});\n"})}),"\n",(0,i.jsx)(n.h2,{id:"\u0432\u0430\u0436\u043d\u043e",children:"\u0412\u0430\u0436\u043d\u043e"}),"\n",(0,i.jsx)(n.p,{children:"\u041c\u043e\u0434\u0443\u043b\u044c \u043f\u043e\u0437\u0432\u043e\u043b\u044f\u0435\u0442 \u043e\u0431\u043b\u0435\u0433\u0447\u0438\u0442\u044c \u0442\u0435\u0441\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u044b, \u043e\u0434\u043d\u0430\u043a\u043e \u0441\u0442\u043e\u0438\u0442 \u0443\u0447\u0438\u0442\u044b\u0432\u0430\u0442\u044c \u0438 \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0435 \u043e\u0441\u043e\u0431\u0435\u043d\u043d\u043e\u0441\u0442\u0438:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"setTimeout"})," \u0431\u0443\u0434\u0435\u0442 \u0440\u0430\u0431\u043e\u0442\u0430\u0442\u044c \u0432 \u043e\u0431\u044b\u0447\u043d\u043e\u043c \u0440\u0435\u0436\u0438\u043c\u0435 \u043f\u043e \u0443\u043c\u043e\u043b\u0447\u0430\u043d\u0438\u044e."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"tick"})," \u043f\u043e\u0437\u0432\u043e\u043b\u044f\u0435\u0442 \u043f\u0435\u0440\u0435\u043c\u043e\u0442\u0430\u0442\u044c \u0432\u0440\u0435\u043c\u044f \u0432\u043f\u0435\u0440\u0451\u0434, \u0432\u044b\u0437\u044b\u0432\u0430\u044f ",(0,i.jsx)(n.code,{children:"setTimeout"})," \u0440\u0430\u043d\u044c\u0448\u0435."]}),"\n",(0,i.jsxs)(n.li,{children:["\u041f\u043e\u0432\u0435\u0434\u0435\u043d\u0438\u0435 \u043e\u0441\u0442\u0430\u043b\u044c\u043d\u044b\u0445 \u0442\u0430\u0439\u043c\u0435\u0440\u043e\u0432 \u043e\u0441\u0442\u0430\u0451\u0442\u0441\u044f \u043d\u0435\u0442\u0440\u043e\u043d\u0443\u0442\u044b\u043c (",(0,i.jsx)(n.code,{children:"setInterval"}),", ",(0,i.jsx)(n.code,{children:"requestAnimationFrame"})," \u0438 \u0434\u0440\u0443\u0433\u0438\u0435)."]}),"\n",(0,i.jsx)(n.li,{children:"\u0418\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0435 \u0434\u0430\u0442\u044b \u043d\u0438\u043a\u0430\u043a \u043d\u0435 \u0432\u043b\u0438\u044f\u0435\u0442 \u043d\u0430 \u0441\u0440\u0430\u0431\u0430\u0442\u044b\u0432\u0430\u043d\u0438\u0435 \u0442\u0430\u0439\u043c\u0435\u0440\u043e\u0432."}),"\n"]}),"\n",(0,i.jsx)(n.admonition,{type:"note",children:(0,i.jsxs)(n.p,{children:["\u041f\u043e\u0432\u0435\u0434\u0435\u043d\u0438\u0435 \u043f\u043e \u0443\u043c\u043e\u043b\u0447\u0430\u043d\u0438\u044e \u043c\u043e\u0436\u043d\u043e \u0440\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0447\u0435\u0440\u0435\u0437 ",(0,i.jsx)(n.a,{href:"https://github.com/sinonjs/fake-timers?tab=readme-ov-file#var-clock--faketimersinstallconfig",children:"\u043a\u043e\u043d\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u044e"})," ",(0,i.jsx)(n.code,{children:"install"}),"."]})})]})}function h(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},8453:(e,n,s)=>{s.d(n,{R:()=>c,x:()=>o});var t=s(6540);const i={},r=t.createContext(i);function c(e){const n=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:c(e.components),t.createElement(r.Provider,{value:n},e.children)}}}]);
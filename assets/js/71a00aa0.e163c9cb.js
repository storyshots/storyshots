"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[2770],{59:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>o,contentTitle:()=>a,default:()=>p,frontMatter:()=>l,metadata:()=>s,toc:()=>h});const s=JSON.parse('{"id":"specification/requirements/storage","title":"\u0425\u0440\u0430\u043d\u0438\u043b\u0438\u0449\u0435","description":"\u0425\u0440\u0430\u043d\u0438\u043b\u0438\u0449\u0435 \u0432\u043a\u043b\u044e\u0447\u0430\u0435\u0442 \u0444\u0443\u043d\u043a\u0446\u0438\u0438, \u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u0432\u044b\u043f\u043e\u043b\u043d\u044f\u044e\u0442 \u0441\u0430\u0439\u0434-\u044d\u0444\u0444\u0435\u043a\u0442\u044b. \u042d\u0442\u0438 \u044d\u0444\u0444\u0435\u043a\u0442\u044b \u0434\u0435\u043b\u0430\u044e\u0442 \u0434\u0440\u0443\u0433\u0438\u0435 \u0444\u0443\u043d\u043a\u0446\u0438\u0438 \u0432 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0438","source":"@site/docs/specification/requirements/storage.mdx","sourceDirName":"specification/requirements","slug":"/specification/requirements/storage","permalink":"/specification/requirements/storage","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":4,"frontMatter":{"sidebar_position":4},"sidebar":"defaultSidebar","previous":{"title":"\u0412\u043d\u0435\u0448\u043d\u044f\u044f \u0441\u0440\u0435\u0434\u0430","permalink":"/specification/requirements/env"},"next":{"title":"\u041c\u043e\u043d\u0438\u0442\u043e\u0440","permalink":"/specification/requirements/monitor"}}');var r=i(4848),t=i(8453),c=i(8422),d=i(1465);const l={sidebar_position:4},a="\u0425\u0440\u0430\u043d\u0438\u043b\u0438\u0449\u0435",o={},h=[{value:"\u0421\u0430\u0439\u0434-\u044d\u0444\u0444\u0435\u043a\u0442",id:"\u0441\u0430\u0439\u0434-\u044d\u0444\u0444\u0435\u043a\u0442",level:2},{value:"\u0414\u0440\u0443\u0433\u0438\u0435 \u043f\u0440\u0438\u043c\u0435\u0440\u044b",id:"\u0434\u0440\u0443\u0433\u0438\u0435-\u043f\u0440\u0438\u043c\u0435\u0440\u044b",level:2},{value:"\u0421\u043f\u043e\u0441\u043e\u0431 \u0432\u0435\u0440\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u0438",id:"\u0441\u043f\u043e\u0441\u043e\u0431-\u0432\u0435\u0440\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u0438",level:2},{value:"\u0421\u0432\u044f\u0437\u044c \u0441 \u0431\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u043e\u0439",id:"\u0441\u0432\u044f\u0437\u044c-\u0441-\u0431\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u043e\u0439",level:2}];function x(e){const n={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,t.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"\u0445\u0440\u0430\u043d\u0438\u043b\u0438\u0449\u0435",children:"\u0425\u0440\u0430\u043d\u0438\u043b\u0438\u0449\u0435"})}),"\n",(0,r.jsx)(c.Fn,{improves:[c.JW.RegressionProtection,c.JW.Maintainability,c.JW.Speed]}),"\n",(0,r.jsxs)(n.p,{children:["\u0425\u0440\u0430\u043d\u0438\u043b\u0438\u0449\u0435 \u0432\u043a\u043b\u044e\u0447\u0430\u0435\u0442 \u0444\u0443\u043d\u043a\u0446\u0438\u0438, \u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u0432\u044b\u043f\u043e\u043b\u043d\u044f\u044e\u0442 ",(0,r.jsx)(n.em,{children:"\u0441\u0430\u0439\u0434-\u044d\u0444\u0444\u0435\u043a\u0442\u044b"}),". \u042d\u0442\u0438 \u044d\u0444\u0444\u0435\u043a\u0442\u044b \u0434\u0435\u043b\u0430\u044e\u0442 \u0434\u0440\u0443\u0433\u0438\u0435 \u0444\u0443\u043d\u043a\u0446\u0438\u0438 \u0432 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0438\n",(0,r.jsx)(n.em,{children:"\u043d\u0435\u0438\u0434\u0435\u043c\u043f\u043e\u0442\u0435\u043d\u0442\u043d\u044b\u043c\u0438"}),". \u041e\u0442\u043d\u043e\u0441\u0438\u0442\u0441\u044f \u043a \u0441\u0435\u043a\u0446\u0438\u0438 ",(0,r.jsx)(n.a,{href:"/specification/requirements/borders#%D0%BE%D0%BF%D1%80%D0%B5%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D0%B3%D1%80%D0%B0%D0%BD%D0%B8%D1%86",children:(0,r.jsx)(n.em,{children:"\u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u0430"})}),"."]}),"\n",(0,r.jsx)(n.p,{children:"\u0420\u0430\u0441\u0441\u043c\u043e\u0442\u0440\u0438\u043c \u043f\u0440\u043e\u0441\u0442\u043e\u0439 \u043f\u0440\u0438\u043c\u0435\u0440:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"/**\n * \u0424\u0443\u043d\u043a\u0446\u0438\u044f getUsers \u0432\u043e\u0437\u0432\u0440\u0430\u0449\u0430\u0435\u0442 \u0441\u043f\u0438\u0441\u043e\u043a \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u0435\u0439 \u0438\u0437 \u0411\u0414.\n * \u041f\u0440\u0438 \u043f\u0435\u0440\u0432\u043e\u043c \u0437\u0430\u043f\u0443\u0441\u043a\u0435 \u0441\u043f\u0438\u0441\u043e\u043a \u043f\u0443\u0441\u0442, \u0442\u0430\u043a \u043a\u0430\u043a \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u0438 \u0435\u0449\u0451 \u043d\u0435 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u044b.\n */\nawait getUsers(); // []\n\n/**\n * \u0424\u0443\u043d\u043a\u0446\u0438\u044f addUser \u0434\u043e\u0431\u0430\u0432\u043b\u044f\u0435\u0442 \u043d\u043e\u0432\u043e\u0433\u043e \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044f \u0432 \u0411\u0414.\n */\nawait addUser({ name: 'Vasiliy' });\n\n/**\n * \u041f\u0440\u0438 \u043f\u043e\u0432\u0442\u043e\u0440\u043d\u043e\u043c \u0432\u044b\u0437\u043e\u0432\u0435 getUsers \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442 \u0438\u0437\u043c\u0435\u043d\u0438\u0442\u0441\u044f.\n */\nawait getUsers(); // [{ id: 1, name: 'Vasiliy' }]\n"})}),"\n",(0,r.jsxs)(n.p,{children:["\u0424\u0443\u043d\u043a\u0446\u0438\u044f ",(0,r.jsx)(n.code,{children:"getUsers"})," \u0441\u0442\u0430\u043b\u0430 \u043d\u0435 ",(0,r.jsx)(n.a,{href:"/specification/requirements/env#%D0%B8%D0%B4%D0%B5%D0%BC%D0%BF%D0%BE%D1%82%D0%B5%D0%BD%D1%82%D0%BD%D0%BE%D1%81%D1%82%D1%8C",children:"\u0438\u0434\u0435\u043c\u043f\u043e\u0442\u0435\u043d\u0442\u043d\u043e\u0439"})," \u0438\u0437-\u0437\u0430 \u0444\u0443\u043d\u043a\u0446\u0438\u0438 ",(0,r.jsx)(n.code,{children:"addUser"}),"."]}),"\n",(0,r.jsx)(n.h2,{id:"\u0441\u0430\u0439\u0434-\u044d\u0444\u0444\u0435\u043a\u0442",children:"\u0421\u0430\u0439\u0434-\u044d\u0444\u0444\u0435\u043a\u0442"}),"\n",(0,r.jsx)(n.p,{children:"\u042d\u0444\u0444\u0435\u043a\u0442 \u2014 \u044d\u0442\u043e \u0434\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c\u043d\u043e\u0435 \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u0435, \u0432\u043e\u0437\u0432\u0440\u0430\u0449\u0430\u0435\u043c\u043e\u0435 \u0444\u0443\u043d\u043a\u0446\u0438\u0435\u0439 \u043f\u043e\u043c\u0438\u043c\u043e \u043e\u0441\u043d\u043e\u0432\u043d\u043e\u0433\u043e \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u0430:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"/**\n * \u0424\u0443\u043d\u043a\u0446\u0438\u044f \u0432\u043e\u0437\u0432\u0440\u0430\u0449\u0430\u0435\u0442 \u0443\u0434\u0432\u043e\u0435\u043d\u043d\u043e\u0435 \u0447\u0438\u0441\u043b\u043e \u0438 \u0441\u0442\u0440\u043e\u043a\u0443 \u0434\u043b\u044f \u043b\u043e\u0433\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f.\n */\nfunction doubleAndLog(n: number) {\n    return [n * 2, `Doubled a number ${n}`];\n}\n"})}),"\n",(0,r.jsx)(n.p,{children:"\u0421\u0430\u0439\u0434-\u044d\u0444\u0444\u0435\u043a\u0442 \u2014 \u044d\u0442\u043e \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442, \u043a\u043e\u0442\u043e\u0440\u044b\u0439:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"\u041d\u0435 \u0432\u043e\u0437\u0432\u0440\u0430\u0449\u0430\u0435\u0442\u0441\u044f \u0444\u0443\u043d\u043a\u0446\u0438\u0435\u0439."}),"\n",(0,r.jsx)(n.li,{children:"\u0412\u043b\u0438\u044f\u0435\u0442 \u043d\u0430 \u043f\u043e\u0432\u0435\u0434\u0435\u043d\u0438\u0435 \u0434\u0440\u0443\u0433\u0438\u0445 \u0444\u0443\u043d\u043a\u0446\u0438\u0439."}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"function addUser(): Promise<void> {\n    /**\n     * addUser \u0432\u044b\u043f\u043e\u043b\u043d\u044f\u0435\u0442 \u0441\u0430\u0439\u0434-\u044d\u0444\u0444\u0435\u043a\u0442:\n     * * \u0418\u0437\u043c\u0435\u043d\u044f\u0435\u0442 \u0411\u0414.\n     * * \u041d\u0435 \u0432\u043e\u0437\u0432\u0440\u0430\u0449\u0430\u0435\u0442 \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u0435 (void).\n     */\n    return fetch(/* ... */);\n}\n"})}),"\n",(0,r.jsx)(n.admonition,{title:"\u0412\u043d\u0438\u043c\u0430\u043d\u0438\u0435",type:"warning",children:(0,r.jsxs)(n.p,{children:["\u0415\u0441\u043b\u0438 \u043d\u0435 \u0438\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u0444\u0443\u043d\u043a\u0446\u0438\u044e ",(0,r.jsx)(n.code,{children:"addUser"}),", \u044d\u0442\u043e \u0443\u0432\u0435\u043b\u0438\u0447\u0438\u0442 \u0432\u0440\u0435\u043c\u044f \u0442\u0435\u0441\u0442\u043e\u0432 \u0438 \u0441\u043d\u0438\u0437\u0438\u0442 \u0438\u0445 \u0432\u043e\u0441\u043f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0438\u043c\u043e\u0441\u0442\u044c. \u0422\u0430\u043a\u0438\u043c \u043e\u0431\u0440\u0430\u0437\u043e\u043c, \u043b\u044e\u0431\u044b\u0435\n\u0441\u0430\u0439\u0434-\u044d\u0444\u0444\u0435\u043a\u0442\u044b \u043d\u0430 \u0432\u043d\u0435\u0448\u043d\u0438\u0435 \u0441\u0438\u0441\u0442\u0435\u043c\u044b \u0434\u043e\u043b\u0436\u043d\u044b \u0431\u044b\u0442\u044c \u0438\u0441\u043a\u043b\u044e\u0447\u0435\u043d\u044b."]})}),"\n",(0,r.jsx)(n.admonition,{type:"tip",children:(0,r.jsxs)(n.p,{children:["\u0424\u0443\u043d\u043a\u0446\u0438\u0438, \u043e\u0441\u043d\u043e\u0432\u043d\u0430\u044f \u0437\u0430\u0434\u0430\u0447\u0430 \u043a\u043e\u0442\u043e\u0440\u044b\u0445 \u2014 \u0432\u044b\u043f\u043e\u043b\u043d\u0435\u043d\u0438\u0435 \u0441\u0430\u0439\u0434-\u044d\u0444\u0444\u0435\u043a\u0442\u043e\u0432, \u043d\u0430\u0437\u044b\u0432\u0430\u044e\u0442 ",(0,r.jsx)(n.em,{children:"\u043a\u043e\u043c\u0430\u043d\u0434\u0430\u043c\u0438"}),". \u041a\u043e\u043c\u0430\u043d\u0434\u044b \u043d\u0435\u043b\u044c\u0437\u044f \u043c\u0435\u043c\u043e\u0438\u0437\u0438\u0440\u043e\u0432\u0430\u0442\u044c."]})}),"\n",(0,r.jsx)(n.h2,{id:"\u0434\u0440\u0443\u0433\u0438\u0435-\u043f\u0440\u0438\u043c\u0435\u0440\u044b",children:"\u0414\u0440\u0443\u0433\u0438\u0435 \u043f\u0440\u0438\u043c\u0435\u0440\u044b"}),"\n",(0,r.jsx)(n.p,{children:"\u041c\u0443\u0442\u0438\u0440\u0443\u044e\u0449\u0438\u0435 \u0441\u0435\u0440\u0432\u0435\u0440\u043d\u044b\u0435 \u043c\u0435\u0442\u043e\u0434\u044b \u2014 \u043d\u0435 \u0435\u0434\u0438\u043d\u0441\u0442\u0432\u0435\u043d\u043d\u044b\u0439 \u043f\u0440\u0438\u043c\u0435\u0440. \u041a \u044d\u0442\u043e\u0439 \u043a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u0438 \u0442\u0430\u043a\u0436\u0435 \u043e\u0442\u043d\u043e\u0441\u044f\u0442\u0441\u044f:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"\u0424\u0438\u0437\u0438\u0447\u0435\u0441\u043a\u0438\u0435 \u0432\u043e\u0437\u043c\u043e\u0436\u043d\u043e\u0441\u0442\u0438 \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432 (\u043d\u0430\u043f\u0440\u0438\u043c\u0435\u0440, \u0437\u0432\u0443\u043a\u0438, \u0432\u0438\u0431\u0440\u0430\u0446\u0438\u0438, \u043f\u0435\u0440\u0435\u0434\u0430\u0447\u0430 \u043f\u043e Bluetooth)."}),"\n",(0,r.jsx)(n.li,{children:"\u041f\u0435\u0440\u0435\u0434\u0430\u0447\u0430 \u0434\u0430\u043d\u043d\u044b\u0445 \u0432 \u0441\u0442\u043e\u0440\u043e\u043d\u043d\u0438\u0435 \u0441\u0435\u0440\u0432\u0438\u0441\u044b (\u043d\u0430\u043f\u0440\u0438\u043c\u0435\u0440, \u043e\u043f\u043b\u0430\u0442\u0430, SSO)."}),"\n"]}),"\n",(0,r.jsx)(n.admonition,{type:"note",children:(0,r.jsx)(n.p,{children:"\u041f\u0435\u0440\u0435\u0447\u0438\u0441\u043b\u0435\u043d\u043d\u044b\u0435 \u043c\u0435\u0442\u043e\u0434\u044b \u043f\u043e\u0434\u0447\u0438\u043d\u044f\u044e\u0442\u0441\u044f \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0430\u0432\u0438\u043b\u0443: \u0432\u044b\u043f\u043e\u043b\u043d\u044f\u044e\u0442 \u0441\u0430\u0439\u0434-\u044d\u0444\u0444\u0435\u043a\u0442\u044b \u0432\u043e \u0432\u043d\u0435\u0448\u043d\u0438\u0435 \u0445\u0440\u0430\u043d\u0438\u043b\u0438\u0449\u0430."})}),"\n",(0,r.jsx)(n.h2,{id:"\u0441\u043f\u043e\u0441\u043e\u0431-\u0432\u0435\u0440\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u0438",children:"\u0421\u043f\u043e\u0441\u043e\u0431 \u0432\u0435\u0440\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u0438"}),"\n",(0,r.jsx)(n.p,{children:"\u0424\u0443\u043d\u043a\u0446\u0438\u0438, \u0432\u044b\u043f\u043e\u043b\u043d\u044f\u044e\u0449\u0438\u0435 \u0441\u0430\u0439\u0434-\u044d\u0444\u0444\u0435\u043a\u0442\u044b, \u043f\u0440\u043e\u0432\u0435\u0440\u044f\u044e\u0442\u0441\u044f \u043c\u0435\u0442\u043e\u0434\u043e\u043c \u0441\u0440\u0430\u0432\u043d\u0435\u043d\u0438\u044f \u0436\u0443\u0440\u043d\u0430\u043b\u0430 \u0438\u0445 \u0432\u044b\u0437\u043e\u0432\u043e\u0432."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"/**\n * \u0412 \u043d\u0430\u0447\u0430\u043b\u0435 \u0436\u0443\u0440\u043d\u0430\u043b \u0432\u044b\u0437\u043e\u0432\u043e\u0432 \u043f\u0443\u0441\u0442 \u2014 []\n */\n\n\n/**\n * \u041f\u043e\u0441\u043b\u0435 \u043f\u0435\u0440\u0432\u043e\u0433\u043e \u0432\u044b\u0437\u043e\u0432\u0430 \u0432 \u0436\u0443\u0440\u043d\u0430\u043b\u0435 \u043f\u043e\u044f\u0432\u0438\u0442\u0441\u044f \u0437\u0430\u043f\u0438\u0441\u044c \u0441 \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u0435\u0439 \u043e \u0432\u044b\u0437\u043e\u0432\u0435 \u0438 \u043f\u0435\u0440\u0435\u0434\u0430\u043d\u043d\u044b\u0445 \u0430\u0440\u0433\u0443\u043c\u0435\u043d\u0442\u0430\u0445.\n * [[\"addUser\", [{ name: 'Vasiliy' }]]]\n */\nawait addUser({ name: 'Vasiliy' });\n\n/**\n * \u0416\u0443\u0440\u043d\u0430\u043b \u0431\u0443\u0434\u0435\u0442 \u043f\u043e\u043f\u043e\u043b\u043d\u044f\u0442\u044c\u0441\u044f \u043f\u0440\u0438 \u0432\u044b\u0437\u043e\u0432\u0435 \u043f\u043e\u0434\u043e\u0431\u043d\u044b\u0445 \u0444\u0443\u043d\u043a\u0446\u0438\u0439 \u0434\u0430\u043b\u0435\u0435.\n */\n"})}),"\n",(0,r.jsxs)(n.p,{children:["\u0412\u043e \u0432\u0440\u0435\u043c\u044f \u0442\u0435\u0441\u0442\u043e\u0432 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0430 \u0432\u044b\u0437\u044b\u0432\u0430\u0435\u0442 \u043c\u0435\u0442\u043e\u0434\u044b \u0438 \u0437\u0430\u043f\u043e\u043b\u043d\u044f\u0435\u0442 \u0436\u0443\u0440\u043d\u0430\u043b. \u0412 \u043a\u043e\u043d\u0446\u0435 \u0440\u0430\u0431\u043e\u0442\u044b \u0436\u0443\u0440\u043d\u0430\u043b \u0441\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u0435\u0442\u0441\u044f \u0441 ",(0,r.jsx)(n.a,{href:"/specification/requirements/borders#%D1%81%D1%85%D0%B5%D0%BC%D0%B0-%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%8B",children:"\u044d\u0442\u0430\u043b\u043e\u043d\u043e\u043c"}),", \u0447\u0442\u043e\u0431\u044b\n\u043f\u0440\u043e\u0432\u0435\u0440\u0438\u0442\u044c \u043a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u043e\u0441\u0442\u044c \u0440\u0430\u0431\u043e\u0442\u044b \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f."]}),"\n",(0,r.jsx)(n.p,{children:"\u0421\u0445\u0435\u043c\u0430 \u043f\u0440\u043e\u0446\u0435\u0441\u0441\u0430:"}),"\n",(0,r.jsx)(d.y,{src:i(5151)}),"\n",(0,r.jsx)(n.admonition,{type:"tip",children:(0,r.jsxs)(n.p,{children:["\u041c\u043e\u0436\u043d\u043e \u043f\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u0438\u0442\u044c, \u0447\u0442\u043e \u0432\u043d\u0435\u0448\u043d\u0435\u0435 \u0445\u0440\u0430\u043d\u0438\u043b\u0438\u0449\u0435 (\u043d\u0430\u043f\u0440\u0438\u043c\u0435\u0440, \u0411\u0414) \u2014 \u044d\u0442\u043e \u043c\u043e\u043d\u0438\u0442\u043e\u0440, \u043d\u0430 \u043a\u043e\u0442\u043e\u0440\u044b\u0439 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0435 ",(0,r.jsx)(n.em,{children:"\u043e\u0442\u0440\u0430\u0436\u0430\u0435\u0442"})," \u0441\u0430\u0439\u0434-\u044d\u0444\u0444\u0435\u043a\u0442\u044b.\n\u042d\u0442\u043e \u043e\u0442\u0440\u0430\u0436\u0435\u043d\u0438\u0435 \u0437\u0430\u0432\u0438\u0441\u0438\u0442 \u043e\u0442 \u043f\u043e\u0440\u044f\u0434\u043a\u0430 \u0432\u044b\u0437\u043e\u0432\u043e\u0432 \u043c\u0435\u0442\u043e\u0434\u043e\u0432 \u0438 \u0438\u0445 \u0430\u0440\u0433\u0443\u043c\u0435\u043d\u0442\u043e\u0432."]})}),"\n",(0,r.jsx)(n.h2,{id:"\u0441\u0432\u044f\u0437\u044c-\u0441-\u0431\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u043e\u0439",children:"\u0421\u0432\u044f\u0437\u044c \u0441 \u0431\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u043e\u0439"}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"storyshots"})," \u043f\u043e\u0437\u0432\u043e\u043b\u044f\u0435\u0442 \u0442\u0435\u0441\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0444\u0443\u043d\u043a\u0446\u0438\u0438, \u043f\u043e\u0434\u043e\u0431\u043d\u044b\u0435 ",(0,r.jsx)(n.code,{children:"addUser"}),", \u0434\u0432\u0443\u043c\u044f \u0441\u043f\u043e\u0441\u043e\u0431\u0430\u043c\u0438:"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["\u0421 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0435\u043c ",(0,r.jsx)(n.a,{href:"/specification/requirements/storage#%D1%81%D0%BF%D0%BE%D1%81%D0%BE%D0%B1-%D0%B2%D0%B5%D1%80%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%86%D0%B8%D0%B8",children:"\u0436\u0443\u0440\u043d\u0430\u043b\u0430 \u0432\u044b\u0437\u043e\u0432\u043e\u0432"})," (\u0440\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0443\u0435\u0442\u0441\u044f \u0434\u043b\u044f \u0431\u043e\u043b\u044c\u0448\u0438\u043d\u0441\u0442\u0432\u0430 \u0441\u043b\u0443\u0447\u0430\u0435\u0432)."]}),"\n",(0,r.jsxs)(n.li,{children:["\u0421 \u043f\u043e\u043c\u043e\u0449\u044c\u044e ",(0,r.jsx)(n.a,{href:"/patterns/externals#%D1%8D%D0%BC%D1%83%D0%BB%D1%8F%D1%86%D0%B8%D1%8F-externals",children:"\u044d\u043c\u0443\u043b\u044f\u0446\u0438\u0438 \u043f\u043e\u0432\u0435\u0434\u0435\u043d\u0438\u044f"})," (\u0443\u0441\u043b\u043e\u0436\u043d\u044f\u0435\u0442 \u0442\u0435\u0441\u0442\u044b, \u043d\u043e \u043f\u043e\u0432\u044b\u0448\u0430\u0435\u0442 \u0437\u0430\u0449\u0438\u0442\u0443 \u043e\u0442 \u0440\u0435\u0433\u0440\u0435\u0441\u0441\u0430)."]}),"\n"]})]})}function p(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(x,{...e})}):x(e)}},1465:(e,n,i)=>{i.d(n,{y:()=>r});i(6540);var s=i(4848);const r=e=>{let{src:n}=e;return(0,s.jsx)("img",{src:n.default,style:{border:"10px solid #fff"}})}},5151:(e,n,i)=>{i.r(n),i.d(n,{default:()=>s});const s=i.p+"assets/images/journal.drawio-d78c0617600487d33ee14e59809234d7.png"},8422:(e,n,i)=>{i.d(n,{Fn:()=>t,Hg:()=>c,JW:()=>r});i(6540);var s=i(4848);let r=function(e){return e.RegressionProtection="RegressionProtection",e.RefactoringAllowance="RefactoringAllowance",e.Maintainability="Maintainability",e.Speed="Speed",e}({});const t=e=>{let{improves:n}=e;return(0,s.jsx)(c,{improves:n,degrades:Object.values(r).filter((e=>!n.includes(e)))})},c=e=>{let{improves:n=[],degrades:i=[]}=e;const r=n.map((e=>d[e])),t=i.map((e=>d[e]));return(0,s.jsxs)("div",{children:[r.length>0&&(0,s.jsxs)("div",{style:{color:"green"},children:[r," \u0423\u043b\u0443\u0447\u0448\u0430\u0435\u0442"]}),t.length>0&&(0,s.jsxs)("div",{style:{color:"red"},children:[t," \u0423\u0445\u0443\u0434\u0448\u0430\u0435\u0442"]}),(0,s.jsx)("br",{})]})},d={[r.RegressionProtection]:(0,s.jsx)("a",{href:"/specification/metrics#%EF%B8%8F-\u0437\u0430\u0449\u0438\u0442\u0430-\u043e\u0442-\u0440\u0435\u0433\u0440\u0435\u0441\u0441\u0430",title:"\u0417\u0430\u0449\u0438\u0442\u0430 \u043e\u0442 \u0440\u0435\u0433\u0440\u0435\u0441\u0441\u0430",children:"\ud83d\udee1"}),[r.RefactoringAllowance]:(0,s.jsx)("a",{href:"/specification/metrics#-\u043d\u0435\u0437\u0430\u0432\u0438\u0441\u0438\u043c\u043e\u0441\u0442\u044c-\u043e\u0442-\u0440\u0435\u0444\u0430\u043a\u0442\u043e\u0440\u0438\u043d\u0433\u0430",title:"\u041d\u0435\u0437\u0430\u0432\u0438\u0441\u0438\u043c\u043e\u0441\u0442\u044c \u043e\u0442 \u0440\u0435\u0444\u0430\u043a\u0442\u043e\u0440\u0438\u043d\u0433\u0430",children:"\ud83d\udd27"}),[r.Maintainability]:(0,s.jsx)("a",{href:"/specification/metrics#-\u043f\u043e\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u043c\u043e\u0441\u0442\u044c",title:"\u041f\u043e\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u043c\u043e\u0441\u0442\u044c",children:"\ud83d\udcc8"}),[r.Speed]:(0,s.jsx)("a",{href:"/specification/metrics#-\u0431\u044b\u0441\u0442\u0440\u043e\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435",title:"\u0411\u044b\u0441\u0442\u0440\u043e\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435",children:"\u26a1"})}},8453:(e,n,i)=>{i.d(n,{R:()=>c,x:()=>d});var s=i(6540);const r={},t=s.createContext(r);function c(e){const n=s.useContext(t);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:c(e.components),s.createElement(t.Provider,{value:n},e.children)}}}]);
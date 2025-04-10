"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[3913],{8453:(e,r,n)=>{n.d(r,{R:()=>c,x:()=>i});var t=n(6540);const s={},a=t.createContext(s);function c(e){const r=t.useContext(a);return t.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function i(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:c(e.components),t.createElement(a.Provider,{value:r},e.children)}},9855:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>o,contentTitle:()=>i,default:()=>h,frontMatter:()=>c,metadata:()=>t,toc:()=>l});const t=JSON.parse('{"id":"API/createPreviewApp","title":"createPreviewApp","description":"\u0427\u0430\u0441\u0442\u044c \u043c\u043e\u0434\u0443\u043b\u044f @storyshots/react","source":"@site/docs/API/createPreviewApp.md","sourceDirName":"API","slug":"/API/createPreviewApp","permalink":"/storyshots/API/createPreviewApp","draft":false,"unlisted":false,"tags":[],"version":"current","frontMatter":{},"sidebar":"defaultSidebar","previous":{"title":"API","permalink":"/storyshots/API/"},"next":{"title":"\u0424\u0430\u0431\u0440\u0438\u043a\u0438 \u0442\u0435\u0441\u0442\u043e\u0432","permalink":"/storyshots/API/factories/"}}');var s=n(4848),a=n(8453);const c={},i="createPreviewApp",o={},l=[{value:"ExternalsFactory",id:"externalsfactory",level:2},{value:"createExternals",id:"createexternals",level:3},{value:"createJournalExternals",id:"createjournalexternals",level:3},{value:"run",id:"run",level:2}];function d(e){const r={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",hr:"hr",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(r.header,{children:(0,s.jsx)(r.h1,{id:"createpreviewapp",children:"createPreviewApp"})}),"\n",(0,s.jsx)(r.admonition,{type:"note",children:(0,s.jsxs)(r.p,{children:["\u0427\u0430\u0441\u0442\u044c \u043c\u043e\u0434\u0443\u043b\u044f ",(0,s.jsx)(r.a,{href:"/modules/react",children:(0,s.jsx)(r.code,{children:"@storyshots/react"})})]})}),"\n",(0,s.jsxs)(r.p,{children:["\u0424\u0443\u043d\u043a\u0446\u0438\u044f, \u0438\u043d\u0438\u0446\u0438\u0430\u043b\u0438\u0437\u0438\u0440\u0443\u044e\u0449\u0430\u044f ",(0,s.jsx)(r.a,{href:"/specification/requirements/borders#%D1%84%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D1%8F",children:"AUT"})," \u0438\n\u0441\u043e\u0437\u0434\u0430\u044e\u0449\u0430\u044f ",(0,s.jsx)(r.a,{href:"/API/factories/",children:"\u0444\u0430\u0431\u0440\u0438\u043a\u0438 \u0442\u0435\u0441\u0442\u043e\u0432"}),". \u041f\u0440\u0438\u043d\u0438\u043c\u0430\u0435\u0442 \u043e\u043f\u0438\u0441\u0430\u043d\u0438\u0435 ",(0,s.jsx)(r.a,{href:"/specification/requirements/env",children:"\u0432\u043d\u0435\u0448\u043d\u0438\u0445 \u0437\u0430\u0432\u0438\u0441\u0438\u043c\u043e\u0441\u0442\u0435\u0439"}),"\n",(0,s.jsx)(r.code,{children:"ExternalsFactory"}),"."]}),"\n",(0,s.jsx)(r.h2,{id:"externalsfactory",children:"ExternalsFactory"}),"\n",(0,s.jsxs)(r.p,{children:["\u041e\u0431\u044a\u0435\u043a\u0442 \u0434\u043b\u044f \u0438\u043d\u0438\u0446\u0438\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u0438 \u0438 \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f ",(0,s.jsx)(r.a,{href:"/specification/requirements/env",children:"\u0432\u043d\u0435\u0448\u043d\u0438\u043c\u0438 \u0437\u0430\u0432\u0438\u0441\u0438\u043c\u043e\u0441\u0442\u044f\u043c\u0438"})," \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f."]}),"\n",(0,s.jsx)(r.hr,{}),"\n",(0,s.jsx)(r.h3,{id:"createexternals",children:"createExternals"}),"\n",(0,s.jsxs)(r.p,{children:["\u041e\u0441\u043d\u043e\u0432\u043d\u0430\u044f \u0444\u0430\u0431\u0440\u0438\u043a\u0430, \u0438\u043d\u0438\u0446\u0438\u0430\u043b\u0438\u0437\u0438\u0440\u0443\u044e\u0449\u0430\u044f ",(0,s.jsx)(r.a,{href:"/specification/requirements/env",children:"\u0432\u043d\u0435\u0448\u043d\u0438\u0435 \u0437\u0430\u0432\u0438\u0441\u0438\u043c\u043e\u0441\u0442\u0438"})," \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f.\n\u041f\u0440\u0438\u043d\u0438\u043c\u0430\u0435\u0442 ",(0,s.jsx)(r.a,{href:"/API/story-elements/story-config",children:"StoryConfig"}),"."]}),"\n",(0,s.jsx)(r.pre,{children:(0,s.jsx)(r.code,{className:"language-ts",children:"createPreview({\n    createExternals: () => {\n        // \u0414\u0430\u043d\u043d\u043e\u0435 \u043f\u043e\u0432\u0435\u0434\u0435\u043d\u0438\u0435 \u0431\u0443\u0434\u0435\u0442 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c\u0441\u044f \u043f\u043e \u0443\u043c\u043e\u043b\u0447\u0430\u043d\u0438\u044e \u0432 \u0438\u0441\u0442\u043e\u0440\u0438\u044f\u0445\n        getUser: async () => DEFAULT_USER\n    },\n    /* ... */\n});\n"})}),"\n",(0,s.jsx)(r.h3,{id:"createjournalexternals",children:"createJournalExternals"}),"\n",(0,s.jsxs)(r.p,{children:["\u041f\u043e\u043c\u0435\u0447\u0430\u0435\u0442 \u0444\u0443\u043d\u043a\u0446\u0438\u0438 \u0432 \u043e\u0431\u044a\u0435\u043a\u0442\u0435 ",(0,s.jsx)(r.code,{children:"externals"}),", \u043a\u043e\u0442\u043e\u0440\u044b\u0435 \u0434\u043e\u043b\u0436\u043d\u044b \u0431\u044b\u0442\u044c ",(0,s.jsx)(r.a,{href:"/specification/requirements/storage#%D1%81%D0%BF%D0%BE%D1%81%D0%BE%D0%B1-%D0%B2%D0%B5%D1%80%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%86%D0%B8%D0%B8",children:"\u0436\u0443\u0440\u043d\u0430\u043b\u0438\u0440\u043e\u0432\u0430\u0442\u044c\u0441\u044f"})," \u043f\u043e \u0443\u043c\u043e\u043b\u0447\u0430\u043d\u0438\u044e. \u041f\u043e\u0441\u043b\u0435 \u0442\u043e\u0433\u043e \u043a\u0430\u043a \u0444\u0443\u043d\u043a\u0446\u0438\u044f\n\u043f\u043e\u043c\u0435\u0447\u0435\u043d\u0430 \u043a\u0430\u043a \u0437\u0430\u043f\u0438\u0441\u044b\u0432\u0430\u0435\u043c\u0430\u044f, \u044d\u0442\u043e \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043d\u0435\u043b\u044c\u0437\u044f \u043e\u0442\u043c\u0435\u043d\u0438\u0442\u044c."]}),"\n",(0,s.jsxs)(r.p,{children:["\u041f\u0440\u0438\u043d\u0438\u043c\u0430\u0435\u0442 \u0438\u0442\u043e\u0433\u043e\u0432\u044b\u0439 ",(0,s.jsx)(r.code,{children:"externals"})," \u0438 ",(0,s.jsx)(r.a,{href:"/API/story-elements/story-config",children:"StoryConfig"}),"."]}),"\n",(0,s.jsx)(r.pre,{children:(0,s.jsx)(r.code,{className:"language-ts",children:"createPreview({\n    createJournalExternals: (externals, config) => ({\n        ...externals,\n        getUser: config.journal.asRecordable(externals.getUser)\n    })\n});\n"})}),"\n",(0,s.jsx)(r.h2,{id:"run",children:"run"}),"\n",(0,s.jsxs)(r.p,{children:["\u041f\u043e\u043c\u0438\u043c\u043e ",(0,s.jsx)(r.a,{href:"/API/factories/",children:"\u0444\u0430\u0431\u0440\u0438\u043a\u0438 \u0442\u0435\u0441\u0442\u043e\u0432"}),", \u0432\u043e\u0437\u0432\u0440\u0430\u0449\u0430\u0435\u0442 \u0444\u0443\u043d\u043a\u0446\u0438\u044e ",(0,s.jsx)(r.code,{children:"run"}),", \u043d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c\u0443\u044e \u0434\u043b\u044f \u0437\u0430\u043f\u0443\u0441\u043a\u0430 \u043f\u0440\u0435\u0432\u044c\u044e. \u041f\u0440\u0438\u043d\u0438\u043c\u0430\u0435\u0442\n\u043c\u0430\u0441\u0441\u0438\u0432 ",(0,s.jsx)(r.a,{href:"/specification/requirements/borders",children:"\u0438\u0441\u0442\u043e\u0440\u0438\u0439"}),"."]}),"\n",(0,s.jsx)(r.pre,{children:(0,s.jsx)(r.code,{className:"language-tsx",children:"const { run, it } = createPreview(/* ... */);\n\nrun([\n    it('works', {\n        render: (externals) => <App externals={externals} />\n    }),\n]);\n"})})]})}function h(e={}){const{wrapper:r}={...(0,a.R)(),...e.components};return r?(0,s.jsx)(r,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}}}]);
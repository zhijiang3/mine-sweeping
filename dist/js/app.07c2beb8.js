(function(e){function n(n){for(var i,u,o=n[0],s=n[1],l=n[2],v=0,b=[];v<o.length;v++)u=o[v],Object.prototype.hasOwnProperty.call(c,u)&&c[u]&&b.push(c[u][0]),c[u]=0;for(i in s)Object.prototype.hasOwnProperty.call(s,i)&&(e[i]=s[i]);r&&r(n);while(b.length)b.shift()();return a.push.apply(a,l||[]),t()}function t(){for(var e,n=0;n<a.length;n++){for(var t=a[n],i=!0,o=1;o<t.length;o++){var s=t[o];0!==c[s]&&(i=!1)}i&&(a.splice(n--,1),e=u(u.s=t[0]))}return e}var i={},c={app:0},a=[];function u(n){if(i[n])return i[n].exports;var t=i[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,u),t.l=!0,t.exports}u.m=e,u.c=i,u.d=function(e,n,t){u.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},u.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},u.t=function(e,n){if(1&n&&(e=u(e)),8&n)return e;if(4&n&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(u.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var i in e)u.d(t,i,function(n){return e[n]}.bind(null,i));return t},u.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return u.d(n,"a",n),n},u.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},u.p="dist/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],s=o.push.bind(o);o.push=n,o=o.slice();for(var l=0;l<o.length;l++)n(o[l]);var r=s;a.push([0,"chunk-vendors"]),t()})({0:function(e,n,t){e.exports=t("cd49")},"022a":function(e,n,t){},2092:function(e,n,t){"use strict";t("2876")},2876:function(e,n,t){},"2a23":function(e,n,t){},"7b6e":function(e,n,t){"use strict";t("2a23")},8076:function(e,n,t){},"9cdc":function(e,n,t){"use strict";t("022a")},cd49:function(e,n,t){"use strict";t.r(n);t("e260"),t("e6cf"),t("cca6"),t("a79d"),t("8076");var i=t("830f"),c=t("5c40");function a(e,n){var t=Object(c["u"])("mine-sweeping");return Object(c["q"])(),Object(c["e"])(t)}t("99af");var u=t("9ff4"),o={class:"mine-sweeping-window"},s={class:"mine-sweeping-main"},l={class:"mine-sweeping-panel"},r={class:"mine-sweeping-clock"},v=Object(c["j"])("i",{class:"iconfont icon-clock"},null,-1),b=Object(c["j"])("div",{class:"mine-sweeping-face"},null,-1),f={class:"mine-sweeping-mine-count"},j=Object(c["j"])("i",{class:"iconfont icon-mine"},null,-1),g={class:"mine-sweeping-content"},O={key:0,class:"mine-sweeping-flag iconfont icon-flag2"},p={key:1,class:"mine-sweeping-mine iconfont icon-mine"},m={key:2},d={key:3},k={key:0,class:"mine-sweeping-setting"},w=Object(c["j"])("h3",null,[Object(c["j"])("i",{class:"iconfont icon-setting"}),Object(c["i"])("游戏设置")],-1),M=Object(c["j"])("span",null,"行数：",-1),h=Object(c["j"])("span",null,"列数：",-1),y=Object(c["j"])("span",null,"地雷数：",-1),x={style:{textAlign:"right"}};function F(e,n){var t=Object(c["u"])("mine-sweeping-menu");return Object(c["q"])(),Object(c["e"])("div",o,[Object(c["j"])(t,{onClick:e.onMenuClick},null,8,["onClick"]),Object(c["j"])("div",s,[Object(c["j"])("div",l,[Object(c["j"])("div",r,[v,Object(c["j"])("span",null,Object(u["G"])(Math.floor(e.stopwatchTiming/1e3))+"s",1)]),b,Object(c["j"])("span",null,Object(u["G"])(e.isWinner?"你赢了":e.isLoser?"你输啦":"游戏中"),1),Object(c["j"])("div",f,[j,Object(c["j"])("span",null,Object(u["G"])(e.settings.mines-e.mineFlagSize),1)])]),Object(c["j"])("div",g,[(Object(c["q"])(!0),Object(c["e"])(c["b"],null,Object(c["t"])(e.board,(function(t,i){return Object(c["q"])(),Object(c["e"])("div",{key:i,class:"mine-sweeping-rows"},[(Object(c["q"])(!0),Object(c["e"])(c["b"],null,Object(c["t"])(t,(function(t,a){return Object(c["q"])(),Object(c["e"])("span",{key:"".concat(i,"-").concat(a),class:["mine-sweeping-block",{"is-block":e.checkIsBlock(t,i,a),"is-dug-mine":e.isDugMine(t),"is-tap":e.tapBlock.has(e.getFlagKey(i,a)),"is-gameover":e.isGameOver}],onMousedown:function(n){return e.onMousedown(n,i,a)},onMouseup:function(n){return e.onMouseup(i,a)},onContextmenu:n[1]||(n[1]=function(){return e.onContextmenu.apply(e,arguments)})},[e.isLoser&&e.isMine(t)&&e.isMineFlag(e.getFlagKey(i,a))||e.isWinner&&e.isMine(t)||!e.isGameOver&&e.isMineFlag(e.getFlagKey(i,a))?(Object(c["q"])(),Object(c["e"])("i",O)):Object(c["f"])("",!0),e.isLoser&&e.isMine(t)&&!e.isMineFlag(e.getFlagKey(i,a))?(Object(c["q"])(),Object(c["e"])("i",p)):Object(c["f"])("",!0),e.isGameOver&&e.isMine(t)||!e.isUnknownFlag(e.getFlagKey(i,a))?Object(c["f"])("",!0):(Object(c["q"])(),Object(c["e"])("i",m,"?")),e.isLoser&&!e.isMine(t)&&e.isMineFlag(e.getFlagKey(i,a))?(Object(c["q"])(),Object(c["e"])("i",d,"x")):Object(c["f"])("",!0),Object(c["j"])("span",null,Object(u["G"])(e.getBlockText(t)),1)],42,["onMousedown","onMouseup"])})),128))])})),128))])]),e.showSetting?(Object(c["q"])(),Object(c["e"])("div",k,[w,Object(c["j"])("form",{onSubmit:n[5]||(n[5]=Object(i["c"])((function(){}),["prevent"]))},[Object(c["j"])("div",null,[M,Object(c["B"])(Object(c["j"])("input",{"onUpdate:modelValue":n[2]||(n[2]=function(n){return e.settingModel.rows=n})},null,512),[[i["b"],e.settingModel.rows,void 0,{number:!0}]])]),Object(c["j"])("div",null,[h,Object(c["B"])(Object(c["j"])("input",{"onUpdate:modelValue":n[3]||(n[3]=function(n){return e.settingModel.cols=n})},null,512),[[i["b"],e.settingModel.cols,void 0,{number:!0}]])]),Object(c["j"])("div",null,[y,Object(c["B"])(Object(c["j"])("input",{"onUpdate:modelValue":n[4]||(n[4]=function(n){return e.settingModel.mines=n})},null,512),[[i["b"],e.settingModel.mines,void 0,{number:!0}]])])],32),Object(c["j"])("div",x,[Object(c["j"])("button",{onClick:n[6]||(n[6]=function(n){return e.showSetting=!1})},"取消"),Object(c["j"])("button",{onClick:n[7]||(n[7]=function(){return e.onSetting.apply(e,arguments)})},"确定")])])):Object(c["f"])("",!0)])}t("5377");var B=t("5530"),S=t("a1e9");function L(){var e=Object(S["h"])({cols:8,rows:8,mines:10});function n(n){n.mines&&(e.mines=Math.max(10,n.mines)),n.cols&&(e.cols=Math.max(8,Math.min(30,n.cols))),n.rows&&(e.rows=Math.max(8,Math.min(24,n.rows)))}return Object(c["A"])((function(){var n=(e.rows-1)*(e.cols-1);e.mines>n&&(e.mines=n)})),{settings:e,setSettings:n}}t("cb29"),t("4160"),t("4ec9"),t("d3b7"),t("6062"),t("3ca3"),t("ddb0");var A,q,C,E,D=t("3835"),R=t("ade3"),T=navigator.userAgent,G=/macintosh|mac os x/i.test(T),K=/windows|win32/i.test(T);(function(e){e[e["Null"]=0]="Null",e[e["Mine"]=1]="Mine",e[e["Unknown"]=2]="Unknown"})(A||(A={})),function(e){e["Empty"]="E",e["Mine"]="M",e["Block"]="B",e["DugMine"]="X"}(q||(q={})),function(e){e[e["init"]=0]="init",e[e["playing"]=1]="playing",e[e["win"]=2]="win",e[e["lose"]=3]="lose"}(C||(C={})),function(e){e[e["Left"]=1]="Left",e[e["Right"]=2]="Right",e[e["LeftRight"]=3]="LeftRight"}(E||(E={}));var U=[-1,0,1,0,1,-1,-1,1],_=[0,-1,0,1,1,-1,1,-1];function N(e,n,t){return n<0||n>=e.length||t<0||t>=e[0].length}function P(e,n,t,i){var c=e.length,a=e[0].length;while(i){var u=Math.floor(Math.random()*c*a),o=Math.floor(u/a),s=Math.max(0,u-1)%a;o!==n&&s!==t&&e[o][s]!==q.Mine&&(e[o][s]=q.Mine,i--)}}function I(e){return/[0-9]/.test(e)}function W(e){return e===q.Empty||e===q.Mine}var z=Object(S["i"])(new Set);function V(e){var n=Object(S["i"])(C.init),t=Object(S["i"])([]),i=Object(S["i"])(new Map),a=Object(c["d"])((function(){return n.value===C.lose||n.value===C.win}));function u(){n.value=C.init,i.value=new Map,t.value=new Array(e.rows);for(var c=e.rows-1;c>-1;--c)t.value[c]=new Array(e.cols).fill(q.Empty)}function o(n,t){return e.cols*n+t}function s(e,n){var t="undefined"===typeof n?e:o(e,n);return!i.value.has(t)||i.value.get(t)===A.Null}function l(){for(var e,c=t.value.length,a=t.value[0].length,u=(e={},Object(R["a"])(e,q.DugMine,0),Object(R["a"])(e,q.Empty,0),Object(R["a"])(e,q.Block,0),Object(R["a"])(e,q.Mine,0),e),s=0;s<c;++s)for(var l=0;l<a;++l){var r=t.value[s][l];if(r===q.Block||I(r)){var v=o(s,l);i.value.has(v)&&i.value.delete(v)}u[r]||(u[r]=0),u[r]++}u[q.DugMine]>0?n.value=C.lose:0===u[q.Empty]&&(n.value=C.win)}function r(e,n){var i=t.value[e][n];switch(i){case q.Mine:t.value[e][n]=q.DugMine;break;case q.Empty:for(var c=0,a=0;a<U.length;++a){var u=e+U[a],o=n+_[a];N(t.value,u,o)||t.value[u][o]!==q.Mine||c++}if(c>0)t.value[e][n]="".concat(c);else{t.value[e][n]=q.Block;for(var s=0;s<U.length;++s){var l=e+U[s],v=n+_[s];N(t.value,l,v)||t.value[l][v]!==q.Empty||r(l,v)}}break}}function v(i,c){s(i,c)&&(n.value===C.init&&P(t.value,i,c,e.mines),n.value=C.playing,r(i,c),l())}function b(e,n){var c=t.value[e][n];if(W(c)){var a=o(e,n);if(i.value.has(a)){var u=(i.value.get(a)+1)%3;i.value.set(a,u)}else i.value.set(a,A.Mine)}}function f(e){e.preventDefault()}var j=0,g=-1;function O(e,n,i){if(!a.value)switch(j=e.buttons,g=o(n,i),j===E.Left&&(G&&e.metaKey&&(j=E.LeftRight),K&&e.ctrlKey&&(j=E.LeftRight)),j){case E.Left:s(n,i)&&z.value.add(o(n,i));break;case E.LeftRight:if(I(t.value[n][i]))for(var c=0;c<U.length;++c){var u=n+U[c],l=i+_[c],r=o(u,l);!N(t.value,u,l)&&W(t.value[u][l])&&s(r)&&z.value.add(r)}break}}function p(e,n){if(!N(t.value,e,n)&&!a.value&&o(e,n)===g)switch(j){case E.Left:v(e,n);break;case E.Right:b(e,n);break;case E.LeftRight:if(I(t.value[e][n])){for(var c=[],u=0,f=0;f<U.length;++f){var O=e+U[f],p=n+_[f],m=o(O,p);!N(t.value,O,p)&&W(t.value[O][p])&&(s(m)&&c.push([O,p]),i.value.get(m)===A.Mine&&u++)}parseInt(t.value[e][n])===u&&(c.forEach((function(e){var n=Object(D["a"])(e,2),t=n[0],i=n[1];return r(t,i)})),l())}break}}return u(),{status:n,board:t,flags:i,tapBlock:z,getFlagKey:o,onMineSweeping:v,onRestart:u,onContextmenu:f,onMousedown:O,onMouseup:p}}function J(e){var n,t=Object(S["i"])(0),i=Object(S["i"])(0);function a(){i.value=Date.now()-t.value,n=setTimeout(a,1e3)}function u(){clearTimeout(n)}return Object(c["A"])((function(){switch(e.value){case C.init:i.value=0,u();break;case C.playing:t.value=Date.now(),a();break;case C.lose:case C.win:u();break}})),{startTime:t,stopwatchTiming:i}}document.addEventListener("mouseup",(function(){z.value.clear()}));var X=t("b85c");function H(e,n){var t=Object(c["d"])((function(){return e.value===C.lose})),i=Object(c["d"])((function(){return e.value===C.win})),a=Object(c["d"])((function(){return t.value||i.value}));function u(e){return e===q.DugMine}function o(e){return e===q.Mine||u(e)}function s(e){return e===q.Empty||o(e)}function l(e){return n.value.get(e)===A.Mine}function r(e){return!n.value.has(e)||n.value.get(e)===A.Null}function v(e){return n.value.get(e)===A.Unknown}function b(e){switch(e){case q.Mine:case q.DugMine:case q.Empty:case q.Block:return"";default:return e}}var f=Object(c["d"])((function(){var e,t=0,i=Object(X["a"])(n.value.keys());try{for(i.s();!(e=i.n()).done;){var c=e.value;n.value.get(c)===A.Mine&&t++}}catch(a){i.e(a)}finally{i.f()}return t}));return{getBlockText:b,isGameOver:a,isLoser:t,isWinner:i,isBlock:s,isMine:o,isDugMine:u,isMineFlag:l,isNullFlag:r,isUnknownFlag:v,mineFlagSize:f}}t("4c53");var Q=Object(c["C"])("data-v-34673262");Object(c["s"])("data-v-34673262");var Y={class:"mine-sweeping-menu"};Object(c["r"])();var Z=Q((function(e,n){var t=Object(c["v"])("click-outside");return Object(c["B"])((Object(c["q"])(),Object(c["e"])("div",Y,[(Object(c["q"])(!0),Object(c["e"])(c["b"],null,Object(c["t"])(e.menus,(function(n){return Object(c["q"])(),Object(c["e"])("div",{key:n.key,class:["mine-sweeping-menu-item",{"is-hover":e.active===n.key}],onClick:function(t){return e.clickActive(n.key)},onMouseenter:function(t){return e.hoverActive(n.key)}},[Object(c["j"])("span",null,Object(u["G"])(n.text),1),n.sub&&n.sub.length?(Object(c["q"])(),Object(c["e"])("div",{key:0,class:["mine-sweeping-sub-menu",{"is-show":e.active===n.key}]},[(Object(c["q"])(!0),Object(c["e"])(c["b"],null,Object(c["t"])(n.sub,(function(n,t){return Object(c["q"])(),Object(c["e"])(c["b"],null,[n.spacer?(Object(c["q"])(),Object(c["e"])("div",{key:t,class:"mine-sweeping-menu-spacer"})):(Object(c["q"])(),Object(c["e"])("div",{key:n.key,class:"mine-sweeping-menu-item",onClick:function(t){return e.onClickMenuItem(n.key)}},[Object(c["j"])("span",null,Object(u["G"])(n.text),1)],8,["onClick"]))],64)})),256))],2)):Object(c["f"])("",!0)],42,["onClick","onMouseenter"])})),128))],512)),[[t,e.clearActive]])}));function $(){var e=Object(S["i"])(""),n=Object(S["i"])(!1);function t(){n.value=!1,e.value=""}function i(i){n.value||(n.value=!0),e.value===i?t():e.value=i}function c(t){n.value&&(e.value=t)}return{active:e,clickActive:i,hoverActive:c,clearActive:t}}t("c975"),t("a434"),t("10d1");var ee,ne=[],te=new WeakMap;document.addEventListener("mousedown",(function(e){return ee=e})),document.addEventListener("mouseup",(function(e){ne.forEach((function(n){if(e.target&&ee.target&&!n.contains(e.target)&&!n.contains(ee.target)&&n!==e.target){var t=te.get(n);null===t||void 0===t||t.value()}}))}));var ie={mounted:function(e,n){ne.push(e),te.set(e,n)},updated:function(e,n){te.set(e,n)},unmounted:function(e){ne.splice(ne.indexOf(e),1),te.delete(e)}},ce=ie,ae=Object(c["k"])({name:"MineSweepingMenu",directives:{clickOutside:ce},setup:function(e,n){var t=$(),i=t.active,c=t.clickActive,a=t.hoverActive,u=t.clearActive,o=Object(S["i"])([{text:"游戏",key:"game",sub:[{text:"重新开始",key:"restart"},{spacer:!0},{text:"初级",key:"easy"},{text:"中级",key:"middle"},{text:"高级",key:"hard"},{text:"自定义",key:"custom"}]},{text:"帮助",key:"help",sub:[{text:"玩法介绍",key:"gameRule"}]}]);function s(e){n.emit("click",e)}return{menus:o,onClickMenuItem:s,active:i,clickActive:c,hoverActive:a,clearActive:u}}});t("7b6e");ae.render=Z,ae.__scopeId="data-v-34673262";var ue=ae,oe=Object(c["k"])({name:"MineSweeping",components:{MineSweepingMenu:ue},setup:function(){var e=L(),n=e.settings,t=e.setSettings,i=V(n),a=i.status,u=i.board,o=i.flags,s=i.tapBlock,l=i.getFlagKey,r=i.onRestart,v=i.onContextmenu,b=i.onMousedown,f=i.onMouseup,j=J(a),g=j.stopwatchTiming,O=H(a,o),p=O.getBlockText,m=O.isGameOver,d=O.isLoser,k=O.isWinner,w=O.isBlock,M=O.isMine,h=O.isDugMine,y=O.isMineFlag,x=O.isNullFlag,F=O.isUnknownFlag,A=O.mineFlagSize,q=Object(S["i"])(!1),C=Object(S["i"])(Object(B["a"])({},n));function E(){t(Object(B["a"])({},C.value)),r(),q.value=!1}function D(e,n,t){return!!(d.value&&M(e)&&y(l(n,t)))||(d.value?!(!M(e)&&y(l(n,t)))&&(w(e)&&!M(e)):w(e))}function R(e){switch(e){case"easy":t({rows:8,cols:8,mines:10}),r();break;case"middle":t({rows:16,cols:16,mines:40}),r();break;case"hard":t({rows:16,cols:30,mines:99}),r();break;case"custom":break;case"restart":r();break}}return Object(c["A"])((function(){q.value&&(C.value=Object(B["a"])({},n))})),{onMenuClick:R,showSetting:q,settingModel:C,onSetting:E,board:u,flags:o,settings:n,stopwatchTiming:g,tapBlock:s,isGameOver:m,isLoser:d,isWinner:k,isMineFlag:y,isNullFlag:x,isUnknownFlag:F,isBlock:w,isMine:M,isDugMine:h,getFlagKey:l,getBlockText:p,mineFlagSize:A,onRestart:r,onContextmenu:v,onMousedown:b,onMouseup:f,checkIsBlock:D}}});t("2092");oe.render=F;var se=oe,le=Object(c["k"])({name:"App",components:{MineSweeping:se}});t("9cdc");le.render=a;var re=le;Object(i["a"])(re).mount("#app")}});
import{aI as g,aJ as x,aK as b,aL as m,aM as I,aN as h,I as O,aO as w,aP as P,aQ as L,aR as M}from"../app.JhorOYlA.js";var l=Object.prototype,F=l.hasOwnProperty,R=g(function(a,n){a=Object(a);var i=-1,r=n.length,t=r>2?n[2]:void 0;for(t&&x(n[0],n[1],t)&&(r=1);++i<r;)for(var f=n[i],e=b(f),s=-1,v=e.length;++s<v;){var d=e[s],u=a[d];(u===void 0||m(u,l[d])&&!F.call(a,d))&&(a[d]=f[d])}return a});const N=R;function $(a){return function(n,i,r){var t=Object(n);if(!I(n)){var f=h(i);n=O(n),i=function(s){return f(t[s],s,t)}}var e=a(n,i,r);return e>-1?t[f?n[e]:e]:void 0}}var q=Math.max;function A(a,n,i){var r=a==null?0:a.length;if(!r)return-1;var t=i==null?0:w(i);return t<0&&(t=q(r+t,0)),P(a,h(n),t)}var C=$(A);const Q=C;function E(a,n){return a<n}function J(a,n,i){for(var r=-1,t=a.length;++r<t;){var f=a[r],e=n(f);if(e!=null&&(s===void 0?e===e&&!L(e):i(e,s)))var s=e,v=f}return v}function S(a){return a&&a.length?J(a,M,E):void 0}export{E as a,J as b,N as d,Q as f,S as m};
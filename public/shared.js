'use strict';var h;Array.l=function(...a){return(a[0]||[]).map((b,d)=>a.map((a)=>a[d]))};h=Array.prototype;h.l=function(...a){return Array.l(this,...a)};h.L=function(){return this.reduce((a,b)=>a+b,0)};h.product=function(){return this.reduce((a,b)=>a*b,1)};h.add=function(...a){return this.l(...a).map((a)=>a.L())};h.J=function(){return this.map((a)=>-a)};h.sub=function(a){return this.add(a.J())};h.scale=function(a){return this.map((b)=>b*a)};h.o=function(...a){return Array.o(this,...a)};
h.I=function(){return this.reduce((a,b)=>a.concat(b),[])};Array.o=function(a,...b){return void 0===a?[[]]:a.map((a)=>Array.o(...b).map((b)=>[a,...b])).I()};Array.prototype.F=function(){return Array(Math.ceil(this.length/2)).fill().map((a,b)=>this.slice(2*b,2*b+2))};const n=([a,b],[d,c])=>[a+d,b+c],p=([a,b])=>[-a,-b],q=(a,b)=>b.scale(32).sub(a),r=(a,b)=>b.add(a).scale(.03125).map(Math.floor);function t(a,b,d,c){this.source=a;this.j=b;this.offset=d||[0,0];this.size=c||n(b,p(this.offset))}h=t.prototype;h.keys=function*(){for(let a=0;a<this.size[0];a++)for(let b=0;b<this.size[1];b++)yield[a,b]};function w([a,b],[,d]){return a*d+b}h.get=function(a){if(!(0>a[0]||a[0]>this.size[0]||0>a[1]||a[1]>this.size[1]))return this.source[w(n(a,this.offset),this.j)]};h.set=function(a,b){0>a[0]||a[0]>this.size[0]||0>a[1]||a[1]>this.size[1]||(this.source[w(n(a,this.offset),this.j)]=b)};
h.update=function(a,b){this.set(a,b(this.get(a),a))};h.B=function(a){for(let b of this.keys())this.update(b,a)};h.shift=function(a){return new t(this.source,this.j,n(this.offset,a),n(this.size,p(a)))};h.K=function(a){return new t(this.source,this.j,this.offset,a)};h.window=function(a,b){return this.shift(a).K(b)};h.toJSON=function(){return Array.from(this.keys()).map((a)=>this.get(a))};h.h=function(a){Array.from(this.keys()).l(a).forEach(([a,d])=>this.set(a,d))};function x(a,b){this.coords=a;let {b:d,c}=b||{};this.b=d||new t(new Uint8Array(256),[16,16]);this.c=c||new t(new Uint8Array(256),[16,16])}var y=([a,b])=>[Math.floor(a/16),Math.floor(b/16)];x.prototype.G=function(a){return a.sub(this.coords.scale(16))};x.prototype.h=function({terrain:a,water:b}){this.b.h(a);this.c.h(b)};x.prototype.toJSON=function(){return{terrain:this.b.toJSON(),water:this.c.toJSON()}};function z(){this.g={};this.C={};this.v={};this.u=new EventTarget}z.prototype.get=function(a){void 0===this.g[a]&&(this.g[a]=new x(a));1E3<new Date-(this.C[a]||0)&&!(a in this.v)&&(this.v[a]=!0,A(a).then((b)=>this.g[a].h(b)).then(()=>this.C[a]=new Date).then(()=>delete this.v[a]).then(()=>setTimeout(()=>this.get(a),1050)).then(()=>this.dispatchEvent(new Event("update",a))));return this.g[a]};function A(a){return window.fetch(`block/${a[0]}/${a[1]}`).then((a)=>a.json())}
z.prototype.addEventListener=function(...a){this.u.addEventListener(...a)};z.prototype.removeEventListener=function(...a){this.u.removeEventListener(...a)};z.prototype.dispatchEvent=function(...a){this.u.dispatchEvent(...a)};const B=Uint8Array.from("0061736d01000000011d066000017c60017f0060000060017d017f60057f7f7f7f7f006000017f02180203656e760672616e646f6d000003656e76036c6f6700010307060203040202050405017001010105030100300619037f01418080c0000b7f00418080c0010b7f00418080c0010b076f08066d656d6f72790200195f5f696e6469726563745f66756e6374696f6e5f7461626c6501000b5f5f686561705f6261736503010a5f5f646174615f656e64030204696e69740005047469636b00060761646472657373000713727573745f65685f706572736f6e616c69747900020901000a8006060300010b3d01017f200020008e2200931000b65e027f41808080807820008b430000004f5d450d001a2000a80b6a2201410020016b200141107441107541004a1b0b7101017d200341ff01712203b3200441ff01712204b39343cdcccc3e430ad7233c2003200141ff01714b22031b43cdcccc3e430ad7233c2004200241ff01714b22011b9494220510032104200020054317b7d13994430000000020011b430000000020031b10033a0001200020043a00000bba0102017f017c418080402100024003402000450d01200041808080016a027f41001000440000000000007040a2220144000000000000f0416320014400000000000000006671450d001a2001ab0b3a0000200041016a21000c000b000b418080c00021000240034020004180808001460d012000418080c0006a027f41001000440000000000007040a2220144000000000000f0416320014400000000000000006671450d001a2001ab0b3a0000200041016a21000c000b000b0b8503010b7f230041106b22042400024003402006418008460d012006410a7422014180f83f71210920014180086a4180f83f71210a41002107024003402007418008460d01200441086a200741ff077122002009722202418080c0006a22012d00002000200a722203418080c0006a22052d0000200241808080016a22002d0000200341808080016a22022d00001004200020002d000020042d000822036b3a00002002200320022d00006a3a0000200120012d000020042c000922026b3a00002005200220052d00006a3a0000200420012d0000200741016a220741ff07712009722203418080c0006a22052d000020002d0000200341808080016a22032d00001004200020002d000020042d000022006b3a00002003200020032d00006a3a0000200120012d000020026b3a0000200520052d000020042c000122016a3a000020082002200241077522006a20007341ff01716a2001200141077522006a20007341ff01716a21080c000b000b200641016a21060c000b000b20081001200441106a24000b0700418080c0000b".split("").F().map(([a,
b])=>parseInt(a+b,16)));function C(){var a=new WebAssembly.Module(B);this.i=new WebAssembly.Instance(a,{env:{random:Math.random,log:(a)=>console.log("from rust with love: "+a)}});this.i.exports.init();a=this.i.exports.memory;this.m=this.i.exports.address();console.log("address: "+this.m);this.b=new t(new Uint8Array(a.buffer,this.m,1048576),[1024,1024]);this.c=new t(new Uint8Array(a.buffer,this.m+1048576,1048576),[1024,1024])}C.prototype.M=function(){this.i.exports.tick()};function D(){var a;void 0==a&&(a=Math);this.w=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];this.p=[];for(let b=0;256>b;b++)this.p[b]=Math.floor(256*a.random());this.a=[];for(a=0;512>a;a++)this.a[a]=this.p[a&255]}D.prototype.s=function(a,b,d){return a[0]*b+a[1]*d};
D.prototype.A=function(a,b){var d=.5*(a+b)*(Math.sqrt(3)-1),c=Math.floor(a+d),m=Math.floor(b+d);d=(3-Math.sqrt(3))/6;var g=(c+m)*d;a-=c-g;var e=b-(m-g);if(a>e){var l=1;var k=0}else l=0,k=1;g=a-l+d;var f=e-k+d;b=a-1+2*d;d=e-1+2*d;var u=c&255,v=m&255;c=this.a[u+this.a[v]]%12;m=this.a[u+l+this.a[v+k]]%12;l=this.a[u+1+this.a[v+1]]%12;k=.5-a*a-e*e;0>k?a=0:(k*=k,a=k*k*this.s(this.w[c],a,e));e=.5-g*g-f*f;0>e?g=0:(e*=e,g=e*e*this.s(this.w[m],g,f));f=.5-b*b-d*d;0>f?b=0:(f*=f,b=f*f*this.s(this.w[l],b,d));return 70*
(a+g+b)};const E=(a)=>{let b=new D,d=new D,c=new D;a.B((a,[g,e])=>Math.min(255,Math.floor(128/3*(.4*(b.A(g/8,e/8)+1)+1.8*(d.A(g/24,e/24)+1)+1*(c.A(g/64,e/64)+1)))))},F=(a)=>{a.B(()=>70)};function G(){let a=new C,b=a.b,d=a.c;console.log("creating terrain");E(b);console.log("creating water");F(d);console.log("creating blocks");let c=new t(Array(4096),[64,64]);c.B((a,[e,c])=>new x([e,c],{b:b.window([16*e,16*c],[16,16]),c:d.window([16*e,16*c],[16,16])}));console.log("done");let m=()=>{let b=new Date;a.M();console.log("tick time: "+(new Date-b));setTimeout(m,1E3)};m();return{io:(a)=>{a.on("disconnect",()=>{console.log("Disconnected: "+a.id)});console.log("Connected: "+a.id)},"block/:col/:row":(a,
b)=>{b.json(c.get([parseInt(a.params.col),parseInt(a.params.row)]))}}};function H(a,b){this.type=a;this.f=b||{};if("trees"==this.type)for(this.f.D=[],a=0;16>a;a++)this.f.D.push("hsl(104,66%,"+(21+20*Math.random())+"%)")}const I={cloud:(a,b)=>{b=[[0,0,32,10],[23,0,10,32],[0,22,32,10],[0,0,10,32]][b.f.direction||0];a.fillStyle="#CADDE3bb";a.fillRect(...b)},rain:(a)=>{a.fillStyle="#77AEEDbb";a.fillRect(12,12,10,10)},trees:(a,b)=>{b.f.D.forEach((b,c)=>{a.fillStyle=b;a.fillRect(c%4*8,8*Math.floor(c/4),8,8)})}};H.prototype.H=function(a){I[this.type](a,this)};const J=(a,b,d,c,m)=>{a.clearRect(0,0,b.width,b.height);let [g,e]=r(d,[0,0]),[l,k]=r(d,[b.width,b.height]);for(b=g;b<=l;b++)for(let c=e;c<=k;c++){var f=m.get(y([b,c]));let e=f.G([b,c]),g=f.c.get(e);f=f.b.get(e);var [u,v]=q(d,[b,c]);a.fillStyle=g>f?"hsl(230,80%,"+Math.floor(32+g/255*40)+"%)":240<f?"hsl(0,0%,"+Math.floor(70+(f-240)/15*20)+"%)":220<f?"hsl(35,48%,"+Math.floor(29+(f-220)/35*-14)+"%)":110<f?"hsl(87,48%,"+Math.floor(40+(f-110)/110*-25)+"%)":"hsl(70,56%,"+Math.floor(55+f/110*-21)+"%)";a.fillRect(u,
v,32,32)}c.forEach(([[b,c],e])=>{a.save();let [f,g]=q(d,[b,c]);a.translate(f,g);e.H(a);a.restore()})};"undefined"!==eval("typeof window")?window.addEventListener("load",()=>{let a,b=new z,d=[[[12,23],new H("cloud",{direction:2})],[[18,24],new H("cloud",{direction:3})],[[14,24],new H("trees")]];a=io({N:!1,transports:["websocket"]});let c=document.getElementById("c"),m=c.getContext("2d"),g=()=>{c.width=window.innerWidth;c.height=window.innerHeight};window.addEventListener("resize",g);g();let e=[0,0],l=null,k=()=>J(m,c,e,d,b);b.addEventListener("update",()=>window.requestAnimationFrame(k));c.addEventListener("mousedown",
(a)=>l=[a.x,a.y]);c.addEventListener("mouseup",()=>l=null);c.addEventListener("mousemove",(a)=>{if(l){let b=[a.x,a.y].sub(l);e=e.sub(b);l=[a.x,a.y];window.requestAnimationFrame(k);e=e.map((a)=>Math.max(a,0))}});(()=>{a.on("start",()=>{console.log("Started")});a.on("connect",()=>{console.log("Connected")});a.on("disconnect",()=>{console.log("Disconnected")});a.on("error",()=>{console.log("Oh shit")})})();k()},!1):module.exports=G();
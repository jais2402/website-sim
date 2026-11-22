/**
 * Fragment shaders for the homepage (design: "V9 · WebGL Cinema").
 * Each draws one full-screen triangle; `v` is 0–1 across the canvas.
 */
export type ShaderName = 'hero' | 'film' | 'mem' | 'stars'

export const VERTEX = 'attribute vec2 p;\nvarying vec2 v;\nvoid main(){v=p*0.5+0.5;gl_Position=vec4(p,0.0,1.0);}\n'

const HEAD = `precision mediump float;
varying vec2 v;
uniform vec2 uRes;
uniform float uTime;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);vec2 u=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),u.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x),u.y);}
float fbm(vec2 p){float s=0.0;float a=0.5;for(int i=0;i<5;i++){s+=a*noise(p);p*=2.02;a*=0.5;}return s;}
`

export const FRAGMENT: Record<ShaderName, string> = {
  // Projector beam with drifting dust. The beam follows the pointer and widens as the hero scrolls away.
  hero: `${HEAD}uniform vec2 uMouse;
uniform float uScroll;
void main(){
 vec2 uv=v; float asp=uRes.x/uRes.y;
 vec2 p=vec2((uv.x-0.5)*asp,uv.y)+vec2(sin(uTime*1.7)*0.0015,cos(uTime*1.3)*0.0012);
 vec2 src=vec2((uMouse.x-0.5)*asp*0.35,1.08);
 vec2 d=p-src; float dist=length(d); float ang=atan(d.x,-d.y);
 float width=0.22+uScroll*0.35;
 float beam=smoothstep(width,0.0,abs(ang))*smoothstep(1.6,0.05,dist);
 float dust=fbm(p*3.0+vec2(uTime*0.03,-uTime*0.05));
 float specks=pow(noise(p*60.0+uTime*0.5),18.0)*3.0;
 float ripple=0.5+0.5*sin(p.x*6.0+fbm(p*1.5+uTime*0.05)*6.0+uTime*0.4);
 vec3 tung=vec3(0.910,0.722,0.471); vec3 ivory=vec3(0.961,0.949,0.925); vec3 red=vec3(0.557,0.106,0.149);
 vec3 col=red*0.12*(1.0-uv.y)*fbm(p*2.0-uTime*0.02);
 vec3 light=mix(tung,ivory,beam*0.6);
 col+=light*beam*(0.35+0.65*dust)*(0.75+0.25*ripple);
 col+=light*specks*beam;
 col+=tung*0.05*ripple*(1.0-dist*0.5);
 col*=1.0-uScroll*0.65;
 col+=(hash(uv*uRes+fract(uTime)*91.0)-0.5)*0.045;
 col*=smoothstep(1.25,0.35,length((uv-0.5)*vec2(asp*0.8,1.0)));
 gl_FragColor=vec4(col,1.0);
}
`,
  // Poster-coloured wash that ripples at the pointer and dissolves to the next film's colours.
  film: `${HEAD}uniform vec2 uMouse;
uniform vec3 uA1;
uniform vec3 uB1;
uniform vec3 uA2;
uniform vec3 uB2;
uniform float uMix;
vec3 poster(vec2 uv,vec3 a,vec3 b){float r=length((uv-vec2(0.62,0.72))*vec2(1.3,1.0));vec3 c=mix(a,b,smoothstep(0.0,0.75,r));return mix(c,vec3(0.05,0.043,0.039),smoothstep(0.55,1.1,r));}
void main(){
 vec2 uv=v; float asp=uRes.x/uRes.y;
 vec2 d=(uv-uMouse)*vec2(asp,1.0); float dl=length(d);
 float w=sin(dl*28.0-uTime*3.0)*exp(-dl*5.0)*0.025;
 uv+=normalize(d+vec2(0.0001))*w;
 uv+=vec2(fbm(uv*2.0+uTime*0.05),fbm(uv*2.0-uTime*0.04))*0.04-0.02;
 vec3 c1=poster(uv,uA1,uB1); vec3 c2=poster(uv,uA2,uB2);
 float n=fbm(uv*4.0); float t=uMix*1.2-0.1;
 vec3 col=mix(c1,c2,step(n,t));
 float active=step(0.001,uMix)*step(uMix,0.999);
 col+=vec3(0.910,0.722,0.471)*(1.0-smoothstep(0.0,0.035,abs(n-t)))*0.6*active;
 col+=0.04*sin(uv.y*3.0+uTime*0.3);
 col+=(hash(uv*uRes+fract(uTime)*37.0)-0.5)*0.03;
 gl_FragColor=vec4(col,1.0);
}
`,
  // Sepia frame that burns through, like film catching in the gate, when the year changes.
  mem: `${HEAD}uniform vec3 uA1;
uniform vec3 uA2;
uniform float uMix;
vec3 frame(vec2 uv,vec3 a){float r=length((uv-vec2(0.55,0.42))*vec2(1.2,1.0));vec3 c=mix(a,vec3(0.10,0.075,0.05),smoothstep(0.0,0.85,r));float l=dot(c,vec3(0.299,0.587,0.114));return mix(vec3(l),vec3(l*1.07,l*0.9,l*0.68),0.85);}
void main(){
 vec2 uv=v+vec2(sin(uTime*1.5)*0.001,cos(uTime*1.1)*0.001);
 vec3 c1=frame(uv,uA1); vec3 c2=frame(uv,uA2);
 float n=fbm(uv*3.5+vec2(0.0,uTime*0.02)); float t=uMix*1.25-0.12;
 vec3 col=mix(c1,c2,step(n,t));
 float e=abs(n-t); float active=step(0.001,uMix)*step(uMix,0.999);
 col=mix(col,vec3(0.05,0.03,0.02),(1.0-smoothstep(0.02,0.06,e))*active*0.8);
 col+=vec3(1.0,0.72,0.35)*(1.0-smoothstep(0.0,0.02,e))*active*1.4;
 col+=(hash(uv*uRes+fract(uTime)*53.0)-0.5)*0.05;
 col*=0.85+0.15*fbm(uv*1.5+uTime*0.03);
 gl_FragColor=vec4(col,1.0);
}
`,
  // Three drifting layers of twinkling stars.
  stars: `${HEAD}void main(){
 vec2 uv=v; float asp=uRes.x/uRes.y; vec2 p=vec2(uv.x*asp,uv.y);
 vec3 col=vec3(0.0);
 for(int i=0;i<3;i++){
  float fi=float(i); float sc=40.0+fi*35.0;
  vec2 q=p*sc+vec2(uTime*(0.02+fi*0.015),uTime*0.01*fi);
  vec2 id=floor(q); vec2 f=fract(q)-0.5;
  float h=hash(id+fi*7.0); vec2 o=vec2(hash(id+3.1),hash(id+5.7))-0.5;
  float dd=length(f-o*0.7); float tw=0.5+0.5*sin(uTime*(1.0+h*2.0)+h*6.28);
  float s=step(0.86,h)*smoothstep(0.08,0.0,dd)*tw;
  col+=mix(vec3(0.910,0.722,0.471),vec3(0.961,0.949,0.925),h)*s*(0.6-fi*0.15);
 }
 col+=vec3(0.910,0.722,0.471)*0.05*fbm(p*1.5+uTime*0.02);
 col*=smoothstep(1.2,0.2,length((uv-0.5)*vec2(asp*0.7,1.0)));
 gl_FragColor=vec4(col,1.0);
}
`,
}

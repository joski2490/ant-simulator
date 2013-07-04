(function(){this.antsimulator={}}).call(this),function(){var a;a=this.antsimulator,a.Ant=function(){function b(b,c){this.sim=b,this.pos=c!=null?c:new a.Vec,this.angle=Math.random()*Math.PI*2,this.speed=(Math.random()*.2+.8)*this.sim.layerScale*.4,this.stomach=0,this.homeRecency=0,this.age=0}return b.prototype.sniff=function(b){var c,d,e,f,g,h;return d=3*this.sim.layerScale,c=Math.PI/4,e=this.pos.get().add(a.Vec.fromAngleDist(this.angle+c,d)),f=this.pos.get().add(a.Vec.fromAngleDist(this.angle-c,d)),g=b.sample(e),h=b.sample(f),g<.01&&(g=0),h<.01&&(h=0),g-h},b.prototype.update=function(){var b,c,d,e;this.age++,this.stomach*=1-this.sim.CONFIG.FOOD_TRAIL_FALLOFF_RATE,this.homeRecency*=1-this.sim.CONFIG.NEST_FALLOFF_RATE,this.isInNest()&&(this.stomach=0,this.homeRecency=1),d=this.stomach+this.sim.layers.food.take(this.pos,1),this.stomach=d,this.isHunting()?(e=this.sniff(this.sim.layers.food),e===0&&(e=this.sniff(this.sim.layers.foodtrail))):e=this.sniff(this.sim.layers.nesttrail),this.sim.layers.foodtrail.mark(this.pos,this.stomach*.01),this.sim.layers.nesttrail.mark(this.pos,this.homeRecency*.1),e>0&&(this.angle+=parseFloat(this.sim.CONFIG.ANT_TURN_SPEED)),e<0&&(this.angle-=parseFloat(this.sim.CONFIG.ANT_TURN_SPEED)),c=Math.max(0,1-this.sim.layers.foodtrail.sample(this.pos)),this.angle+=(Math.random()-.5)*2*c*this.sim.CONFIG.JITTER_MAGNITUDE,this.pos.add(a.Vec.fromAngleDist(this.angle,this.speed)),b=this.pos.get().bound(0,0,0,this.sim.w,this.sim.h,0);if(!b.eq(this.pos))return this.angle=Math.random()*Math.PI*2,this.pos=b},b.prototype.isInNest=function(){return(new a.Vec(this.sim.w/2,this.sim.h)).sub(this.pos).mag()<10},b.prototype.isHunting=function(){return this.stomach<.1&&this.homeRecency>.01},b.prototype.draw=function(a){return a.fillStyle="#fff",a.save(),a.beginPath(),a.translate(this.pos.x,this.pos.y),a.arc(0,0,.25*this.sim.layerScale,0,Math.PI*2),a.fill(),a.restore()},b}()}.call(this),function(){var a,b;b=this.antsimulator,a={SCALE:4,NUM_ANTS:1e3,STEPS_PER_FRAME:5,ANT_TURN_SPEED:.7,SHOW_ANTS:1,JITTER_MAGNITUDE:.5,NEST_FALLOFF_RATE:.01,FOOD_TRAIL_FALLOFF_RATE:.01,NEST_TRAIL_FADE_RATE:.01,FOOD_TRAIL_FADE_RATE:.005},b.AntSim=function(){function c(){this.CONFIG=a,this.frame=0,this.layerScale=this.CONFIG.SCALE,this.createCanvas(),this.createLayers(),this.ants=[],this.update()}return c.prototype.createCanvas=function(){return this.b=document.body,this.c=document.getElementsByTagName("canvas")[0],this.a=this.c.getContext("2d"),this.w=this.c.width=this.c.clientWidth,this.h=this.c.height=this.c.clientHeight,document.body.clientWidth},c.prototype.createLayers=function(){return this.layers={},this.layers.nesttrail=new b.NestTrail(this),this.layers.foodtrail=new b.FoodTrail(this),this.layers.food=new b.Food(this),this.compositor=new b.LayerCompositor(this)},c.prototype.createAndRemoveAnts=function(){while(this.ants.length<this.CONFIG.NUM_ANTS)this.ants.push(new b.Ant(this,new b.Vec(this.w/2,this.h)));if(this.ants.length>this.CONFIG.NUM_ANTS)return this.ants=this.ants.slice(0,this.CONFIG.NUM_ANTS)},c.prototype.drawLayers=function(){return this.a.putImageData(this.compositor.getImageData(this.layers),0,0),this.a.drawImage(this.c,0,0,this.layerScale*this.w,this.layerScale*this.h)},c.prototype.update=function(){var a,b,c,d,e,f,g,h,i,j;this.createAndRemoveAnts();for(b=e=0,h=this.CONFIG.STEPS_PER_FRAME;0<=h?e<h:e>h;b=0<=h?++e:--e){i=this.layers;for(c in i)d=i[c],d.update();j=this.ants;for(f=0,g=j.length;f<g;f++)a=j[f],a.update()}return this.draw(),this.frame++},c.prototype.draw=function(){var a,b,c,d,e,f=this;this.a.clearRect(0,0,this.w,this.h),this.drawLayers(),e=this.ants;for(b=0,c=e.length;b<c;b++)a=e[b],parseInt(this.CONFIG.SHOW_ANTS)&&a.draw(this.a);return d=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||window.oRequestAnimationFrame,d(function(){return f.update()})},c}()}.call(this),function(){var a,b,c,d,e={}.hasOwnProperty,f=function(a,b){function d(){this.constructor=a}for(var c in b)e.call(b,c)&&(a[c]=b[c]);return d.prototype=b.prototype,a.prototype=new d,a.__super__=b.prototype,a};a=this.antsimulator,a.Layer=function(){function a(a){var b,c,d;this.sim=a,this.w=~~(this.sim.w/this.sim.layerScale),this.h=~~(this.sim.h/this.sim.layerScale),this.buffer=[];for(b=c=0,d=this.w*this.h;0<=d?c<d:c>d;b=0<=d?++c:--c)this.buffer.push(this.initCell(b%this.w,Math.floor(b/this.h)))}return a.prototype.initCell=function(a,b){return 0},a.prototype.update=function(){},a.prototype.mul=function(a){var b,c,d,e,f,g;f=this.buffer,g=[];for(b=d=0,e=f.length;d<e;b=++d)c=f[b],g.push(this.buffer[b]=c*a);return g},a.prototype.add=function(a){var b,c,d,e,f,g;f=this.buffer,g=[];for(b=d=0,e=f.length;d<e;b=++d)c=f[b],g.push(this.buffer[b]=c-a);return g},a.prototype.blur=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r;c=[],l=this.buffer;for(b=h=0,k=l.length;h<k;b=++h){e=l[b],f=b%this.w,g=(b-f)/this.h,d=0;for(q=i=m=Math.max(0,f-1),n=Math.min(this.w-1,f+1);m<=n?i<=n:i>=n;q=m<=n?++i:--i)for(r=j=o=Math.max(0,g-1),p=Math.min(this.h-1,g+1);o<=p?j<=p:j>=p;r=o<=p?++j:--j)d+=this.buffer[q+r*this.w]*a;d+=e*(1-a),c[b]=d/(9*a+(1-a))||0}return this.buffer=c},a.prototype.mark=function(a,b){var c;c=this.posToIndex(a);if(this.buffer[c]!=null)return this.buffer[c]+=b},a.prototype.sample=function(a){var b;return b=this.posToIndex(a),this.buffer[b]||0},a.prototype.take=function(a,b){var c,d;return c=this.posToIndex(a),this.buffer[c]!=null?(d=Math.min(this.buffer[c],b),this.buffer[c]-=d,d):0},a.prototype.posToIndex=function(a){return a=a.get().mul(1/this.sim.layerScale),Math.floor(a.x)+Math.floor(a.y)*this.w},a}(),a.NestTrail=function(a){function c(){return b=c.__super__.constructor.apply(this,arguments),b}return f(c,a),c.prototype.update=function(){return this.mul(1-this.sim.CONFIG.NEST_TRAIL_FADE_RATE),this.buffer[this.w/2+this.h/2*this.w]=1e3},c}(a.Layer),a.FoodTrail=function(a){function b(){return c=b.__super__.constructor.apply(this,arguments),c}return f(b,a),b.prototype.update=function(){return this.mul(1-this.sim.CONFIG.FOOD_TRAIL_FADE_RATE)},b}(a.Layer),a.Food=function(b){function c(){return d=c.__super__.constructor.apply(this,arguments),d}return f(c,b),c.prototype.initCell=function(a,b){return Math.random()<2e-4?100:0},c.prototype.update=function(){this.sim.frame%10===0&&this.blur(.002);if(Math.random()<.01)return this.mark(new a.Vec(Math.random()*this.w*this.sim.layerScale,Math.random()*this.h*this.sim.layerScale),100)},c}(a.Layer),a.LayerCompositor=function(){function a(a){this.sim=a,this.w=~~(this.sim.w/this.sim.layerScale),this.h=~~(this.sim.h/this.sim.layerScale),this.imageData=document.createElement("CANVAS").getContext("2d").createImageData(this.w,this.h)}return a.prototype.getImageData=function(a){var b,c,d,e,f,g,h,i;c=this.imageData.data;for(e=h=0,i=this.w*this.h;0<=i?h<i:h>i;e=0<=i?++h:--h)f=e*4,g=.13,d=.11,b=.1,g+=.5*a.nesttrail.buffer[e],d+=.1*a.nesttrail.buffer[e],g+=.65*a.food.buffer[e],d+=1*a.food.buffer[e],b+=2.5*a.foodtrail.buffer[e],d+=1.7*a.foodtrail.buffer[e],c[f+0]=255*g,c[f+1]=255*d,c[f+2]=255*b,c[f+3]=255;return this.imageData},a}()}.call(this),function(){var a;a=this.antsimulator,a.Vec=function(){function b(a,b,c){this.x=a!=null?a:0,this.y=b!=null?b:0,this.z=c!=null?c:0}return b.prototype.set=function(a,b,c){return this.x=a!=null?a:0,this.y=b!=null?b:0,this.z=c!=null?c:0,this},b.prototype.get=function(){return new a.Vec(this.x,this.y,this.z)},b.prototype.add=function(a){return this.x+=a.x,this.y+=a.y,this.z+=a.z,this},b.prototype.sub=function(a){return this.x-=a.x,this.y-=a.y,this.z-=a.z,this},b.prototype.mul=function(a){return this.x*=a,this.y*=a,this.z*=a,this},b.prototype.div=function(a){return this.x/=a,this.y/=a,this.z/=a,this},b.prototype.mag=function(a){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)},b.prototype.normalize=function(){var a;return a=this.mag(),this.x/=a,this.y/=a,this.z/=a,this},b.prototype.bound=function(a,b,c,d,e,f){return this.x=Math.min(d,Math.max(a,this.x)),this.y=Math.min(e,Math.max(b,this.y)),this.z=Math.min(f,Math.max(c,this.z)),this},b.prototype.eq=function(a){return a.x===this.x&&a.y===this.y&&a.z===this.z},b}(),a.Vec.fromAngleDist=function(b,c){return new a.Vec(c*Math.cos(b),c*Math.sin(b))}}.call(this),function(){}.call(this)
!function(e){function t(r){if(o[r])return o[r].exports;var n=o[r]={exports:{},id:r,loaded:!1};return e[r].call(n.exports,n,n.exports,t),n.loaded=!0,n.exports}var o={};return t.m=e,t.c=o,t.p="",t(0)}([function(e,t,o){o(26),o(29),o(28),o(27),o(25),o(30),o(33),o(31),o(32),o(37),o(36),o(35),o(34),o(38),o(40),o(39),o(43),o(41),o(42)},,,,,,,,,,,,,,,,,,,,,,,,,function(){"use strict";angular.module("qibud.common").factory("api",["$rootScope","$http","$window",function(e,t,o){function r(){var e=$.Callbacks();return{subscribe:function(t,o){o?t.$on("$destroy",function(){e.remove(o)}):o=t,e.add(o)},unsubscribe:e.remove,publish:e.fire}}function n(e,t){return e[t]}var u="api",s=o.sessionStorage.token||o.localStorage.token,d={Authorization:"Bearer "+s},i=(o.document.location.origin||o.location.protocol+"//"+o.location.host).replace(/^http/,"ws"),a={events:{}},c=a.ws=new WebSocket(i+"?access_token="+s);return o.setInterval(function(){c.send("ping")},25e3),a.connected=r(),c.onopen=function(){a.connected.publish.apply(this,arguments),e.$apply()},a.disconnected=r(),c.onclose=function(){a.disconnected.publish.apply(this,arguments),e.$apply()},a.buds={search:function(e){return t({method:"GET",url:u+"/buds/search/"+e,headers:d})},childrenByType:function(e,o){return t({method:"GET",url:u+"/buds/"+e+"/child/"+o,headers:d})},list:function(){return t({method:"GET",url:u+"/buds",headers:d})},view:function(e){return t({method:"GET",url:u+"/buds/"+e+"/view",headers:d})},update:function(e){return t({method:"PUT",url:u+"/buds/"+e.id+"/update",data:e,headers:d})},updated:r(),"delete":function(e){return t({method:"DELETE",url:u+"/buds/"+e,headers:d})},create:function(e){return t({method:"POST",url:u+"/buds",data:e,headers:d})},createSub:function(e,o){return t({method:"POST",url:u+"/buds/"+e,data:o,headers:d})},created:r(),evolve:function(e,o){return t({method:"PUT",url:u+"/buds/"+e+"/evolve/"+o,headers:d})},evolved:r(),follow:function(e){return t({method:"PUT",url:u+"/buds/"+e.id+"/follow",data:e,headers:d})},unfollow:function(e){return t({method:"PUT",url:u+"/buds/"+e.id+"/unfollow",data:e,headers:d})},followersChanged:r(),sponsor:function(e){return t({method:"PUT",url:u+"/buds/"+e.id+"/sponsor",data:e,headers:d})},unsponsor:function(e){return t({method:"PUT",url:u+"/buds/"+e.id+"/unsponsor",data:e,headers:d})},sponsorsChanged:r(),support:function(e,o){return t({method:"PUT",url:u+"/buds/"+e.id+"/support/"+o,data:e,headers:d})},unsupport:function(e){return t({method:"PUT",url:u+"/buds/"+e.id+"/unsupport",data:e,headers:d})},supportersChanged:r(),share:function(e,o){return t({method:"PUT",url:u+"/buds/"+e.id+"/share",data:o,headers:d})},budPacksData:{create:function(e,o,r){return t({method:"POST",url:u+"/buds/"+e+"/packdata/"+r,data:o,headers:d})},get:function(e,o){return t({method:"GET",url:u+"/buds/"+e+"/packdata/"+o,headers:d})},set:function(e,o,r){return t({method:"PUT",url:u+"/buds/"+e+"/packdata/"+r,data:o,headers:d})},created:r(),updated:r()},comments:{create:function(e,o){return t({method:"POST",url:u+"/buds/"+e+"/comments",data:o,headers:d})},created:r()}},a.qi={updated:r()},a.mailboxes={get:function(){return t({method:"GET",url:u+"/user/mailboxes/emails",headers:d})},incoming:r()},a.links={createB2B:function(e,o,r){return t({method:"POST",url:u+"/links/b2b/"+e+"/"+o+"/"+r,headers:d})},createB2U:function(e,o,r){return t({method:"POST",url:u+"/links/b2u/"+e+"/"+o+"/"+r,headers:d})},createU2B:function(e,o,r){return t({method:"POST",url:u+"/links/u2b/"+e+"/"+o+"/"+r,headers:d})},deleteU2B:function(e,o,r){return t({method:"DELETE",url:u+"/links/u2b/"+e+"/"+o+"/"+r,headers:d})},findU2B:function(e,o){return t({method:"GET",url:u+"/links/u2b/"+e+"/"+o,headers:d})}},a.users={list:function(){return t({method:"GET",url:u+"/users",headers:d})}},a.actors={list:function(){return t({method:"GET",url:u+"/actors",headers:d})}},a.events={list:function(){return t({method:"GET",url:u+"/events",headers:d})}},a.types={get:function(e){return t({method:"GET",url:u+"/types/"+e,headers:d})},list:function(){return t({method:"GET",url:u+"/types",headers:d})}},a.debug={clearDatabase:function(){return t({method:"POST",url:u+"/debug/clearDatabase",headers:d})}},c.onmessage=function(t){var o=JSON.parse(t.data);if(!o.method)throw"Malformed event data received through WebSocket. Received event data object was: "+o;if(!o.method.split(".").reduce(n,a))throw"Undefined event type received through WebSocket. Received event data object was: "+o;o.method.split(".").reduce(n,a).publish(o.params),e.$apply()},a}])},function(){"use strict";angular.module("qibud.common",["ui.bootstrap"])},function(){angular.module("qibud.common").controller("MailConverterCtrl",["$scope","$modalInstance","email",function(e,t,o){e.email=o,e.ok=function(){t.close(e.selectedUsers)},e.cancel=function(){t.dismiss("cancel")}}])},function(){angular.module("qibud.common").controller("MailboxCtrl",["$scope","$modal","api",function(e,t,o){e.emails={},o.mailboxes.get().success(function(t){e.emails=t}),e.openEmail=function(e){var o=t.open({templateUrl:"mail.html",controller:"MailConverterCtrl",size:"lg",resolve:{email:function(){return e}}});o.result.then(function(){},function(){})}}])},function(){angular.module("qibud.common").controller("SearchCtrl",["$scope","api",function(e,t){e.results={},e.search=function(o){o&&t.buds.search(o).success(function(t){t.hits&&(e.results=t.hits.total>0?t.hits.hits.map(function(e){return e}):{})})}}])},function(){function e(e,t){var o=992;e.getWidth=function(){return window.innerWidth},e.$watch(e.getWidth,function(r){e.toggle=r>=o?angular.isDefined(t.get("toggle"))&&0==t.get("toggle")?!1:!0:!1}),e.toggleSidebar=function(){e.toggle=!e.toggle,t.put("toggle",e.toggle)},window.onresize=function(){e.$apply()}}angular.module("qibud.dashboard",[]).controller("DashboardCtrl",["$scope","$cookieStore",e])},function(){"use strict";angular.module("qibud.editor").controller("EditorCtrl",["$scope","$state","$stateParams","$modal","$location","api",function(e,t,o,r,n,u){e.common.user;o.budId?u.buds.view(o.budId).success(function(t){e.editedBud=t,e.budBox={title:t.title,content:t.content,privacy:t.privacy,type:t.type,disabled:!1,action:"update"},e.setType(t.type)}):e.budBox={title:null,content:null,type:"Bud",disabled:!1,privacy:"Private",action:"create"},o.parentBudId&&(u.buds.view(o.parentBudId).success(function(t){e.parentBud=t}),e.budBox.action="subbud"),o.content&&(e.budBox.content=o.content),e.editorOptions={uiColor:"#000000"},e.setType=function(e){t.go("Bud"===e?"bud.editor":"bud.editor."+e)},e.createBud=function(o){if(!e.budBox.content.length||e.budBox.disabled)return void o.preventDefault();var n=r.open({templateUrl:"evolvebox.html",controller:"EvolveCtrl",size:"lg",resolve:{availableTypes:function(){return e.common.availableTypes}}}),s=function(o){e.budBox.disabled=!0,u.buds.createSub(e.parentBud.id,{title:e.budBox.title,content:e.budBox.content,privacy:e.budBox.privacy,type:e.budBox.type}).success(function(r){e.budBox.title="",e.budBox.content="",e.budBox.disabled=!1,console.info("subbud created"),null!==o?u.buds.evolve(r,o).success(function(){console.info("bud evolve in "+o),t.go("bud.viewer."+o,{budId:r},{reload:!0})}):t.go("bud.viewer",{budId:r},{reload:!0})}).error(function(){e.budBox.disabled=!1})},d=function(o){e.budBox.disabled=!0,u.buds.create({title:e.budBox.title,content:e.budBox.content,privacy:e.budBox.privacy,type:e.budBox.type}).success(function(r){e.budBox.title="",e.budBox.content="",e.budBox.disabled=!1,console.info("bud created"),null!==o?u.buds.evolve(r,o).success(function(){console.info("bud evolve in "+o),t.go("bud.viewer."+o,{budId:r},{reload:!0})}):t.go("bud.viewer",{budId:r},{reload:!0})}).error(function(){e.budBox.disabled=!1})};n.result.then(function(t){e.parentBud.id?s(t):d(t)},function(){e.parentBud.id?s(null):d(null)})},e.updateBud=function(o){return!e.budBox.content.length||e.budBox.disabled?void o.preventDefault():(e.budBox.disabled=!0,e.editedBud.title=e.budBox.title,e.editedBud.content=e.budBox.content,e.editedBud.privacy=e.budBox.privacy,e.editedBud.type="Bud"===e.budBox.type?"":e.budBox.type,void u.buds.update(e.editedBud).success(function(){t.go("bud.viewer",{budId:e.editedBud.id},{reload:!0})}).error(function(){e.budBox.disabled=!1}))},u.buds.created.subscribe(e,function(){})}])},function(){"use strict";angular.module("qibud.editor").controller("EvolveCtrl",["$scope","$modalInstance","availableTypes",function(e,t,o){e.availableTypes=o,e.selectedType="Bud",e.setSelected=function(t){e.selectedType=t},e.ok=function(){t.close(e.selectedType)},e.cancel=function(){t.dismiss("cancel")}}])},function(){"use strict";angular.module("qibud.editor",["ui.router","qibud.common"]).config(["$stateProvider","$urlRouterProvider",function(e){e.state("bud.editor",{title:"Qibud Editor",url:"/editor/:budId/:parentBudId/:content",breadcrumb:{"class":"highlight",text:"Bud Editor",stateName:"bud.editor"},templateUrl:"modules/editor/editor.html",controller:"EditorCtrl"})}])},function(){"use strict";angular.module("qibud.home").controller("BudgraphCtrl",["$scope","$state","api","budGraph",function(e,t,o,r){var n,u=(e.common.user,{});o.buds.list().success(function(t){e.buds=t;for(var o=0;o<e.buds.length;o++){var s=e.buds[o];u[s.id]=s}r(e.buds).then(function(t){n=t,e.cyLoaded=!0})}),r.onClick(function(e){t.go("bud.viewer",{budId:e})}),o.buds.created.subscribe(e,function(t){_.some(e.buds,function(e){return e.id===t.id})||(t.comments=[],t.commentBox={message:"",disabled:!1},e.buds.unshift(t))})}])},function(){"use strict";angular.module("qibud.home").factory("budGraph",["$q",function(e){function t(e,t){for(var o=n.listeners[e],r=0;o&&r<o.length;r++){var u=o[r];u.apply(u,t)}}function o(e,t){var o=n.listeners[e]=n.listeners[e]||[];o.push(t)}var r,n=function(o){for(var n=e.defer(),u=[],s=0;s<o.length;s++){var d,i=o[s];d=i.dataCache.state?"["+i.type+"] "+i.dataCache.state:i.title,u.push({group:"nodes",data:{id:i.id,type:i.typeInfo,weight:i.qi,size:200,label:{content:i.type},name:d,faveColor:"#30426a",faveShape:"roundrectangle"}})}for(var s=0;s<o.length;s++)if(o[s].subBuds)for(var a=0;a<o[s].subBuds.length;a++)u.push({group:"edges",data:{source:o[s].id,target:o[s].subBuds[a].id,faveColor:"#30426a",strength:1}});return $(function(){r=cytoscape({container:$("#cy")[0],style:cytoscape.stylesheet().selector("node").css({shape:"data(faveShape)",width:"data(size)",height:100,content:"data(name)","text-valign":"center","text-outline-width":2,"background-color":"data(faveColor)",color:"#fff","box-shadow":"0 10px 18px rgba(0,0,0,.22),0 14px 45px rgba(0,0,0,.25)"}).selector(":selected").css({"border-width":3,"border-color":"#333"}).selector("edge").css({opacity:.666,width:"mapData(strength, 35, 50, 2, 6)","target-arrow-shape":"triangle","source-arrow-shape":"circle","line-color":"data(faveColor)","source-arrow-color":"data(faveColor)","target-arrow-color":"data(faveColor)"}).selector(".faded").css({opacity:.25,"text-opacity":0}),layout:{name:"breadthfirst",directed:!0,padding:5},elements:u,ready:function(){n.resolve(this),r.on("cxtdrag","node",function(){}),r.on("tap","node",function(){var e=this;t("onClick",[e.id()])})}})}),n.promise};return n.listeners={},n.onClick=function(e){o("onClick",e)},n}])},function(){"use strict";angular.module("qibud.home").controller("HomeCtrl",["$scope","$state","api","budGraph",function(e,t,o){var r=e.common.user;o.buds.list().success(function(t){e.buds=t,o.links.findU2B(r.id,"ACTOR").success(function(t){t.forEach(function(t){_.remove(e.buds,function(e){return e.id===t._id})}),e.budsActingOn=t})}),o.buds.created.subscribe(e,function(t){_.some(e.buds,function(e){return e.id===t.id})||e.buds.unshift(t)})}])},function(){"use strict";angular.module("qibud.home",["ui.router","qibud.common"]).config(["$stateProvider","$urlRouterProvider",function(e){e.state("home.stickers",{title:"Dashboard",breadcrumb:{"class":"highlight",text:"Bud stickers",stateName:"bud.home.stickers"},url:"/stickers",templateUrl:"modules/home/home-stickers.html",controller:"HomeCtrl"}).state("home.budgraph",{title:"Bud Graph",breadcrumb:{"class":"highlight",text:"Bud Graph",stateName:"bud.home.budgraph"},url:"/graph",templateUrl:"modules/home/home-budgraph.html",controller:"BudgraphCtrl"}).state("home.timeline",{title:"Bud Timeline",breadcrumb:{"class":"highlight",text:"Bud Timeline",stateName:"bud.home.timeline"},url:"/timeline",templateUrl:"modules/home/home-timeline.html",controller:"TimelineCtrl"})}])},function(){"use strict";angular.module("qibud.home").controller("TimelineCtrl",["$scope","$state","api","budGraph",function(e,t,o){e.common.user;o.events.list().success(function(t){e.events=t})}])},function(){"use strict";angular.module("qibud.profile").controller("ProfileCtrl",["$scope",function(e){e.user=e.common.user}])},function(){"use strict";angular.module("qibud.profile",["ui.router","qibud.common"]).config(["$stateProvider","$urlRouterProvider",function(e){e.state("bud.profile",{url:"/profile",title:"User Profile",breadcrumb:{"class":"highlight",text:"User Profile",stateName:"bud.profile"},templateUrl:"modules/profile/profile.html",controller:"ProfileCtrl"})}])},function(){"use strict";angular.module("qibud.viewer").controller("ViewerCtrl",["$scope","$state","$stateParams","$modal","api",function(e,t,o,r,n){var u=e.common.user;e.typeInfo=null,e.ready=!1,e.actionInProgress=!1,e.followersCount=0,e.sponsorsCount=0,e.supportersCount=0,e.supportValue=0,e.shareCount=0,e.load=function(t){console.info("loading..."),e.ready=!1,n.buds.view(o.budId).success(function(o){o.commentBox={message:"",disabled:!1},o.comments=o.comments||[],e.bud=o,o.followers?(e.followersCount=o.followers.length,e.follower=-1!==o.followers.indexOf(u.id)?!0:!1):e.follower=!1,o.sponsors?(e.sponsorsCount=o.sponsors.length,e.sponsorer=-1!==o.sponsors.indexOf(u.id)?!0:!1):e.sponsorer=!1,o.supporters?(e.supportersCount=o.supporters.length,e.supporter=-1!==o.supporters.indexOf(u.id)?!0:!1):e.supporter=!1,o.shares&&(e.shareCount=o.shares.length),e.ready=!0,e.showType(e.bud.type,!1),console.info("loaded!"),t&&t()})},e.load(),e.showType=function(e,o){"Bud"!==e?t.go("bud.viewer."+e,t.params,{reload:o}):t.go("bud.viewer",t.params,{reload:o})},e.evolve=function(t,o){return e.actionInProgress?void t.preventDefault():(e.actionInProgress=!0,void n.buds.evolve(e.bud,o).success(function(){e.actionInProgress=!1}).error(function(){e.actionInProgress=!1}))},e.canEvolve=function(){return e.bud&&"Bud"===e.bud.type&&e.bud.creator.id===u.id?!0:!1},e.editSubBud=function(){t.go("bud.editor",{parentBud:e.bud})},e.budify=function(o){t.go("bud.editor",{parentBud:e.bud,content:o})},e["delete"]=function(){n.buds["delete"](e.bud.id).success(function(){t.go("home.stickers")})},e.canDelete=function(){if(!e.bud)return!1;var t=e.bud.creator.id==e.common.user.id,o=!e.bud.subBuds||0==e.bud.subBuds.length;return t&&o},e.share=function(){n.actors.list().success(function(t){var o=r.open({templateUrl:"sharebox.html",controller:"ShareboxCtrl",size:"lg",resolve:{users:function(){return t.users},teams:function(){return t.teams}}});o.result.then(function(t){n.buds.share(e.bud,t).success(function(){})},function(){})})},e.canShare=function(){var t=!1;if(!e.bud)return t;var o=e.bud.creator.id;switch(e.bud.privacy){case"Private":o===u.id&&(t=!0);break;case"Private2Share":o===u.id&&(t=!0);break;case"Free2Share":t=!0}return t},e.followBud=function(t){return e.actionInProgress?void t.preventDefault():(e.actionInProgress=!0,void(e.follower?n.buds.unfollow(e.bud).success(function(){e.actionInProgress=!1}).error(function(){e.actionInProgress=!1}):n.buds.follow(e.bud).success(function(){e.actionInProgress=!1}).error(function(){e.actionInProgress=!1})))},e.supportBud=function(t){return e.actionInProgress?void t.preventDefault():(e.actionInProgress=!0,void(e.supporter?n.buds.unsupport(e.bud).success(function(){e.actionInProgress=!1}).error(function(){e.actionInProgress=!1}):n.buds.support(e.bud,e.supportValue).success(function(){e.actionInProgress=!1}).error(function(){e.actionInProgress=!1})))},e.sponsorBud=function(t){return e.actionInProgress?void t.preventDefault():(e.actionInProgress=!0,void(e.sponsorer?n.buds.unsponsor(e.bud).success(function(){e.actionInProgress=!1}).error(function(){e.actionInProgress=!1}):n.buds.sponsor(e.bud).success(function(){e.actionInProgress=!1}).error(function(){e.actionInProgress=!1})))},n.buds.followersChanged.subscribe(e,function(t){e.bud.id===t.id&&(e.bud.followers=t.followers,e.followersCount=t.followers.length,e.follower=-1!==t.followers.indexOf(u.id)?!0:!1)}),n.buds.supportersChanged.subscribe(e,function(t){e.bud.id===t.id&&(e.bud.supporters=t.supporters,e.supportersCount=t.supporters.length,e.supporter=-1!==t.supporters.indexOf(u.id)?!0:!1)}),n.buds.sponsorsChanged.subscribe(e,function(t){e.bud.id===t.id&&(e.bud.sponsors=t.sponsors,e.sponsorsCount=t.sponsors.length,e.sponsorer=-1!==t.sponsors.indexOf(u.id)?!0:!1)}),e.createComment=function(e,t){if(13===e.keyCode){if(!t.commentBox.message.length||t.commentBox.disabled)return void e.preventDefault();t.commentBox.disabled=!0,n.buds.comments.create(t.id,{message:t.commentBox.message}).success(function(e){_.some(t.comments,function(t){return t.id===e})||t.comments.push({id:e,from:u,message:t.commentBox.message,createdTime:new Date}),t.commentBox.message="",t.commentBox.disabled=!1}).error(function(){t.commentBox.disabled=!1}),e.preventDefault()}},n.buds.comments.created.subscribe(e,function(t){e.bud&&!_.some(e.bud.comments,function(e){return e.id===t.id})&&e.bud.comments.push(t)}),n.buds.updated.subscribe(e,function(t){e.bud.id===t.id&&(e.bud=t,t.shares&&(e.shareCount=t.shares.length))}),n.buds.evolved.subscribe(e,function(t){e.bud.id===t.id&&e.load()}),n.qi.updated.subscribe(e,function(t){e.bud.id===t.id&&(e.bud.qi=t.qi)})}])},function(){"use strict";angular.module("qibud.viewer").controller("ShareboxCtrl",["$scope","$modalInstance","users","teams",function(e,t,o,r){e.users=o,e.teams=r,e.selectedUsers=[],e.addUser=function(t){e.selectedUsers.push(t),_.remove(e.users,function(e){return e.id===t.id})},e.addTeam=function(t){angular.forEach(t.members,function(t){e.selectedUsers.push(t),_.remove(e.users,function(e){return e.id===t.id})})},e.rmUser=function(t){e.users.push(t),_.remove(e.selectedUsers,function(e){return e.id===t.id})},e.ok=function(){t.close(e.selectedUsers)},e.cancel=function(){t.dismiss("cancel")}}])},function(){"use strict";angular.module("qibud.viewer",["ui.router","ui.bootstrap","qibud.common"]).config(["$stateProvider","$urlRouterProvider",function(e){var t=[],o={};o["@"]={controller:"ViewerCtrl",templateUrl:"modules/viewer/viewer.html"},t.push({name:"bud.viewer",sticky:!0,url:"/viewer/:budId",views:o,breadcrumb:{"class":"highlight",text:"Bud Viewer",stateName:"bud.viewer"}}),angular.forEach(t,function(t){e.state(t)})}])}]);
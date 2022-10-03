
  ;(function(){
  let u=void 0,isReady=false,onReadyCallbacks=[],isServiceReady=false,onServiceReadyCallbacks=[];
  const __uniConfig = {"pages":[],"globalStyle":{"backgroundColor":"#F8F8F8","navigationBar":{"backgroundColor":"#F8F8F8","titleText":"uni-app","titleColor":"#000000"},"isNVue":false},"nvue":{"compiler":"uni-app","styleCompiler":"uni-app","flex-direction":"column"},"renderer":"auto","appname":"lingshi-user","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":true},"compilerVersion":"3.5.3","entryPagePath":"pages/index/index","entryPageQuery":"","realEntryPagePath":"","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000},"tabBar":{"position":"bottom","color":"#7A7E83","selectedColor":"#3cc51f","borderStyle":"black","blurEffect":"none","fontSize":"10px","iconWidth":"24px","spacing":"3px","height":"50px","backgroundColor":"#ffffff","list":[{"pagePath":"pages/index/index","iconPath":"/static/tab-list/shouye-001.png","selectedIconPath":"/static/tab-list/shouye-002.png","text":"首页"},{"pagePath":"pages/sort-view/sort-view","iconPath":"/static/tab-list/fenlei-001.png","selectedIconPath":"/static/tab-list/fenlei-002.png","text":"分类"},{"pagePath":"pages/shopping-cart/shopping-cart","iconPath":"/static/tab-list/gouwuche-001.png","selectedIconPath":"/static/tab-list/gouwuche-002.png","text":"购物车"},{"pagePath":"pages/my-page/my-page","iconPath":"/static/tab-list/wode-001.png","selectedIconPath":"/static/tab-list/wode-002.png","text":"我的"}],"selectedIndex":0,"shown":true},"locales":{}};
  const __uniRoutes = [{"path":"pages/index/index","meta":{"isQuit":true,"isEntry":true,"isTabBar":true,"tabBarIndex":0,"navigationBar":{"style":"custom"},"isNVue":false}},{"path":"pages/sort-view/sort-view","meta":{"isQuit":true,"isTabBar":true,"tabBarIndex":1,"navigationBar":{"titleText":"分类"},"isNVue":false}},{"path":"pages/shopping-cart/shopping-cart","meta":{"isQuit":true,"isTabBar":true,"tabBarIndex":2,"navigationBar":{"titleText":"购物车"},"isNVue":false}},{"path":"pages/my-page/my-page","meta":{"isQuit":true,"isTabBar":true,"tabBarIndex":3,"navigationBar":{"titleText":"我的","style":"custom"},"isNVue":false}},{"path":"pages/search-view/search","meta":{"navigationBar":{"backgroundColor":"#fefefe","titleText":""},"isNVue":false}},{"path":"pages/short-video/video","meta":{"navigationBar":{"style":"custom"},"isNVue":false}},{"path":"pages/product-details/detail","meta":{"navigationBar":{"style":"custom"},"isNVue":false}},{"path":"pages/pay-view/pay","meta":{"navigationBar":{"backgroundColor":"#fefefe","titleText":"确认订单"},"isNVue":false}},{"path":"pages/re-address/address","meta":{"navigationBar":{"backgroundColor":"#fefefe","titleText":"收货地址"},"isNVue":false}},{"path":"pages/all-orders/order","meta":{"navigationBar":{"backgroundColor":"#fefefe","titleText":"订单管理"},"isNVue":false}},{"path":"pages/eav-goods/eavgoods","meta":{"navigationBar":{"backgroundColor":"#fefefe","titleText":"商品评价"},"isNVue":false}},{"path":"pages/order-tracking/track","meta":{"navigationBar":{"backgroundColor":"#fefefe","titleText":"订单追踪"},"isNVue":false}},{"path":"pages/eva-details/details","meta":{"navigationBar":{"backgroundColor":"#fefefe","titleText":"评价"},"isNVue":false}},{"path":"pages/my-collection/collection","meta":{"navigationBar":{"titleText":"我的收藏"},"isNVue":false}}].map(uniRoute=>(uniRoute.meta.route=uniRoute.path,__uniConfig.pages.push(uniRoute.path),uniRoute.path='/'+uniRoute.path,uniRoute));
  __uniConfig.styles=[];//styles
  __uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
  __uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
  service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:16})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:u,window:u,document:u,frames:u,self:u,location:u,navigator:u,localStorage:u,history:u,Caches:u,screen:u,alert:u,confirm:u,prompt:u,fetch:u,XMLHttpRequest:u,WebSocket:u,webkit:u,print:u}}}}); 
  })();
  
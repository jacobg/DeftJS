/*
DeftJS 0.6.6

Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/
Ext.define("Deft.log.Logger",{alternateClassName:["Deft.Logger"],singleton:!0,log:function(){},error:function(a){this.log(a,"error")},info:function(a){this.log(a,"info")},verbose:function(a){this.log(a,"verbose")},warn:function(a){this.log(a,"warn")},deprecate:function(a){this.log(a,"deprecate")}},function(){var a;Ext.isFunction(null!=(a=Ext.Logger)?a.log:void 0)?this.log=Ext.bind(Ext.Logger.log,Ext.Logger):Ext.isFunction(Ext.log)&&(this.log=function(a,b){null==b&&(b="info");"deprecate"===b&&(b="warn");
Ext.log({msg:a,level:b})})});Ext.define("Deft.util.Function",{alternateClassName:["Deft.Function"],statics:{spread:function(a,c){return function(b){Ext.isArray(b)||Ext.Error.raise({msg:"Error spreading passed Array over target function arguments: passed a non-Array."});return a.apply(c,b)}},memoize:function(a,c,b){var d;d={};return function(e){var f;f=Ext.isFunction(b)?b.apply(c,arguments):e;f in d||(d[f]=a.apply(c,arguments));return d[f]}}}});
Ext.define("Deft.ioc.DependencyProvider",{requires:["Deft.log.Logger"],config:{identifier:null,className:null,parameters:null,fn:null,value:null,singleton:!0,eager:!1},constructor:function(a){this.initConfig(a);null!=a.value&&a.value.constructor===Object&&this.setValue(a.value);this.getEager()&&(null!=this.getValue()&&Ext.Error.raise({msg:"Error while configuring '"+this.getIdentifier()+"': a 'value' cannot be created eagerly."}),this.getSingleton()||Ext.Error.raise({msg:"Error while configuring '"+
this.getIdentifier()+"': only singletons can be created eagerly."}));this.getSingleton()?null!=this.getClassName()&&null!=this.getParameters()&&Ext.ClassManager.get(this.getClassName()).singleton&&Ext.Error.raise({msg:"Error while configuring rule for '"+this.getIdentifier()+"': parameters cannot be applied to singleton classes. Consider removing 'singleton: true' from the class definition."}):(null!=this.getClassName()&&Ext.ClassManager.get(this.getClassName()).singleton&&Ext.Error.raise({msg:"Error while configuring rule for '"+
this.getIdentifier()+"': singleton classes cannot be configured for injection as a prototype. Consider removing 'singleton: true' from the class definition."}),null!=this.getValue()&&Ext.Error.raise({msg:"Error while configuring '"+this.getIdentifier()+"': a 'value' can only be configured as a singleton."}));return this},resolve:function(a){var c;Deft.Logger.log("Resolving '"+this.getIdentifier()+"'.");if(null!=this.getValue())return this.getValue();c=null;null!=this.getFn()?(Deft.Logger.log("Executing factory function."),
c=this.getFn().call(null,a)):null!=this.getClassName()?(a=Ext.ClassManager.get(this.getClassName()),a.singleton?(Deft.Logger.log("Using existing singleton instance of '"+this.getClassName()+"'."),c=a):(Deft.Logger.log("Creating instance of '"+this.getClassName()+"'."),a=null!=this.getParameters()?[this.getClassName()].concat(this.getParameters()):[this.getClassName()],c=Ext.create.apply(this,a))):Ext.Error.raise({msg:"Error while configuring rule for '"+this.getIdentifier()+"': no 'value', 'fn', or 'className' was specified."});
this.getSingleton()&&this.setValue(c);return c}});
Ext.define("Deft.ioc.Injector",{alternateClassName:["Deft.Injector"],requires:["Deft.log.Logger","Deft.ioc.DependencyProvider"],singleton:!0,constructor:function(){this.providers={};return this},configure:function(a){Deft.Logger.log("Configuring injector.");Ext.Object.each(a,function(a,b){var d;Deft.Logger.log("Configuring dependency provider for '"+a+"'.");d=Ext.isString(b)?Ext.create("Deft.ioc.DependencyProvider",{identifier:a,className:b}):Ext.create("Deft.ioc.DependencyProvider",Ext.apply({identifier:a},
b));this.providers[a]=d},this);Ext.Object.each(this.providers,function(a,b){b.getEager()&&(Deft.Logger.log("Eagerly creating '"+b.getIdentifier()+"'."),b.resolve())},this)},canResolve:function(a){return null!=this.providers[a]},resolve:function(a,c){var b;b=this.providers[a];if(null!=b)return b.resolve(c);Ext.Error.raise({msg:"Error while resolving value to inject: no dependency provider found for '"+a+"'."})},inject:function(a,c,b){var d,e,f,g;null==b&&(b=!0);d={};Ext.isString(a)&&(a=[a]);Ext.Object.each(a,
function(b,e){var f,g;g=Ext.isArray(a)?e:b;f=this.resolve(e,c);g in c.config?(Deft.Logger.log("Injecting '"+e+"' into '"+g+"' config."),d[g]=f):(Deft.Logger.log("Injecting '"+e+"' into '"+g+"' property."),c[g]=f)},this);if(b)for(e in d)g=d[e],b="set"+Ext.String.capitalize(e),c[b].call(c,g);else Ext.isFunction(c.initConfig)&&(f=c.initConfig,c.initConfig=function(a){return f.call(this,Ext.Object.merge({},a||{},d))});return c}});
Ext.define("Deft.mixin.Injectable",{requires:["Deft.ioc.Injector"],onClassMixedIn:function(a){a.prototype.constructor=Ext.Function.createInterceptor(a.prototype.constructor,function(){return Deft.Injector.inject(this.inject,this,!1)})}});
Ext.define("Deft.mvc.ViewController",{alternateClassName:["Deft.ViewController"],requires:["Deft.log.Logger"],config:{view:null},constructor:function(a){this.initConfig(a);if(this.getView()instanceof Ext.ClassManager.get("Ext.Component"))if(this.registeredComponents={},this.isExtJS=null!=this.getView().events,this.isSenchaTouch=!this.isExtJS,this.isExtJS)if(this.getView().rendered)this.onViewInitialize();else this.getView().on("afterrender",this.onViewInitialize,this,{single:!0});else if(this.getView().initialized)this.onViewInitialize();
else this.getView().on("initialize",this.onViewInitialize,this,{single:!0});else Ext.Error.raise({msg:"Error constructing ViewController: the configured 'view' is not an Ext.Component."});return this},init:function(){},destroy:function(){return!0},onViewInitialize:function(){var a,c,b,d,e,f;this.isExtJS?(this.getView().on("beforedestroy",this.onViewBeforeDestroy,this),this.getView().on("destroy",this.onViewDestroy,this,{single:!0})):(e=this,d=this.getView().destroy,this.getView().destroy=function(){e.destroy()&&
d.call(this)});f=this.control;for(b in f)c=f[b],a=this.locateComponent(b,c),c=Ext.isObject(c.listeners)?c.listeners:null==c.selector?c:void 0,this.registerComponent(b,a,c);this.init()},onViewBeforeDestroy:function(){return this.destroy()?(this.getView().un("beforedestroy",this.onBeforeDestroy,this),!0):!1},onViewDestroy:function(){for(var a in this.registeredComponents)this.unregisterComponent(a)},getComponent:function(a){var c;return null!=(c=this.registeredComponents[a])?c.component:void 0},registerComponent:function(a,
c,b){var d,e,f,g,h;Deft.Logger.log("Registering '"+a+"' component.");null!=this.getComponent(a)&&Ext.Error.raise({msg:"Error registering component: an existing component already registered as '"+a+"'."});this.registeredComponents[a]={component:c,listeners:b};"view"!==a&&(e="get"+Ext.String.capitalize(a),this[e]||(this[e]=Ext.Function.pass(this.getComponent,[a],this)));if(Ext.isObject(b))for(d in b){e=f=b[d];h=this;g=null;if(Ext.isObject(f)&&(g=Ext.apply({},f),null!=g.fn&&(e=g.fn,delete g.fn),null!=
g.scope))h=g.scope,delete g.scope;Deft.Logger.log("Adding '"+d+"' listener to '"+a+"'.");if(Ext.isFunction(e))c.on(d,e,h,g);else if(Ext.isFunction(this[e]))c.on(d,this[e],h,g);else Ext.Error.raise({msg:"Error adding '"+d+"' listener: the specified handler '"+e+"' is not a Function or does not exist."})}},unregisterComponent:function(a){var c,b,d,e,f,g;Deft.Logger.log("Unregistering '"+a+"' component.");null==this.getComponent(a)&&Ext.Error.raise({msg:"Error unregistering component: no component is registered as '"+
a+"'."});d=this.registeredComponents[a];c=d.component;f=d.listeners;if(Ext.isObject(f))for(b in f){d=e=f[b];g=this;if(Ext.isObject(e)&&(null!=e.fn&&(d=e.fn),null!=e.scope))g=e.scope;Deft.Logger.log("Removing '"+b+"' listener from '"+a+"'.");Ext.isFunction(d)?c.un(b,d,g):Ext.isFunction(this[d])?c.un(b,this[d],g):Ext.Error.raise({msg:"Error removing '"+b+"' listener: the specified handler '"+d+"' is not a Function or does not exist."})}"view"!==a&&(c="get"+Ext.String.capitalize(a),this[c]=null);this.registeredComponents[a]=
null},locateComponent:function(a,c){var b;b=this.getView();if("view"===a)return b;Ext.isString(c)?(b=b.query(c),0===b.length&&Ext.Error.raise({msg:"Error locating component: no component found matching '"+c+"'."}),1<b.length&&Ext.Error.raise({msg:"Error locating component: multiple components found matching '"+c+"'."})):Ext.isString(c.selector)?(b=b.query(c.selector),0===b.length&&Ext.Error.raise({msg:"Error locating component: no component found matching '"+c.selector+"'."}),1<b.length&&Ext.Error.raise({msg:"Error locating component: multiple components found matching '"+
c.selector+"'."})):(b=b.query("#"+a),0===b.length&&Ext.Error.raise({msg:"Error locating component: no component found with an itemId of '"+a+"'."}),1<b.length&&Ext.Error.raise({msg:"Error locating component: multiple components found with an itemId of '"+a+"'."}));return b[0]}});Ext.define("Deft.mixin.Controllable",{});
Ext.Class.registerPreprocessor("controller",function(a,c,b,d){var e,f,g;3===arguments.length&&(b=arguments[1],d=arguments[2]);if(null!=c.mixins&&Ext.Array.contains(c.mixins,Ext.ClassManager.get("Deft.mixin.Controllable"))&&(e=c.controller,delete c.controller,f=[],null!=e&&(f=Ext.isArray(e)?e:[e]),a.prototype.constructor=Ext.Function.createSequence(a.prototype.constructor,function(){var a,b,c;b=0;for(c=f.length;b<c;b++){a=f[b];try{Ext.create(a,{view:this})}catch(e){Deft.Logger.log("Error initializing Controllable instance: an error occurred while creating an instance of the specified controller: '"+
a+"'.");throw e;}}}),0<f.length))return g=this,Ext.require(f,function(){d!=null&&d.call(g,a,c,b)}),!1});Ext.Class.setDefaultPreprocessorPosition("controller","before","mixins");
Ext.define("Deft.promise.Deferred",{alternateClassName:["Deft.Deferred"],constructor:function(){this.state="pending";this.value=this.progress=void 0;this.progressCallbacks=[];this.successCallbacks=[];this.failureCallbacks=[];this.cancelCallbacks=[];this.promise=Ext.create("Deft.Promise",this);return this},then:function(a,c,b,d){var e,f,g,h,i;Ext.isObject(a)?(f=a.success,c=a.failure,b=a.progress,a=a.cancel):(f=a,a=d);i=[f,c,b,a];g=0;for(h=i.length;g<h;g++)d=i[g],!Ext.isFunction(d)&&!(null===d||void 0===
d)&&Ext.Error.raise({msg:"Error while configuring callback: a non-function specified."});e=Ext.create("Deft.promise.Deferred");d=function(a,b){return function(c){var d;if(Ext.isFunction(a))try{d=a(c);if(d===void 0)e[b](c);else d instanceof Ext.ClassManager.get("Deft.promise.Promise")||d instanceof Ext.ClassManager.get("Deft.promise.Deferred")?d.then(Ext.bind(e.resolve,e),Ext.bind(e.reject,e),Ext.bind(e.update,e),Ext.bind(e.cancel,e)):e.resolve(d)}catch(f){e.reject(f)}else e[b](c)}};this.register(d(f,
"resolve"),this.successCallbacks,"resolved",this.value);this.register(d(c,"reject"),this.failureCallbacks,"rejected",this.value);this.register(d(a,"cancel"),this.cancelCallbacks,"cancelled",this.value);this.register(function(a){return function(b){var c;if(Ext.isFunction(a)){c=a(b);c===void 0?e.update(b):e.update(c)}else e.update(b)}}(b),this.progressCallbacks,"pending",this.progress);return e.getPromise()},always:function(a){return this.then({success:a,failure:a,cancel:a})},update:function(a){"pending"===
this.state?(this.progress=a,this.notify(this.progressCallbacks,a)):Ext.Error.raise({msg:"Error: this Deferred has already been completed and cannot be modified."})},resolve:function(a){this.complete("resolved",a,this.successCallbacks)},reject:function(a){this.complete("rejected",a,this.failureCallbacks)},cancel:function(a){this.complete("cancelled",a,this.cancelCallbacks)},getPromise:function(){return this.promise},getState:function(){return this.state},register:function(a,c,b,d){Ext.isFunction(a)&&
("pending"===this.state&&c.push(a),this.state===b&&void 0!==d&&this.notify([a],d))},complete:function(a,c,b){"pending"===this.state?(this.state=a,this.value=c,this.notify(b,c),this.releaseCallbacks()):Ext.Error.raise({msg:"Error: this Deferred has already been completed and cannot be modified."})},notify:function(a,c){var b,d,e;d=0;for(e=a.length;d<e;d++)b=a[d],b(c)},releaseCallbacks:function(){this.cancelCallbacks=this.failureCallbacks=this.successCallbacks=this.progressCallbacks=null}});
Ext.define("Deft.promise.Promise",{alternateClassName:["Deft.Promise"],statics:{when:function(a,c){var b;if(a instanceof Ext.ClassManager.get("Deft.promise.Promise")||a instanceof Ext.ClassManager.get("Deft.promise.Deferred"))return a.then(c);b=Ext.create("Deft.promise.Deferred");b.resolve(a);return b.then(c)},all:function(a,c){return this.when(this.reduce(a,this.reduceIntoArray,Array(a.length)),c)},any:function(a,c){var b,d,e,f,g,h,i,j,k,l,m;d=Ext.create("Deft.promise.Deferred");k=function(a){d.update(a)};
j=function(a){b();d.resolve(a)};b=function(){return k=j=function(){}};i=function(a){return j(a)};h=function(a){return rejector(a)};f=function(a){return k(a)};e=l=0;for(m=a.length;l<m;e=++l)g=a[e],e in a&&this.when(g,i,h,f);return d.then(c)},memoize:function(a,c,b){return this.all(Ext.Array.toArray(arguments)).then(Deft.util.Function.spread(function(){return Deft.util.memoize(arguments,c,b)},c))},map:function(a,c){var b,d,e,f,g;e=Array(a.length);b=f=0;for(g=a.length;f<g;b=++f)d=a[b],b in a&&(e[b]=
this.when(d,c));return this.reduce(e,this.reduceIntoArray,e)},reduce:function(a,c,b){var d,e;e=this.when;d=[function(b,d,h){return e(b,function(b){return e(d,function(d){return c(b,d,h,a)})})}];3===arguments.length&&d.push(b);return this.when(this.reduceArray.apply(a,d))},reduceArray:function(a,c){var b,d,e,f,g;e=0;d=Object(this);f=d.length>>>0;b=arguments;if(1>=b.length)for(;;){if(e in d){g=d[e++];break}if(++e>=f)throw new TypeError;}else g=b[1];for(;e<f;)e in d&&(g=a(g,d[e],e,d)),e++;return g},
reduceIntoArray:function(a,c,b){a[b]=c;return a}},constructor:function(a){this.deferred=a;return this},then:function(a){return this.deferred.then.apply(this.deferred,arguments)},always:function(a){return this.deferred.always(a)},cancel:function(a){return this.deferred.cancel(a)},getState:function(){return this.deferred.getState()}},function(){null!=Array.prototype.reduce&&(this.reduceArray=Array.prototype.reduce)});

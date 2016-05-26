/*! banana-fusion - v1.6.8 - 2016-05-26
 * https://github.com/LucidWorks/banana/wiki
 * Copyright (c) 2016 Andrew Thanalertvisuti; Licensed Apache License */

define("panels/scatterplot/module",["angular","app","underscore","jquery","d3"],function(a,b,c,d,e){"use strict";var f=a.module("kibana.panels.scatterplot",[]);b.useModule(f),f.controller("scatterplot",["$scope","$timeout","timer","dashboard","querySrv","filterSrv",function(b,d,f,g,h,i){b.panelMeta={modals:[{description:"Inspect",icon:"icon-info-sign",partial:"app/partials/inspector.html",show:b.panel.spyable}],editorTabs:[{title:"Queries",src:"app/partials/querySelect.html"}],status:"Stable",description:"This panel helps you to plot a bubble scatterplot between two to four variables."};var j={queries:{mode:"all",ids:[],query:"*:*",custom:""},max_rows:1e3,xaxis:"",yaxis:"",xaxisLabel:"",yaxisLabel:"",colorField:"",bubbleSizeField:"",spyable:!0,show_queries:!0,refresh:{enable:!1,interval:2}};c.defaults(b.panel,j),b.init=function(){b.panel.refresh.enable&&b.set_timer(b.panel.refresh.interval),b.$on("refresh",function(){b.get_data()}),b.get_data()},b.set_timer=function(a){b.panel.refresh.interval=a,c.isNumber(b.panel.refresh.interval)?(f.cancel(b.refresh_timer),b.realtime()):f.cancel(b.refresh_timer)},b.realtime=function(){b.panel.refresh.enable?(f.cancel(b.refresh_timer),b.refresh_timer=f.register(d(function(){b.realtime(),b.get_data()},1e3*b.panel.refresh.interval))):f.cancel(b.refresh_timer)},b.get_data=function(){b.panelMeta.loading=!0,delete b.panel.error;var a,d;b.sjs.client.server(g.current.solr.server+g.current.solr.core_name),b.panel.queries.ids=h.idsByMode(b.panel.queries);var f=b.sjs.BoolQuery();c.each(b.panel.queries.ids,function(a){f=f.should(h.getEjsObj(a))}),a=b.sjs.Request().indices(g.indices),a=a.query(b.sjs.FilteredQuery(f,i.getBoolFilter(i.ids))).size(b.panel.max_rows),b.populate_modal(a);var j="";i.getSolrFq()&&(j="&"+i.getSolrFq());var k="&wt=csv",l="&rows="+b.panel.max_rows,m="&fl="+b.panel.xaxis+","+b.panel.yaxis;b.panel.colorField&&(m+=","+b.panel.colorField),b.panel.bubbleSizeField&&(m+=","+b.panel.bubbleSizeField),b.panel.queries.query=h.getORquery()+j+m+k+l,a=null!=b.panel.queries.custom?a.setQuery(b.panel.queries.query+b.panel.queries.custom):a.setQuery(b.panel.queries.query),d=a.doSearch(),d.then(function(a){b.data=e.csv.parse(a,function(a){var c={};return c[b.panel.xaxis]=+a[b.panel.xaxis],c[b.panel.yaxis]=+a[b.panel.yaxis],b.panel.colorField&&(c[b.panel.colorField]=a[b.panel.colorField]),b.panel.bubbleSizeField&&(c[b.panel.bubbleSizeField]=+a[b.panel.bubbleSizeField]),c},function(a,b){console.log("Error parsing results from Solr: ",b)}),0===b.data.length&&(b.panel.error=b.parse_error("There's no data to show")),b.render()}),b.panelMeta.loading=!1},b.set_refresh=function(a){b.refresh=a},b.close_edit=function(){b.panel.refresh.enable&&b.set_timer(b.panel.refresh.interval),b.refresh&&b.get_data(),b.refresh=!1,b.$emit("render")},b.render=function(){b.$emit("render")},b.populate_modal=function(c){b.inspector=a.toJson(JSON.parse(c.toString()),!0)},b.pad=function(a){return(10>a?"0":"")+a}}]),f.directive("scatterplot",["dashboard","filterSrv",function(b,c){return{restrict:"E",link:function(f,g){function h(){g.html("");var a=g[0],h=g.parent().width(),i=parseInt(f.row.height),j=50,k={top:20,right:20,bottom:100,left:50},l=h-k.left-k.right;i=i-k.top-k.bottom;var m,n=e.scale.category20();f.panel.bubbleSizeField&&(m=e.scale.linear().domain(e.extent(f.data,function(a){return a[f.panel.bubbleSizeField]})).range([3,20]).nice());var o=e.scale.linear().range([0,l-2*j]),p=e.scale.linear().range([i,0]);o.domain(e.extent(f.data,function(a){return a[f.panel.xaxis]})).nice(),p.domain(e.extent(f.data,function(a){return a[f.panel.yaxis]})).nice();var q=e.select(a).append("svg").attr("width",l+k.left+k.right).attr("height",i+k.top+k.bottom).attr("viewBox","0 0 "+h+" "+(i+k.top+k.bottom)).attr("preserveAspectRatio","xMidYMid").append("g").attr("transform","translate("+k.left+","+k.top+")"),r=d("<div>");if(q.selectAll(".dot").data(f.data).enter().append("circle").attr("class","dot").attr("r",function(a){return f.panel.bubbleSizeField?m(a[f.panel.bubbleSizeField]):3}).attr("cx",function(a){return o(a[f.panel.xaxis])}).attr("cy",function(a){return p(a[f.panel.yaxis])}).style("fill",function(a){return n(a[f.panel.colorField])}).on("mouseover",function(a){var b=a[f.panel.colorField]?a[f.panel.colorField]:"";r.html('<i class="icon-circle" style="color:'+n(a[f.panel.colorField])+';"></i> '+b+" ("+a[f.panel.xaxis]+", "+a[f.panel.yaxis]+")<br>").place_tt(e.event.pageX,e.event.pageY)}).on("mouseout",function(){r.detach()}).on("click",function(a){f.panel.colorField&&(c.set({type:"terms",field:f.panel.colorField,value:a[f.panel.colorField],mandate:"must"}),r.detach(),b.refresh())}),f.panel.colorField){var s=q.selectAll(".legend").data(n.domain()).enter().append("g").attr("class","legend").attr("transform",function(a,b){return"translate(0,"+20*b+")"}).on("mouseover",function(){a.style.cursor="pointer"}).on("mouseout",function(){a.style.cursor="auto"}).on("click",function(d){c.set({type:"terms",field:f.panel.colorField,value:d,mandate:"must"}),a.style.cursor="auto",b.refresh()});s.append("text").attr("x",l-24).attr("y",9).attr("dy",".35em").style("text-anchor","end").text(function(a){return a}),s.append("rect").attr("x",l-18).attr("width",18).attr("height",18).style("fill",n)}var t=e.svg.axis().scale(o).orient("bottom"),u=e.svg.axis().scale(p).orient("left"),v="";v=f.panel.xaxisLabel?f.panel.xaxisLabel:f.panel.xaxis,q.append("g").attr("class","x axis").attr("transform","translate(0,"+i+")").call(t).append("text").attr("class","label").attr("transform","translate("+(l/2-k.left)+" ,30)").style("text-anchor","middle").text(v);var w="";w=f.panel.yaxisLabel?f.panel.yaxisLabel:f.panel.yaxis,q.append("g").attr("class","y axis").call(u).append("text").attr("class","label").attr("transform","rotate(-90)").attr("y",0-k.left).attr("x",0-(i-k.top-k.bottom)/2).attr("dy",".71em").style("text-anchor","end").text(w)}f.$on("render",function(){h()}),a.element(window).bind("resize",function(){h()})}}}])});
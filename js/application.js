
$(function(){
	$("#page_menu dt").click(function(){
		$(this).parent().toggleClass("close");
	});
	
	// tabs and panels
	$("ul.tabs > li").click(function(){
		var index = $(this).prevAll().length;
		var panels = $(this).parent().next(".panels");
		var panel_element = panels.children(".panel").get(index);
		if(panel_element != undefined){
			panels.children(".panel").hide();
			$(panel_element).show();
		}
		$(this).parent().children("li").removeClass("current");
		$(this).addClass("current");
	});
	
	// 高亮当前访问的菜单
	var current_url = window.location.href;
	if(window.location.search){
		current_url = current_url.substring(0, window.location.href.indexOf("?"));
	}
	$("#page_menu dd a").each(function(i, e){
		if(e.href && e.href==current_url){
			$(e).parent().addClass("current");
		}
	});
	
	
	// 设置留存用户的留存率的td背景色
	$('table.retention tbody tr').each(function(){
		$('td:gt(1)', this).each(function(){
			if (!/^[0-9]+\.[0-9]{2}$/.test($.trim($(this).text()))) return;
			var retention = parseFloat($(this).text());
			if (isNaN(retention)) return;
			if(retention > 60){
				$(this).css("background-color", "#5471AF").css("color", "white");
			}else if(retention > 40){
				$(this).css("background-color", "#9EB5DA").css("color", "white");
			}else if(retention > 20){
				$(this).css("background-color", "#C9D8EC");
			}else{
				$(this).css("background-color", "#EBF1F8");
			}
		});
	}) ;
	
	
	
	
	// AJAX表格的分页控件
	$(document).on("click", ".ajax_pager_container .block .pager a", function(e){
		var container_block = $(this).parent().parent().parent().parent();
		var loading_img = $("<img src='"+root_url+"images/ajax-loader.gif'/>");
		container_block.block({
			message: loading_img,
			css:{
				width:'32px',
				border:'none',
				background: 'none'
			},
			overlayCSS:{
				backgroundColor: '#FFF',
				opacity: 0.8
			},
			baseZ:997
		});
		container_block.load(this.href);
		return false;
	});
});



/** the following code modified base on umeng */
var cached_charts = {};
function render_chart(chart_id, title, data_src_url, params, force_reload, opts){
	var common_opts = {
			chart: {
				defaultSeriesType: "spline",
				animation: false
			},
			yAxis: {
				title:"",
				min:0
			},
			credits: {
				"enabled":false
			},
			plotOptions: {
				"area":{
					"stacking":null
				},
				"series":{
					animation: false,
					events: {
						legendItemClick: function(event) {
							var legendName = this.name+'_<dot>';
							var tempSeries = this.chart.series;
							var seriesLength = tempSeries.length;
							for (var i=0; i < seriesLength; i++){
								if (tempSeries[i].name == legendName){
									tempSeries[i].visible ? tempSeries[i].hide() : tempSeries[i].show();
								}
							}
						}
					}
				}
			},
			tooltip: {
				enabled: true,
				formatter: function() {
					return ''+
					this.x + '日'+ this.series.name + ' : '+ this.y;
				}
			},
			legend: {
				margin: 25,
				enabled: true
			},
			subtitle: {}
	};
//	Set Cached Chart Unique Id
	var chart_cache_id = 'tcclick_' + chart_id;
	$.each(params, function(i,n){
		chart_cache_id += '_' + i + ':' + n;
	});
//	Do Nothing If Chart Existing and No Need To Reload
	var cached_data = $('#'+chart_id).data(chart_cache_id);
	if ( cached_charts[chart_cache_id] != undefined && !force_reload && cached_data != null ){
		try{
			cached_charts[chart_cache_id].destroy();
			cached_charts[chart_cache_id] = new Highcharts.Chart($.extend(true, {}, common_opts, cached_data));
//			Trigger chart_data_loaded event
			var data_source = $('#'+chart_id);
			data_source.trigger('chart_data_loaded', data_source.data(chart_cache_id+'_rawdata'));
		}catch(error){}
		return;
	}
//	Loading Data
	var categories = [];
	var series = [];
	var chart_canvas = $('#'+chart_id);
	var loading_img = $("<img src='"+root_url+"images/ajax-loader.gif'/>");
	chart_canvas.block({
		message: loading_img,
		css:{
			width:'32px',
			border:'none',
			background: 'none'
		},
		overlayCSS:{
			backgroundColor: '#FFF',
			opacity: 0.8
		},
		baseZ:997
	});
	$.get( data_src_url, params, function(resp){
		if( resp.result == 'success'){
			$.each(resp.dates, function(i,date){
				categories[i] = date
			});
			$.each(resp.stats, function(i,stat){
				series[i] = $.extend({visible:true}, stat);// 合并属性
			});
//			Set Init Options
			var options = $.extend(true, {
				chart: {
					renderTo: chart_id
				},
				title: {
					text: title
				},
				xAxis: {
					categories: categories,
					labels:{
						align:"right",
//						rotation:-45,
						step: parseInt(categories.length / 7)
					}
				},
				series: series
			}, opts || {});
//			Cache data
			$('#'+chart_id).data(chart_cache_id, options );
			$('#'+chart_id).data(chart_cache_id+'_rawdata', resp);
//			Destroy Existing Chart
			if ( cached_charts[chart_cache_id] != undefined ){
				try{
					cached_charts[chart_cache_id].destroy();
				}catch(error){}
			}
//			Create Chart
			cached_charts[chart_cache_id] = new Highcharts.Chart($.extend(true, {}, common_opts, options));
//			Trigger chart_data_loaded event
			$('#'+chart_id).trigger('chart_data_loaded', resp);
		}
		chart_canvas.unblock();
	});
}
function flush_chart(){
	cached_charts = {};
}

function Create_table(div_id, data_url){
	var table = $("<table>");
	table.appendTo($("#"+div_id+""));
	$.get(data_url, function(resp){
		if(resp.result == "success"){
			var thead = $("<thead></thead>");
			thead.appendTo(table);
			$.each(resp.datas, function(i,data){
				var th = $("<th style='background: url(../images/bg_jdleft.jpg) #E6E6E6 repeat-x 0 -30px;'>"+data+"</th>");
					th.appendTo(thead);
			});
			$.each(resp.status, function(i,statu){
					var tr = $("<tr></tr>");
					tr.appendTo(table);
					var td = $("<td id = '"+statu.name+"'>"+statu.name+"</td>");
						td.appendTo(tr);
						td = $("<td>"+statu.proprotion+"%</td>");
						td.appendTo(tr);
				});
			  }
			});
	$("#"+div_id+"").append("</table>");
}
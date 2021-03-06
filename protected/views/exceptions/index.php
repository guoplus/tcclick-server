<h1>错误报告</h1>
<div class="block">
	<h3>概况</h3>
	<div id="daily_exceptions_count_chart" class="panel">a</div>
</div>
<div id="exceptions_list_block" class="ajax_pager_container">
</div>


<script>$(function(){
	render_chart('daily_exceptions_count_chart','',root_url+'exceptions/AjaxDailyCount', {}, false,
			{tooltip: {formatter: function() { return this.x +' 出错 '+ this.y + ' 次';}} } );
	$("#exceptions_list_block").load(root_url+'exceptions/AjaxExceptionsListBlock');

	$(document).on("click", ".exceptions_list tr", function(){
		if($(this).attr("id") == undefined) return;
		var id = $(this).attr("id");
		var url = root_url + "exceptions/" + id + "/AjaxView";
		if(!$(this).next().hasClass("content")){
			var tr_class = $(this).attr("class");
			var tr = this;
			$.get(url, function(data){
				var html = "<tr class='"+tr_class+" content'><td colspan='5'>"
				+"<div><a id='"+id+"' class='ignore' href='#'>忽略该错误</a>&nbsp;&nbsp;&nbsp;&nbsp;"
				+"<a id='"+id+"' class='fixed' href='#'>标记为已修复</a></div>"
				+"<pre style='width:800px;'>"+data.content+"</pre></td></tr>";
				$(tr).after(html);
			});
		}else{
			$(this).next().toggle();
		}
	});

	$(document).on("click", "a.ignore", function(){
		var url = root_url+"exceptions/"+$(this).attr("id")+"/update";
		$.post(url, {status: 1});
		$(this).parent().parent().parent().prev().remove();
		$(this).parent().parent().parent().remove();
		return false;
	});
	$(document).on("click", "a.fixed", function(){
		var url = root_url+"exceptions/"+$(this).attr("id")+"/update";
		var html = "<form action='"+url+"' method='post'>"
		+ "<input name='status' value='2'/>"
		+ "</form>";
		$(html).submit();
		return false;
	});
});</script>
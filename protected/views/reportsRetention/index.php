<?php
$from = date('Y-m-d', time()-86400*30);
$to = date('Y-m-d', time()-86400);
$channel_id = intval($_GET['channel_id']);
$type = 'daily';

$sql = "select * from {retention_rate_daily} where `date`>='{$from}' and `date`<='{$to}'
and channel_id={$channel_id} order by `date`";
$rows = TCClick::app()->db->query($sql)->fetchAll(PDO::FETCH_ASSOC);

?>
<h1>留存用户</h1>
<div class="block">
  <table class='retention'>
		<thead><tr>
			<th style='width:100px;'>时间</th>
			<th style='width:100px;'>新增设备数</th>
			<th colspan="8">留存率(%):&nbsp;&nbsp;&nbsp;&nbsp; 
			<select id="myselect"  onchange="location.href=root_url+'reportsRetention?type='+this.options[this.selectedIndex].value;">
					<option id="day_retention" value='daily'>天</option>
					<option id="week_retention" value='weekly' <?php if($type=='weekly') echo " selected='selected'"?>>自然周</option>
					<option id="month_retention" value='monthly' <?php if($type=='monthly') echo " selected='selected'"?>>自然月</option>
			</select></th>
		</tr></thead>
		<tr>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td style='text-align:center;padding-right:0;'>1天后</td>
			<td style='text-align:center;padding-right:0;'>2天后</td>
			<td style='text-align:center;padding-right:0;'>3天后</td>
			<td style='text-align:center;padding-right:0;'>4天后</td>
			<td style='text-align:center;padding-right:0;'>5天后</td>
			<td style='text-align:center;padding-right:0;'>6天后</td>
			<td style='text-align:center;padding-right:0;'>7天后</td>
			<td style='text-align:center;padding-right:0;'>8天后</td>
		</tr>
		<?php foreach($rows as $i=>$row):?><tr>
			<td><?php echo $row['date']?></td>
			<td><?php echo $row['new_count']?></td>
			<td><?php if($row['retention1']>0) printf('%.02f', $row['retention1']/100)?>&nbsp;</td>
			<td><?php if($row['retention2']>0) printf('%.02f', $row['retention2']/100)?>&nbsp;</td>
			<td><?php if($row['retention3']>0) printf('%.02f', $row['retention3']/100)?>&nbsp;</td>
			<td><?php if($row['retention4']>0) printf('%.02f', $row['retention4']/100)?>&nbsp;</td>
			<td><?php if($row['retention5']>0) printf('%.02f', $row['retention5']/100)?>&nbsp;</td>
			<td><?php if($row['retention6']>0) printf('%.02f', $row['retention6']/100)?>&nbsp;</td>
			<td><?php if($row['retention7']>0) printf('%.02f', $row['retention7']/100)?>&nbsp;</td>
			<td><?php if($row['retention8']>0) printf('%.02f', $row['retention8']/100)?>&nbsp;</td>
		</tr><?php endforeach;?>
  </table>
</div>

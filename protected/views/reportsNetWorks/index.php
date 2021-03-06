<?php 
$time = time();
$start_date = date('Y-m-d', $time-86400*30);
$end_date = date('Y-m-d', $time);
$network_active_sql  = "select network_id, sum(count) as sc from {counter_daily_active_network}
	where date>='$start_date' and date<='$end_date' 
	group by  network_id order by sc DESC";
$stmt = TCClick::app()->db->query($network_active_sql);
$all_network_count = 0;
$max_network_count = 0;
foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row){
  $network_active_counts[$row['network_id']] = $row['sc'];
  $all_network_count += $row['sc'];
  if ($max_network_count < $row['sc']) $max_network_count = $row['sc'];
}

?>
<h1>活跃用户联网方式</h1>
<div class="block">
<h3>TOP 10 联网方式分布  <span style="float: right;"><?php echo $start_date?> ~ <?php echo $end_date?> </span>

</h3>
  <table>
    <thead>
      <th width="190px">联网方式</th>
      <th>比例</th>
    </thead>
    <?php $i=0;foreach ($network_active_counts as $network_id=>$count):?><tr>
			<td><?php echo Network::nameof($network_id)?></td>
			<td class='percent'>
				<div class="label"><?php printf('%.02f', $count/$all_network_count*100)?>%</div>
				<div class="chart_area"><div style="width:<?php echo $count/$max_network_count*100?>%"></div></div>
			</td>
		</tr><?php $i++;endforeach;?>
  </table>
</div>
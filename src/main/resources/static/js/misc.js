		<script th:inline="javascript">
  			var features = [];
		</script>
		<script th:each="playground: ${playgrounds}" th:inline="javascript">
  			features.push(new ol.Feature({
                   geometry: new ol.geom.Point(ol.proj.fromLonLat([[${playground.longitude}]], [[${playground.latitude}]]))
             }));
		</script>
<script>
import { Line, mixins } from "vue-chartjs";

const { reactiveProp } = mixins;

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ["height", "options", "chartData"],
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
};
</script>

import { useRef, useEffect } from "preact/hooks";
import { h } from "preact";
import Chart from "chart.js";

export const Pie = ({ data }) => {
  const ctx = useRef(null);
  useEffect(() => {
    if (ctx.current) {
      new Chart(ctx.current, {
        type: "doughnut",
        options: {
          legend: {
            position: "bottom",
          },
        },
        data: {
          labels: data.map((d) => d.id),
          datasets: [
            {
              data: data.map((d) => d.value),
              backgroundColor: [
                "hsl(171, 100%, 41%)",
                "hsl(48, 100%, 67%)",
                "hsl(204, 86%, 53%)",
                "hsl(348, 100%, 61%)",
                "hsl(141, 71%, 48%)",
              ],
            },
          ],
        },
      });
    }
  }, [ctx]);
  return <canvas ref={ctx} />;
};

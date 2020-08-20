import { useRef, useEffect } from "preact/hooks";
import { h } from "preact";
import Chart from "chart.js";

export const Bar = ({ data }) => {
  const ctx = useRef(null);
  useEffect(() => {
    if (ctx.current) {
      const chart = new Chart(ctx.current, {
        type: "bar",
        options: {
          legend: {
            display: false,
          },
        },
        data: {
          labels: data.map((d) => d.id),
          datasets: [
            {
              data: data.map((d) => d.value),
              backgroundColor: data.map((d) =>
                d.highlight ? "hsl(171, 100%, 41%)" : "hsl(0, 0%, 71%)"
              ),
            },
          ],
        },
      });
      return () => chart.destroy();
    }
  }, [data]);
  return <canvas ref={ctx} />;
};

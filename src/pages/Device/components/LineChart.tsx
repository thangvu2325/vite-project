import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { userData } from "@/redux/selector";
import { loginSuccess } from "@/redux/slices/authSlice";
import { createAxios, tokenType } from "@/services/createInstance";
import { historyType } from "@/type/device";
import { FunctionComponent, useEffect, useState } from "react";
import Chart from "react-apexcharts";

interface LineChartProps {
  deviceId: string;
}

const LineChart: FunctionComponent<LineChartProps> = ({ deviceId }) => {
  const [data, setData] = useState<Array<historyType>>([]);
  const userToken = useAppSelector(userData)?.currentUser as tokenType;
  const dispatch = useAppDispatch();
  const axiosClient = createAxios(userToken, dispatch, loginSuccess);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosClient.get(`/history?deviceId=${deviceId}`);
        setData(res.data.historyList);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log(error.message);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId]);

  const chartData = data.map((item) => ({
    x: item.createdAt,
    y: item.sensors.SmokeValue,
  }));

  return (
    <Chart
      type="line"
      height={360}
      series={[
        {
          name: "Smoke",
          data: chartData,
        },
      ]}
      options={{
        chart: {
          toolbar: {
            show: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        colors: ["#020617"],
        stroke: {
          lineCap: "round",
          curve: "smooth",
        },
        markers: {
          size: 0,
        },
        xaxis: {
          axisTicks: {
            show: true, // Hiện trục x
          },
          axisBorder: {
            show: true, // Hiện trục x
          },
          labels: {
            style: {
              colors: "#616161",
              fontSize: "12px",
              fontFamily: "inherit",
              fontWeight: 400,
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: "#616161",
              fontSize: "12px",
              fontFamily: "inherit",
              fontWeight: 400,
            },
          },
          axisTicks: {
            show: true, // Hiện trục y
          },
          axisBorder: {
            show: true, // Hiện trục y
          },
        },
        grid: {
          show: true,
          borderColor: "#dddddd",
          strokeDashArray: 5,
          xaxis: {
            lines: {
              show: true,
            },
          },
          padding: {
            top: 5,
            right: 20,
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          theme: "dark",
        },
      }}
    />
  );
};

export default LineChart;

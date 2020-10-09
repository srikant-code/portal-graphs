// @ts-ignore
import React, { useEffect } from "react";
import { PlotLineGraph, PlotBoxGraph } from "./plot";

const Graph: React.FC = () => {
  const [data, setData] = React.useState({
    jobs: [] as any,
    percentileKeys: [] as any,
    percentileVals: [] as any,

    iodepthKeys: [] as any,
    iodepthVals: [] as any,

    latencyKeys: [] as any,
    latencyVals: [] as any,

    boxPlotData: [] as any,
    iopplots: [] as any,
  });

  const generateObjForMinMax = (
    min: number,
    max: number,
    mean: number,
    name: string
  ) => {
    return {
      y: [min, max, mean],
      name: name,
      boxpoints: false,
      marker: {
        color: "rgb(137, 32, 223)",
      },
      line: {
        width: 1,
      },
      type: "box",
    };
  };

  const processdata = (res: any) => {
    let percentileObj = res.jobs.map(
      (job: { write: { clat_ns: { percentile: any } } }) =>
        job.write.clat_ns.percentile as any
    );
    let clat_ns_val = Object.values(percentileObj[0])
      .map((ns) => (ns as any) / 1000000000.0)
      .filter((ns) => ns !== 0);

    let iodepthObj = res.jobs.map(
      (job: { iodepth_level: any }) => job.iodepth_level as any
    );

    let iodepthval = Object.values(iodepthObj[0]).filter((el) => el !== 0);

    let latencyObj = res.jobs.map(
      (job: { latency_ms: any }) => job.latency_ms as any
    );
    let latencyval = Object.values(latencyObj[0]);
    // .filter(el => el !== 0)

    let writeObj = res.jobs.map((job: { write: any }) => job.write as any);
    let boxPlot = [
      // (generateObjForMinMax(writeObj[0].slat_ns.min, writeObj[0].slat_ns.max, writeObj[0].slat_ns.mean, "slat nsec")),
      generateObjForMinMax(
        writeObj[0].bw_min as number,
        writeObj[0].bw_max as number,
        writeObj[0].bw_mean as number,
        "Bandwidth"
      ),
    ];
    let iopplot = [
      generateObjForMinMax(
        writeObj[0].iops_min as number,
        writeObj[0].iops_max as number,
        writeObj[0].iops_mean as number,
        "IOPs"
      ),
    ];
    setData({
      percentileKeys: Object.keys(percentileObj[0]),
      percentileVals: clat_ns_val,

      iodepthKeys: Object.keys(iodepthObj[0]),
      iodepthVals: iodepthval,

      latencyKeys: Object.keys(latencyObj[0]),
      latencyVals: latencyval,

      boxPlotData: boxPlot,
      iopplots: iopplot,
      jobs: res.jobs,
    });
  };

  const fetchdata = () => {
    const url =
      "https://raw.githubusercontent.com/louwrentius/fio-plot-data/master/benchmark_data/HPMICROSERVERG10/SATA_AHCI_HGST_HTS72101_100GB_7K2RPM/randwrite-32-16.json";
    fetch(url)
      .then((res) => res.json())
      .then((res) => processdata(res));
  };

  useEffect(() => {
    fetchdata();
  });
  return (
    <div
      style={{
        width: "100vw",
        background: "#2F333D",
        display: "flex",
        flexFlow: "row wrap",
        alignItems: "center",
        justifyContent: "center",
      }}>
      {/* Clat ns Plot */}
      <PlotLineGraph
        x={{ value: data.percentileKeys as any, title: "Percentiles" }}
        y={{ value: data.percentileVals as any, title: "Clat in seconds" }}
      />
      {/* iodepth Plot */}
      <PlotLineGraph
        x={{ value: data.iodepthKeys as any, title: "IO Depth" }}
        y={{ value: data.iodepthVals as any, title: "Depth Percentile %" }}
      />
      <PlotLineGraph
        x={{ value: data.latencyKeys as any, title: "Latency in millisecond" }}
        y={{ value: data.latencyVals as any, title: "Latency Percentile %" }}
      />
      <PlotBoxGraph
        plotdata={data.boxPlotData}
        title="Min, Max, Mean of Bandwidth"
      />
      <PlotBoxGraph plotdata={data.iopplots} title="Min, Max, Mean of IOPs" />
    </div>
  );
};

export default Graph;

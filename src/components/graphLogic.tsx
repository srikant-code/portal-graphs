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
    iopPlots: [] as any,
    clatSlatLatPlots: [] as any,
  });

  const generateObjForMinMaxMean = (
    min: number,
    max: number,
    mean: number,
    color: string,
    name: string
  ) => {
    return {
      y: [min, max, mean],
      name: name,
      boxpoints: true,
      marker: {
        color: color,
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

    let latencykeys = Object.keys(latencyObj[0])
    // Code for resolving infinity issue
    latencykeys[latencykeys.length - 1] = latencykeys[latencykeys.length - 1].replace("=", '').replace(">", '').replace("<", '')
    latencykeys[latencykeys.length - 1] = (parseInt(latencykeys[latencykeys.length - 1]) + 1).toString()

    let writeObj = res.jobs.map((job: { write: any }) => job.write as any);
    let boxPlot = [
      generateObjForMinMaxMean(
        writeObj[0].bw_min as number,
        writeObj[0].bw_max as number,
        writeObj[0].bw_mean as number,
        "rgb(137, 32, 223)",
        "Bandwidth",
      ),
    ];
    let iopplot = [
      generateObjForMinMaxMean(
        writeObj[0].iops_min as number,
        writeObj[0].iops_max as number,
        writeObj[0].iops_mean as number,
        "rgb(137, 32, 223)",
        "IOPs",
      ),
    ];
    let clatSlatLatplot = [
      generateObjForMinMaxMean(
        (writeObj[0].clat_ns.min as number) * 0.000000001,
        writeObj[0].clat_ns.max as number * 0.000000001,
        writeObj[0].clat_ns.mean as number * 0.000000001,
        "rgb(223, 32, 190)",
        "Clat in Nanosecond",
      ),
      generateObjForMinMaxMean(
        writeObj[0].slat_ns.min as number * 0.000000001,
        writeObj[0].slat_ns.max as number * 0.000000001,
        writeObj[0].slat_ns.mean as number * 0.000000001,
        "rgb(137, 32, 223)",
        "Slat in Nanosecond",
      ),
      generateObjForMinMaxMean(
        writeObj[0].lat_ns.min as number * 0.000000001,
        writeObj[0].lat_ns.max as number * 0.000000001,
        writeObj[0].lat_ns.mean as number * 0.000000001,
        "rgb(32, 85, 223)",
        "Lat in Nanosecond",
      ),
    ];

    setData({
      percentileKeys: Object.keys(percentileObj[0]),
      percentileVals: clat_ns_val,

      iodepthKeys: Object.keys(iodepthObj[0]),
      iodepthVals: iodepthval,

      latencyKeys: latencykeys,
      latencyVals: latencyval,

      boxPlotData: boxPlot,
      iopPlots: iopplot,
      clatSlatLatPlots: clatSlatLatplot,
      jobs: res.jobs,
    });
  };

  const fetchdata = () => {
    const endpoint =
      "https://raw.githubusercontent.com/louwrentius/fio-plot-data/master/benchmark_data/HPMICROSERVERG10/SATA_AHCI_HGST_HTS72101_100GB_7K2RPM/randwrite-32-16.json";
    fetch(endpoint)
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
        x={{ value: data.percentileVals as any, title: "Clat in seconds" }}
        y={{ value: data.percentileKeys as any, title: "Percentiles" }}
      />
      {/* iodepth Plot */}
      <PlotLineGraph
        x={{ value: data.iodepthKeys as any, title: "IO Depth" }}
        y={{ value: data.iodepthVals as any, title: "Depth Percentile %" }}
      />
      {/* Clat, Slat, Lat Plot */}
      <PlotBoxGraph plotdata={data.clatSlatLatPlots} title="Min, Max, Mean of Clat, Slat, Lat" />
      {/* Latency Plot */}
      <PlotLineGraph
        x={{ value: data.latencyKeys as any, title: "Latency in millisecond" }}
        y={{ value: data.latencyVals as any, title: "Latency Percentile %" }}
      />
      {/* IOPs Plot */}
      <PlotBoxGraph plotdata={data.iopPlots} title="Min, Max, Mean of IOPs" />
      {/* Bandwidth Plot */}
      <PlotBoxGraph plotdata={data.boxPlotData} title="Min, Max, Mean of Bandwidth" />
    </div>
  );
};

export default Graph;

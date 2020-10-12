import React from "react";
import Plot from "react-plotly.js";

const graphsLayout = (datax: any, datay: any) => {
    return {
        plot_bgcolor: "#292b31",
        paper_bgcolor: "#292b31",
        font: {
            color: "#fff",
        },
        autosize: true,
        width: 720,
        height: 550,
        margin: {
            l: 95,
            r: 50,
            b: 65,
            t: 60,
            pad: 35,
        },
        xaxis: {
            // rangeslider: { visible: true },
            title: datax,
            showgrid: true,
            gridcolor: "#2f333d",
            gridwidth: 2,
            automargin: true,
            autorange: true,
            autotick: true,
        },
        yaxis: {
            title: datay,
            side: "left",
            showgrid: true,
            gridcolor: "#2f333d",
            gridwidth: 2,
            automargin: true,
            autorange: true,
            autotick: true,
        },
        // yaxis2: {
        //   title: "Percentiles",
        //   side: "right",
        //   overlaying: "y",
        // },
        hoverlabel: {
            font: {
                color: "#fff",
            },
        },
        legend: {
            x: 0,
            y: 1,
            traceorder: "normal",
            font: {
                family: "ubuntu",
                size: 12,
                color: "#fff",
            },
            bgcolor: "#292b31",
            bordercolor: "#292b31",
            borderwidth: 0,
        },
        dragmode: "zoom",
        separators: ".,",
        // width: null,
        // height: null,
    };
};

const graphsStyles = () => {
    return {
        width: "fit-content",
        margin: "50px",
    };
};
const graphsConfig = (filename: any) => {
    return {
        displaylogo: false,
        autosizable: true,
        responsive: true,
        frameMargins: 0.2,
        showAxisDragHandles: true,
        showAxisRangeEntryBoxes: true,
        showTips: true,
        displayModeBar: true,
        toImageButtonOptions: {
            format: "png",
            filename: filename,
            width: 1920,
            height: 1080,
            scale: 2,
        },
    };
};

export const PlotBoxGraph = (props: any) => {
    return (
        <Plot
            data={[...props.plotdata]}
            layout={{ ...(graphsLayout(props.title, "Range") as object) }}
            style={{ ...(graphsStyles() as object) }}
            config={{ ...(graphsConfig(props.title + "Plot") as object) }}
        />
    );
};
export const PlotLineGraph = (props: any) => {
    return (
        <Plot
            data={[
                {
                    x: props.x.value,
                    y: props.y.value,
                    type: "scatter",
                    mode: "lines+markers",
                    marker: { color: "#ab63fa" },
                    line: {
                        shape: "spline",
                        smoothing: 1,
                        dash: "dot",
                    }
                },
            ]}
            layout={{ ...(graphsLayout(props.x.title, props.y.title) as object) }}
            style={{ ...(graphsStyles() as object) }}
            config={{ ...(graphsConfig(props.title + "FIO Plot") as object) }}
        />
    );
};

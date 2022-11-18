import { src, dest, lastRun } from "gulp";
import { paths } from "../config/paths";
import plumber from "gulp-plumber";
import debug from "gulp-debug";
import htmlmin from "gulp-htmlmin";
import { onError } from "../utils/onError";
import prettier from "gulp-prettier";
import gulpif from "gulp-if";
import size from "gulp-size";
import embedSvg from "gulp-embed-svg";

import rename from "gulp-rename";
const nodeEnv = process.env.NODE_ENV || "development";

export const compileHtml = () => {
  console.log(
    `Executing COMPILE:HTML on '${paths.src.html.htmlFiles}' in MODE: ${nodeEnv}`
  );
  return new Promise((resolve, reject) => {
    return src(paths.src.html.htmlFiles, { since: lastRun(compileHtml) })
      .pipe(
        plumber({
          errorHandler: onError,
        })
      )
      .pipe(prettier())
      .pipe(
        embedSvg({
          selectors: ".inline-svg",
          root: `${paths.src.assets.svgFiles}`,
          xmlMode: true,
        })
      )
      .pipe(gulpif(nodeEnv !== "development", htmlmin({ collapseWhitespace: true })))
      // .pipe(debug({ title: "@debug compileHtml : " }))
      .pipe(
        size({
          title: "compileHtml : ",
          showFiles: true,
          showTotal: true,
        })
      )
      .pipe(
        rename((file) => {
          file.dirname = "";
        })
      )
      .pipe(dest([`${paths.dist.dir}`]))
      .on("error", reject)
      .on("end", resolve);
  });
};

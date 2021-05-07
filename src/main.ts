import RTCG from "./rtcg-app/RTCG";

function main(): void {
  const container: HTMLElement = document.getElementById("scene-container");

  const worldgen_RTCG: RTCG = new RTCG(container);

  worldgen_RTCG.startLoop();
}

main();

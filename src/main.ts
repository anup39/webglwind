import "./style.css";
import { Map } from "./map";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <div class="map-wrap">
      <div id="map" />
    </div>
`;

// Initialize the map when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new Map("map");
});

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { WindLayer } from "./windlayer";

export class Map {
  private map: maplibregl.Map | null = null;
  private mapContainer: HTMLElement;
  private readonly lng: number = 139.753;
  private readonly lat: number = 35.6844;
  private readonly zoom: number = 14;
  private readonly API_KEY: string = import.meta.env
    .VITE_MAPTILER_TOKEN as string;

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error("Map container not found");
    }
    this.mapContainer = container;
    this.initializeMap();
  }

  private initializeMap(): void {
    if (this.map) return; // prevent multiple initializations

    this.map = new maplibregl.Map({
      container: this.mapContainer,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${this.API_KEY}`,
      center: [this.lng, this.lat],
      zoom: this.zoom,
      canvasContextAttributes: { antialias: true },
    });

    this.map.on("load", () => {
      // Add wind layer
      const windLayer = new WindLayer();
      this.map?.addLayer(windLayer.getLayer());
    });

    // Add navigation control
    this.map.addControl(new maplibregl.NavigationControl(), "top-right");

    // Add marker
    new maplibregl.Marker({ color: "#FF0000" })
      .setLngLat([139.7525, 35.6846])
      .addTo(this.map);
  }

  // Method to destroy the map instance
  public destroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}

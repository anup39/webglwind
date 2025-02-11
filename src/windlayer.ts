import maplibregl, { CustomLayerInterface } from "maplibre-gl";

export class WindLayer {
  private startTime: number;
  private program: WebGLProgram | null = null;
  private buffer: WebGLBuffer | null = null;
  private aPos: number = 0;
  private aVelocity: number = 0;

  constructor() {
    this.startTime = Date.now();
  }

  public getLayer(): CustomLayerInterface {
    return {
      id: "wind",
      type: "custom" as const,
      onAdd: this.onAdd.bind(this),

      //@ts-ignore
      render: this.render.bind(this),
      renderingMode: "2d" as const,
    };
  }

  //@ts-ignore
  private onAdd(map: maplibregl.Map, gl: WebGL2RenderingContext): void {
    const vertexSource = `#version 300 es
            uniform mat4 u_matrix;
            uniform float u_time;
            in vec2 a_pos;
            in vec2 a_velocity;
            out vec2 v_pos;
            out vec2 v_velocity;
            
            void main() {
                vec2 pos = mod(a_pos + a_velocity * u_time, 1.0);
                gl_Position = u_matrix * vec4(pos, 0.0, 1.0);
                gl_PointSize = 2.0;
                v_pos = pos;
                v_velocity = a_velocity;
            }`;

    const fragmentSource = `#version 300 es
            precision highp float;
            in vec2 v_pos;
            in vec2 v_velocity;
            out vec4 fragColor;
            
            void main() {
                float speed = length(v_velocity);
                vec3 color = mix(vec3(0.0, 0.5, 1.0), vec3(1.0, 0.5, 0.0), speed * 10.0);
                fragColor = vec4(color, 0.8);
            }`;

    // Create and compile shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertexShader, vertexSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader);

    // Create program
    this.program = gl.createProgram()!;
    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);

    // Get attribute locations
    this.aPos = gl.getAttribLocation(this.program, "a_pos");
    this.aVelocity = gl.getAttribLocation(this.program, "a_velocity");

    // Create particles
    const numParticles = 10000;
    const particles = new Float32Array(numParticles * 4);

    for (let i = 0; i < numParticles; i++) {
      const i4 = i * 4;
      particles[i4] = Math.random();
      particles[i4 + 1] = Math.random();
      particles[i4 + 2] = (Math.random() - 0.5) * 0.01;
      particles[i4 + 3] = (Math.random() - 0.5) * 0.01;
    }

    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, particles, gl.STATIC_DRAW);
  }

  private render(
    gl: WebGL2RenderingContext,
    matrix: { defaultProjectionData: { mainMatrix: number[] } }
  ): void {
    if (!this.program || !this.buffer) return;

    gl.useProgram(this.program);

    const currentTime = (Date.now() - this.startTime) / 1000;
    gl.uniform1f(gl.getUniformLocation(this.program, "u_time"), currentTime);
    gl.uniformMatrix4fv(
      gl.getUniformLocation(this.program, "u_matrix"),
      false,
      matrix.defaultProjectionData.mainMatrix
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(this.aPos);
    gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(this.aVelocity);
    gl.vertexAttribPointer(this.aVelocity, 2, gl.FLOAT, false, 16, 8);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.drawArrays(gl.POINTS, 0, 5000);
  }
}

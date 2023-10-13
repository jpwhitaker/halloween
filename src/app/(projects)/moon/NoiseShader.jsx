import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

const NoiseShader = shaderMaterial(
  { iTime: 0, iResolution: new THREE.Vector3() },
  // Vertex Shader
  `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader (The provided shader code)
  `
    uniform float iTime;
    uniform vec3 iResolution;

    vec3 red = vec3(1,0,0);
vec3 green = vec3(0,1,0);
vec3 blue = vec3(0,0,1);

mat2 rotate(float angle)
{
    return mat2(cos(angle),-sin(angle), sin(angle),cos(angle));
}

mat2 scale2d(vec2 value)
{
    return mat2(value.x,0,0,value.y);
}

float rand(vec2 uv){
    return fract(sin(dot(uv.xy, vec2(12.9898,78.233))) * 43758.5453);
}


//====== GRADIENT ==============
vec2 ghash( vec2 x )  // replace this by something better
{
    const vec2 k = vec2( 0.3183099, 0.3678794 );
    x = x*k + k.yx;
    return -1.0 + 2.0*fract( 16.0 * k*fract( x.x*x.y*(x.x+x.y)) );
}

float gnoise( in vec2 p )
{
    vec2 i = floor( p );
    vec2 f = fract( p );
	
	vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( ghash( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), 
                     dot( ghash( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( ghash( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), 
                     dot( ghash( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

//=================================

// ======  SIMPLEX ==================
vec2 shash( vec2 p ) // replace this by something better
{
	p = vec2( dot(p,vec2(127.1,311.7)),
			  dot(p,vec2(269.5,183.3)) );

	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float snoise( in vec2 p )
{
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;

	vec2 i = floor( p + (p.x+p.y)*K1 );
	
    vec2 a = p - i + (i.x+i.y)*K2;
    vec2 o = step(a.yx,a.xy);    
    vec2 b = a - o + K2;
	vec2 c = a - 1.0 + 2.0*K2;

    vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );

	vec3 n = h*h*h*h*vec3( dot(a,shash(i+0.0)), dot(b,shash(i+o)), dot(c,shash(i+1.0)));

    return dot( n, vec3(70.0) );
	
}

float circle(vec2 uv,float radius, vec2 shapePos)
{
     
    float dist = distance(shapePos,uv);
    float value = step(radius,dist);
    
    return value; 
}

//=======================================
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;  
    float ratio = iResolution.x / iResolution.y;
    
    //uv.x *= ratio;
    
    
    float value;
    float zoom = 9.;
    vec3 color;
   	float scale = .02;
    
    //uv *= rotate(iTime);
    
    float offset = snoise(uv * 9. + iTime );
    value = step(.4 + offset,uv.x) - step(.8 + offset,uv.x);
	color = mix(blue,red * iTime, value);

    
    
    
    fragColor = vec4(color,1.);
}
  `
);

export default NoiseShader;
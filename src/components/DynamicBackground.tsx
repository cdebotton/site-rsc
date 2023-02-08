'use client';

import {
	indigoDark,
	red,
	orange,
	slateDark,
	slate,
	violetDark,
	plumDark,
} from '@radix-ui/colors';
import { a, useSpring, useSprings } from '@react-spring/three';
import { useGLTF, Edges, Preload } from '@react-three/drei';
import {
	Canvas,
	useFrame,
	useThree,
	type GroupProps,
	type InstancedMeshProps,
	type MeshProps,
	type Props,
} from '@react-three/fiber';
import { EffectComposer, SSAO } from '@react-three/postprocessing';
import { damp, dampC } from 'maath/easing';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
	Matrix4,
	SphereGeometry,
	MeshBasicMaterial,
	Color,
	Object3D,
	type InstancedMesh,
	type Group,
	type Mesh,
} from 'three';

import type { GLTF } from 'three-stdlib';

import { ThemeContext } from '@/components/ThemeProvider';

function useColor() {
	let theme = ThemeContext.useSelector((state) => state.context.theme);

	if (theme === 'EVA-02') {
		return {
			surface: red.red1,
			surfaceSubtle: slate.slate4,
			surfaceSubtle2: slate.slate5,
			fg: red.red10,
			fgSubtle: orange.orange2,
			accent: orange.orange8,
		};
	}

	return {
		surface: indigoDark.indigo1,
		surfaceSubtle: slateDark.slate5,
		surfaceSubtle2: slateDark.slate7,
		fg: plumDark.plum4,
		fgSubtle: violetDark.violet4,
		accent: plumDark.plum10,
	};
}

export default function SolarSystem(props: Omit<Props, 'children'>) {
	return (
		<Canvas
			shadows="soft"
			orthographic
			gl={{ alpha: false }}
			camera={{ zoom: 50, position: [10, 20, 20] }}
			eventPrefix="client"
			eventSource={document.body}
			{...props}
		>
			<directionalLight intensity={0.4} />
			<pointLight castShadow position={[-4, 10, 0]} intensity={0.8} />
			<CameraOrbit />
			<Fog />
			<Background />
			<Bounce>
				<Planet />
				<Moons orbitRadius={8} count={750} />
			</Bounce>
			<Floor position={[0, -4, 0]} size={[100, 100]} />
			<EffectComposer multisampling={0}>
				<SSAO
					samples={5}
					radius={0.15}
					intensity={20}
					luminanceInfluence={0.6}
					color="red"
				/>
				<SSAO
					samples={5}
					radius={0.03}
					intensity={15}
					luminanceInfluence={0.6}
					color="red"
				/>
			</EffectComposer>
			<Preload all />
		</Canvas>
	);
}

function Background() {
	let color = useColor().surface;
	return <color attach="background" args={[color]} />;
}

function CameraOrbit() {
	let { camera, pointer } = useThree();

	useEffect(() => {
		function handler() {
			camera.zoom = Math.min(65 * (innerWidth / 800), 65);
		}

		window.addEventListener('resize', handler);

		handler();

		return () => {
			window.removeEventListener('resize', handler);
		};
	}, [camera]);

	useFrame((_, d) => {
		damp(camera.position, 'x', Math.sin(pointer.x) * 20, 0.25, d);
		camera.lookAt(0, 0, 0);
	});

	return null;
}

function Fog() {
	let color = useColor().surface;

	return <fog attach="fog" color={color} near={24} far={37} />;
}

function Bounce({ children }: { children?: ReactNode }) {
	let ref = useRef<Group>(null!);

	useFrame(({ clock }) => {
		let t = clock.getElapsedTime();
		ref.current.position.y = Math.sin(t) * 2 + 1;
	});

	return <group ref={ref}>{children}</group>;
}

function Planet(props: Pick<MeshProps, 'position' | 'rotation' | 'scale'>) {
	let ref = useRef<Mesh<SphereGeometry, MeshBasicMaterial>>(null!);
	let planetColor = useColor().fg;
	let edgeColor = useColor().accent;
	let [hover, setHover] = useState(false);

	useFrame(({ clock }, d) => {
		let t = clock.getElapsedTime();

		dampC(ref.current.material.color, hover ? edgeColor : planetColor, 0.25, d);

		ref.current.rotation.x = Math.sin(t);
		ref.current.rotation.z = Math.cos(t);
	});

	let springs = useSpring({
		from: {
			scale: 0,
		},
		to: {
			scale: 1,
		},
		delay: 1000,
		config: {
			mass: 3,
			damping: 5,
			friction: 12,
		},
	});

	return (
		<a.mesh
			onPointerEnter={() => setHover(true)}
			onPointerLeave={() => setHover(false)}
			castShadow
			scale={springs.scale}
			ref={ref}
			{...props}
		>
			<octahedronGeometry args={[3, 3]} />
			<meshToonMaterial color={planetColor} />
			<Edges color={edgeColor} />
		</a.mesh>
	);
}

const tempColor = new Color();
const tempObject = new Object3D();

function Moons({
	count = 750,
	orbitRadius = 12,
	...props
}: InstancedMeshProps & { count?: number; orbitRadius?: number }) {
	let ref = useRef<InstancedMesh>(null!);
	let moonColor = useColor().fgSubtle;
	let hoverColor = useColor().accent;

	let colors = useMemo(() => {
		return Array.from({ length: count }, () => new Color(moonColor));
	}, [count, moonColor]);

	let colorArray = useMemo(
		() =>
			Float32Array.from(
				Array.from({ length: count }, (_, i) => {
					return colors[i].toArray();
				}).flat(),
			),
		[count, colors],
	);

	let [hover, setHover] = useState<number | undefined>();
	let previous = useRef<number | undefined>();

	let [moons] = useState(() => {
		return Array.from({ length: count }, (_, i) => {
			let distance = Math.random() * orbitRadius;
			let speed = (distance + 2) * (1 / 10);
			return {
				scale: Math.random() * 0.5 + 0.05,
				seed: Math.random() * 51421,
				distance: distance + 4,
				y: Math.sin(i),
				speed,
			};
		});
	});

	let [springs] = useSprings(moons.length, (i) => {
		let { scale, distance } = moons[i];

		return {
			from: {
				scale: 0,
			},
			to: { scale },
			config: {
				mass: scale / 2,
				damping: 1.5,
				friction: 4,
			},
			delay: distance * 250 + 250,
		};
	});

	useFrame(({ clock }, d) => {
		let t = clock.getElapsedTime();

		springs.forEach((spring, i) => {
			let { seed, distance, speed, y } = moons[i];
			let t1 = t * speed + seed;
			let scale = spring.scale.get();

			dampC(colors[i], i === hover ? hoverColor : moonColor, 0.2, d);

			tempColor.set(colors[i]).toArray(colorArray, i * 3);

			ref.current.geometry.attributes.color.needsUpdate = true;

			tempObject.scale.setScalar(scale);
			tempObject.position.set(
				Math.sin(t1) * distance,
				y,
				Math.cos(t1) * distance,
			);
			tempObject.updateMatrix();

			ref.current.setMatrixAt(i, tempObject.matrix);
		});

		ref.current.instanceMatrix.needsUpdate = true;
	});

	return (
		<instancedMesh
			castShadow
			onPointerMove={(e) => {
				previous.current = hover;
				setHover(e.instanceId);
			}}
			onPointerLeave={() => {
				previous.current = hover;
				setHover(undefined);
			}}
			ref={ref}
			args={[undefined, undefined, count]}
			{...props}
		>
			<sphereGeometry>
				<instancedBufferAttribute
					args={[colorArray, 3]}
					attach={'attributes-color'}
				/>
			</sphereGeometry>
			<meshBasicMaterial vertexColors />
		</instancedMesh>
	);
}

type GLTFResult = GLTF & {
	nodes: {
		Cross: THREE.Mesh;
	};
	materials: {};
};

function Floor({
	size = [100, 100],
	gap = 2,
	...props
}: GroupProps & { size?: [number, number]; gap?: number }) {
	let gridColor = useColor().surfaceSubtle;
	let crossColor = useColor().surfaceSubtle2;

	let [planeWidth, planeHeight] = size;
	let [columns, rows] = [planeWidth / gap + 1, planeHeight / gap + 1];
	let [crosses] = useState(() =>
		Array.from({ length: columns }, (_, y) => {
			return Array.from({ length: rows }, (_, x) => {
				return {
					column: x,
					row: y,
					x: x * gap - planeWidth / 2,
					y: y * gap - planeHeight / 2,
					key: y * rows + x,
				};
			});
		}).flat(),
	);

	type Point = [x: number, y: number, z: number];

	let [springs] = useSprings(crosses.length, (i) => {
		let { x, y, column, row } = crosses[i];

		let delay =
			Math.sqrt(
				Math.pow(column + 0.5 - columns / 2, 2) +
					Math.pow(row + 0.5 - rows / 2, 2),
			) * 125;

		return {
			from: {
				position: [x, 1, y] satisfies Point,
				scale: [0, 0, 0] satisfies Point,
			},
			to: {
				position: [x, 0, y] satisfies Point,
				scale: [0.04, 1, 0.125] satisfies Point,
			},
			delay,
		};
	});

	let { nodes } = useGLTF(
		'/assets/cross-transformed.glb',
	) as unknown as GLTFResult;

	let ref = useRef<InstancedMesh>(null!);
	let matrix = useMemo(() => new Matrix4(), []);

	useFrame(() => {
		springs.forEach((spring, i) => {
			matrix
				.makeScale(...spring.scale.get())
				.setPosition(...spring.position.get());

			ref.current.setMatrixAt(i, matrix);
		});

		ref.current.instanceMatrix.needsUpdate = true;
	});

	return (
		<group {...props}>
			<gridHelper args={[...size, gridColor, gridColor]} />
			<mesh
				receiveShadow
				position={[0, -0.02, 0]}
				rotation={[-Math.PI / 2, 0, 0]}
			>
				<planeGeometry args={[...size]} />
				<shadowMaterial color="black" opacity={0.2} />
			</mesh>
			<instancedMesh
				receiveShadow
				ref={ref}
				dispose={null}
				geometry={nodes.Cross.geometry}
				args={[undefined, undefined, springs.length]}
			>
				<meshBasicMaterial color={crossColor} />
			</instancedMesh>
		</group>
	);
}

useGLTF.preload('/assets/cross-transformed.glb');

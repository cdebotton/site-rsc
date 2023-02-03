'use client';

import { a, useSpring, useSprings } from '@react-spring/three';
import { useGLTF, Edges } from '@react-three/drei';
import {
	Canvas,
	useFrame,
	type GroupProps,
	type InstancedMeshProps,
	type MeshProps,
	type Props,
} from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import { type InstancedMesh, Matrix4, type Mesh } from 'three';

import { ThemeContext } from './ThemeProvider';

import type { GLTF } from 'three-stdlib';

function useColor() {
	let theme = ThemeContext.useSelector((state) => state.context.theme);
}

export default function SolarSystem(props: Omit<Props, 'children'>) {
	return (
		<Canvas
			shadows="soft"
			orthographic
			camera={{ zoom: 50, position: [10, 20, 20] }}
			eventPrefix="client"
			eventSource={document.body}
			{...props}
		>
			<directionalLight intensity={0.4} />
			<pointLight castShadow position={[-4, 10, 0]} intensity={0.4} />
			<Planet />
			<Moons orbitRadius={8} count={500} />
			<Floor position={[0, -4, 0]} size={[100, 100]} />
		</Canvas>
	);
}

function Planet(props: Pick<MeshProps, 'position' | 'rotation' | 'scale'>) {
	let ref = useRef<Mesh>(null!);

	useFrame(({ clock }) => {
		let t = clock.getElapsedTime();
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
		<a.mesh castShadow scale={springs.scale} ref={ref} {...props}>
			<octahedronGeometry args={[3, 2]} />
			<meshToonMaterial />
			<Edges />
		</a.mesh>
	);
}

function Moons({
	count = 750,
	orbitRadius = 12,
	...props
}: InstancedMeshProps & { count?: number; orbitRadius?: number }) {
	let ref = useRef<InstancedMesh>(null!);

	let [moons] = useState(() => {
		return Array.from({ length: count }, (_, i) => {
			let distance = Math.random() * orbitRadius;
			let speed = (distance + 2) * (1 / 10);
			return {
				scale: Math.random() * 0.3 + 0.05,
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

	let matrix = useMemo(() => new Matrix4(), []);

	useFrame(({ clock }) => {
		let t = clock.getElapsedTime();

		springs.forEach((spring, i) => {
			let { seed, distance, speed, y } = moons[i];
			let t1 = t * speed + seed;
			let scale = spring.scale.get();

			matrix
				.makeScale(scale, scale, scale)
				.setPosition(Math.sin(t1) * distance, y, Math.cos(t1) * distance);

			ref.current.setMatrixAt(i, matrix);
		});

		ref.current.instanceMatrix.needsUpdate = true;
	});

	return (
		<instancedMesh
			castShadow
			ref={ref}
			{...props}
			args={[undefined, undefined, count]}
		>
			<sphereGeometry />
			<meshToonMaterial />
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
			matrix.makeScale(...spring.scale.get());
			matrix.setPosition(...spring.position.get());

			ref.current.setMatrixAt(i, matrix);
		});

		ref.current.instanceMatrix.needsUpdate = true;
	});

	return (
		<group {...props}>
			<gridHelper args={[...size, '#aaa', '#aaa']} />
			<mesh
				receiveShadow
				position={[0, -0.02, 0]}
				rotation={[-Math.PI / 2, 0, 0]}
			>
				<planeGeometry args={[...size]} />
				<shadowMaterial color="black" opacity={0.5} />
			</mesh>
			<instancedMesh
				receiveShadow
				ref={ref}
				dispose={null}
				geometry={nodes.Cross.geometry}
				args={[undefined, undefined, springs.length]}
			>
				<meshBasicMaterial />
			</instancedMesh>
		</group>
	);
}

useGLTF.preload('/assets/cross-transformed.glb');

'use client';

import { useSprings } from '@react-spring/three';
import { useGLTF } from '@react-three/drei';
import {
	Canvas,
	GroupProps,
	MeshProps,
	Props,
	useFrame,
} from '@react-three/fiber';
import { useRef, useState } from 'react';
import { type InstancedMesh, Matrix4, type Mesh } from 'three';

import type { GLTF } from 'three-stdlib';

export default function SolarSystem(props: Omit<Props, 'children'>) {
	return (
		<Canvas
			orthographic
			camera={{ zoom: 50, position: [10, 20, 20] }}
			eventPrefix="client"
			eventSource={document.body}
			{...props}
		>
			<directionalLight />
			<Planet />
			<Floor position={[0, -4, 0]} size={[100, 100]} />
		</Canvas>
	);
}

function Planet(props: MeshProps) {
	let ref = useRef<Mesh>(null!);

	useFrame(({ clock }) => {
		let t = clock.getElapsedTime();
		ref.current.rotation.x = Math.sin(t);
		ref.current.rotation.z = Math.cos(t);
	});

	return (
		<mesh ref={ref} {...props}>
			<octahedronGeometry args={[3, 2]} />
			<meshToonMaterial />
		</mesh>
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
	matrix = new Matrix4(),
	...props
}: GroupProps & { size?: [number, number]; gap?: number }) {
	let edges = [size[0] / gap, size[1] / gap];
	let [crosses] = useState(() =>
		Array.from({ length: edges[1] }, (_, y) => {
			return Array.from({ length: edges[0] }, (_, x) => {
				return {
					x: x * gap - (edges[0] * gap) / 2,
					y: y * gap - (edges[1] * gap) / 2,
					key: y * edges[1] + x,
				};
			});
		}).flat(),
	);

	let [springs] = useSprings(crosses.length, (i) => {
		let { x, y } = crosses[i];
		return {
			from: {
				scale: 0,
			},
			to: {
				scale: 1,
			},
			delay: Math.abs(x - edges[0] / 2) * 100,
		};
	});

	let { nodes } = useGLTF(
		'/assets/cross-transformed.glb',
	) as unknown as GLTFResult;

	let ref = useRef<InstancedMesh>(null!);

	useFrame(({ clock }) => {
		for (let i = 0; i < crosses.length; i += 1) {
			let { x, y } = crosses[i];
			let { scale } = springs[i];
			let s = scale.get();

			matrix.makeScale(0.04 * s, 1 * s, 0.125 * s);
			matrix.setPosition(x, 0, y);

			ref.current.setMatrixAt(i, matrix);
		}

		ref.current.instanceMatrix.needsUpdate = true;
	});

	return (
		<group {...props}>
			<gridHelper args={[...size, '#aaa', '#aaa']} />
			<instancedMesh
				ref={ref}
				dispose={null}
				geometry={nodes.Cross.geometry}
				rotation={[0, Math.PI / 2, 0]}
				args={[undefined, undefined, crosses.length]}
			>
				<meshBasicMaterial />
			</instancedMesh>
		</group>
	);
}

useGLTF.preload('/assets/cross-transformed.glb');

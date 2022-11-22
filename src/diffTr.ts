import { differenceBy, reduceRight } from "lodash";
import { Fragment, Node as ProsemirrorNode } from "prosemirror-model";
import { Transaction } from "prosemirror-state";
import {
	ReplaceAroundStep,
	ReplaceStep,
	Step,
	StepMap,
} from "prosemirror-transform";

export type NodeMatch<N extends ProsemirrorNode> = {
	node: N;
	pos: number;
};

export function findNodes(
	node: ProsemirrorNode | Fragment,
	predicate: (node: ProsemirrorNode) => boolean,
	/** A starting position offset to add to all node matches return */
	startPos: number = 0
): NodeMatch<ProsemirrorNode>[] {
	const children: NodeMatch<ProsemirrorNode>[] = [];
	if (node instanceof ProsemirrorNode && predicate(node)) {
		children.push({ node, pos: startPos });
	}
	node.descendants((node, relativePos) => {
		const pos = startPos + relativePos;
		if (predicate(node)) children.push({ node, pos });
		return true;
	});
	return children;
}

export type NodesDiff<N extends ProsemirrorNode> = {
	addedNodes: NodeMatch<N>[];
	deletedNodes: NodeMatch<N>[];
};

function diffStep(
	startDoc: ProsemirrorNode,
	step: Step,
	predicate: (node: ProsemirrorNode) => boolean
): NodesDiff<ProsemirrorNode> {
	const addedNodes: NodeMatch<ProsemirrorNode>[] = [];
	const deletedNodes: NodeMatch<ProsemirrorNode>[] = [];

	if (step instanceof ReplaceStep) {
		const removedSlice = startDoc.slice(step.from, step.to);
		const addedSlice = step.slice;

		deletedNodes.push(...findNodes(removedSlice.content, predicate, step.from));
		addedNodes.push(...findNodes(addedSlice.content, predicate, step.from));
	} else if (step instanceof ReplaceAroundStep) {
		// ReplaceAroundStep parameters: https://prosemirror.net/docs/ref/#transform.ReplaceAroundStep
		// Preserved range: oldState, {gapFrom, gapTo}
		// Deleted content: oldState: {from, gapFrom}, {to, gapTo}
		// New content: step.slice
		const removedSlice1 = startDoc.slice(step.from, step.gapFrom);
		const removedSlice2 = startDoc.slice(step.gapTo, step.to);
		const addedSlice = step.slice;

		deletedNodes.push(
			...findNodes(removedSlice1.content, predicate, step.from)
		);
		deletedNodes.push(
			...findNodes(removedSlice2.content, predicate, step.from)
		);
		addedNodes.push(...findNodes(addedSlice.content, predicate, step.from));
	}

	return { addedNodes, deletedNodes };
}

/**
 * Diffs a prosemirror transaction efficiently to find added and deleted nodes (optionally filtered by a predicate)
 * The added node matches point to positions in the new state, and the deleted nodes point to positions in the old state
 */
export function diffTr(
	tr: Transaction,
	predicate: (node: ProsemirrorNode) => boolean = () => true
): NodesDiff<ProsemirrorNode> {
	let oldDoc = tr.docs[0];
	let addedNodes: NodeMatch<ProsemirrorNode>[] = [],
		deletedNodes: NodeMatch<ProsemirrorNode>[] = [];

	const invertedSteps: StepMap[] = [];

	for (const stepIndex in tr.steps) {
		const step = tr.steps[stepIndex];
		let { addedNodes: addedNodesInStep, deletedNodes: deletedNodesInStep } =
			diffStep(oldDoc, step, predicate);

		// Diff total added nodes and deleted nodes, to see if a node added in a previous step was deleted
		addedNodes = differenceBy(
			addedNodes,
			deletedNodesInStep,
			(nodeMatch) => nodeMatch.node
		);
		deletedNodesInStep = differenceBy(
			deletedNodesInStep,
			addedNodes,
			(nodeMatch) => nodeMatch.node
		);

		// Map deleted nodes backward to startState document positions before appending to total deleted nodes
		deletedNodesInStep = reduceRight<StepMap, NodeMatch<ProsemirrorNode>[]>(
			invertedSteps,
			(deletedNodes, stepMap) => {
				return deletedNodes.map(({ node, pos }) => {
					return {
						node,
						pos: stepMap.map(pos),
					};
				});
			},
			deletedNodesInStep
		);

		deletedNodes.push(...deletedNodesInStep);

		// Map total added node positions forward to new doc positions
		const map = step.getMap();
		addedNodes = addedNodes.map(({ node, pos }) => {
			return {
				node,
				pos: map.map(pos),
			};
		});
		addedNodes.push(...addedNodesInStep);

		let stepResult = step.apply(oldDoc);

		if (!stepResult.doc) {
			throw new Error(
				`Applying step in transaction failed ${stepResult.failed}`
			);
		}

		oldDoc = stepResult.doc;
	}

	return { addedNodes: addedNodes, deletedNodes: deletedNodes };
}

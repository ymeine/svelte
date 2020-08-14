import Wrapper from './shared/Wrapper';
import Renderer from '../Renderer';
import Block from '../Block';
import { Identifier } from 'estree';
import SlotBlock from '../../nodes/SlotBlock';
import FragmentWrapper from './Fragment';
import create_debugging_comment from './shared/create_debugging_comment';
import { sanitize } from '../../../utils/names';
import InlineComponentWrapper from './InlineComponent';
import { get_slot_definition } from './shared/get_slot_definition';

export default class SlotBlockWrapper extends Wrapper {
	node: SlotBlock;

	slot_block: Block;
	fragment: FragmentWrapper;

	constructor(
		renderer: Renderer,
		block: Block,
		parent: Wrapper,
		node: SlotBlock,
		strip_whitespace,
		next_sibling
	) {
		super(renderer, block, parent, node);

		this.cannot_use_innerhtml();
		this.not_static_content();

		this._getOwner(block, node);

		this.fragment = new FragmentWrapper(
			renderer,
			this.slot_block,
			node.children,
			parent,
			strip_whitespace,
			next_sibling
		);
	}

	// FIXME 2020-08-14T18:38:12+02:00
	// I think I didn't get the parent properly or whatever...
	// Thiss is quite complex shit...
	// Basically, I think my actual slot has good name, but the parent is detected as the "default" slot and is th eone being rendered only.
	// Messed up with teh fragment and so on
	_getOwner(block: Block, node: SlotBlock) {
		let owner = this.parent;
		while (owner) {
			if (owner.node.type === 'InlineComponent') {
				break;
			}

			if (owner.node.type === 'Element' && /-/.test(owner.node.name)) {
				break;
			}

			owner = owner.parent;
		}

		if (owner && owner.node.type === 'InlineComponent') {
			const name = this.node.name;

			if (!(owner as unknown as InlineComponentWrapper).slots.has(name)) {
				const child_block = block.child({
					comment: create_debugging_comment(node, this.renderer.component),
					name: this.renderer.component.get_unique_name(`create_${sanitize(name)}_slot`),
					type: 'slot'
				});

				const { scope, lets } = this.node;
				const seen = new Set(lets.map(l => l.name.name));

				(owner as unknown as InlineComponentWrapper).node.lets.forEach(l => {
					if (!seen.has(l.name.name)) lets.push(l);
				});

				(owner as unknown as InlineComponentWrapper).slots.set(
					name,
					get_slot_definition(child_block, scope, lets)
				);
				this.renderer.blocks.push(child_block);
			}

			this.slot_block = (owner as unknown as InlineComponentWrapper).slots.get(name).block;
		}
	}

	render(
		block: Block,
		parent_node: Identifier,
		parent_nodes: Identifier
	) {
		this.fragment.render(block, parent_node, parent_nodes);
	}
}

import Node from './shared/Node';
import Expression from './shared/Expression';
import Component from '../Component';
import TemplateScope from './shared/TemplateScope';
import { INode } from './interfaces';
import map_children from './shared/map_children';
import Let from './Let';

export default class SlotBlock extends Node {
	type: 'SlotBlock';
	expression: Expression;

	scope: TemplateScope;
	lets: Let[] = [];

	name: string;
	children: INode[];

	constructor(component: Component, parent, scope: TemplateScope, info: any) {
		super(component, parent, scope, info);
		this.name = info.expression.name;
		this.children = map_children(component, this, scope, info.children);
	}
}

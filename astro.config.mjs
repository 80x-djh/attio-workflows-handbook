// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLlmsTxt from 'starlight-llms-txt';

// https://astro.build/config
export default defineConfig({
	site: 'https://attio-workflows-handbook.vercel.app',
	integrations: [
		starlight({
			title: 'Attio Workflows Handbook',
			description:
				'The open-source, definitive guide to Attio’s new Workflows engine — every block documented, credit costs explained, and battle-tested GTM recipes.',
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/80x-djh/attio-workflows-handbook',
				},
			],
			editLink: {
				baseUrl: 'https://github.com/80x-djh/attio-workflows-handbook/edit/main/',
			},
			lastUpdated: true,
			plugins: [
				starlightLlmsTxt({
					projectName: 'Attio Workflows Handbook',
					description:
						'Community-maintained reference for the Attio Workflows automation engine: triggers, step blocks, credit pricing, legacy migration, and go-to-market automation recipes.',
				}),
			],
			head: [
				{
					tag: 'script',
					attrs: { type: 'application/ld+json' },
					content: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'WebSite',
						name: 'Attio Workflows Handbook',
						url: 'https://attio-workflows-handbook.vercel.app',
						description:
							'The open-source, definitive guide to the Attio Workflows automation engine.',
						author: { '@type': 'Person', name: 'Dan Hull' },
					}),
				},
			],
			sidebar: [
				{
					label: 'Start Here',
					items: [
						{ label: 'What are Attio Workflows?', slug: 'start/what-are-workflows' },
						{ label: "What's new in the 2026 engine", slug: 'start/whats-new' },
						{ label: 'Build your first workflow', slug: 'start/first-workflow' },
						{ label: 'Credits & pricing explained', slug: 'start/credits-and-pricing' },
					],
				},
				{
					label: 'Core Concepts',
					items: [
						{ label: 'Choosing the right trigger', slug: 'concepts/triggers' },
						{ label: 'Variables & data passing', slug: 'concepts/variables' },
						{ label: 'Conditions & filters', slug: 'concepts/conditions-and-filters' },
						{ label: 'Records vs list entries', slug: 'concepts/records-vs-list-entries' },
						{ label: 'Loops & processing many records', slug: 'concepts/loops' },
						{ label: 'Permissions & workflow access', slug: 'concepts/permissions-and-access' },
						{ label: 'Runs, debugging & publishing', slug: 'concepts/runs-and-debugging' },
					],
				},
				{
					label: 'Block Reference',
					collapsed: false,
					items: [
						{ label: 'Overview', slug: 'reference' },
						{ label: 'Triggers', collapsed: true, autogenerate: { directory: 'reference/triggers' } },
						{ label: 'Agents', collapsed: true, autogenerate: { directory: 'reference/agents' } },
						{ label: 'AI', collapsed: true, autogenerate: { directory: 'reference/ai' } },
						{ label: 'Records', collapsed: true, autogenerate: { directory: 'reference/records' } },
						{ label: 'Lists', collapsed: true, autogenerate: { directory: 'reference/lists' } },
						{ label: 'Sequences', collapsed: true, autogenerate: { directory: 'reference/sequences' } },
						{ label: 'Tasks', collapsed: true, autogenerate: { directory: 'reference/tasks' } },
						{ label: 'Calculations', collapsed: true, autogenerate: { directory: 'reference/calculations' } },
						{ label: 'Conditions', collapsed: true, autogenerate: { directory: 'reference/conditions' } },
						{ label: 'Delays', collapsed: true, autogenerate: { directory: 'reference/delays' } },
						{ label: 'Workspace', collapsed: true, autogenerate: { directory: 'reference/workspace' } },
						{ label: 'Utilities', collapsed: true, autogenerate: { directory: 'reference/utilities' } },
						{ label: 'Third-party blocks', slug: 'reference/integrations' },
					],
				},
				{
					label: 'Legacy Migration',
					items: [
						{ label: 'Migrate legacy workflows', slug: 'migration' },
						{ label: 'Block changes reference', slug: 'migration/block-changes' },
						{ label: 'Pricing changes', slug: 'migration/pricing-changes' },
					],
				},
				{
					label: 'GTM Recipes',
					autogenerate: { directory: 'recipes' },
				},
				{
					label: 'Advanced',
					autogenerate: { directory: 'advanced' },
				},
				{
					label: 'Troubleshooting',
					autogenerate: { directory: 'troubleshooting' },
				},
				{
					label: 'Pro & Services',
					items: [
						{ label: 'Go Pro', slug: 'pro' },
						{ label: 'About & contributing', slug: 'about' },
					],
				},
			],
		}),
	],
});

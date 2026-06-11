// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLlmsTxt from 'starlight-llms-txt';

// Set PUBLIC_GA_ID in Vercel env once the GA4 property exists; analytics is off until then.
const GA_ID = process.env.PUBLIC_GA_ID;

// https://astro.build/config
export default defineConfig({
	site: 'https://handbook.80x.ai',
	// Old (pre-Diataxis) URLs → new homes. Insurance for any external inbound links.
	redirects: {
		'/start/first-workflow': '/learn/build-your-first-workflow',
		'/start/what-are-workflows': '/explanation/what-are-workflows',
		'/start/whats-new': '/explanation/whats-new',
		'/start/credits-and-pricing': '/reference/credits-and-pricing',
		'/concepts/triggers': '/explanation/triggers',
		'/concepts/variables': '/explanation/variables',
		'/concepts/conditions-and-filters': '/explanation/conditions-and-filters',
		'/concepts/records-vs-list-entries': '/explanation/records-vs-list-entries',
		'/concepts/loops': '/explanation/loops',
		'/concepts/permissions-and-access': '/explanation/permissions-and-access',
		'/concepts/runs-and-debugging': '/explanation/runs-and-debugging',
		'/recipes': '/guides',
		'/recipes/enrichment-waterfall': '/guides/capture-and-qualify/enrichment-waterfall',
		'/recipes/signal-scoring': '/guides/capture-and-qualify/signal-scoring',
		'/recipes/webhook-lead-intake': '/guides/capture-and-qualify/webhook-lead-intake',
		'/recipes/round-robin-routing': '/guides/route-and-sequence/round-robin-routing',
		'/recipes/sequence-enrollment': '/guides/route-and-sequence/sequence-enrollment',
		'/recipes/slack-deal-alerts': '/guides/route-and-sequence/slack-deal-alerts',
		'/recipes/stale-deal-sweep': '/guides/pipeline-hygiene/stale-deal-sweep',
		'/recipes/inbound-lead-research': '/guides/signals-and-ai/inbound-lead-research',
		'/advanced': '/guides',
		'/advanced/http-json-patterns': '/guides/platform-patterns/http-json-patterns',
		'/advanced/app-sdk-custom-blocks': '/guides/platform-patterns/app-sdk-custom-blocks',
		'/advanced/ai-agents-playbook': '/guides/signals-and-ai/ai-agents-playbook',
		'/advanced/infinite-loops-and-safety': '/explanation/infinite-loops-and-safety',
		'/advanced/workflow-governance': '/explanation/workflow-governance',
		'/advanced/ai-search-optimization': '/explanation/ai-search-optimization',
		'/migration': '/guides/migrating-from-legacy',
		'/migration/block-changes': '/guides/migrating-from-legacy/block-changes',
		'/migration/pricing-changes': '/guides/migrating-from-legacy/pricing-changes',
	},
	integrations: [
		starlight({
			title: 'Attio Workflows Handbook',
			description:
				'The open-source, definitive guide to Attio’s new Workflows engine — every block documented, credit costs explained, and practical GTM recipes.',
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
			customCss: [
				// Self-hosted fonts (see package.json @fontsource deps)
				'@fontsource-variable/inter',
				'@fontsource/dm-mono/400.css',
				'@fontsource/dm-mono/500.css',
				// GTM Atlas theme — must load last so it wins the cascade
				'./src/styles/atlas.css',
			],
			expressiveCode: {
				// Dark slate code blocks read as intentional against the warm paper page.
				themes: ['github-dark'],
				styleOverrides: { borderRadius: '0.375rem', borderColor: 'transparent' },
			},
			components: {
				Footer: './src/components/Footer.astro',
				Hero: './src/components/Hero.astro',
			},
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
						url: 'https://handbook.80x.ai',
						description:
							'The open-source, definitive guide to the Attio Workflows automation engine.',
						author: { '@type': 'Person', name: 'Dan Hull' },
					}),
				},
				{ tag: 'meta', attrs: { property: 'og:image', content: 'https://handbook.80x.ai/og.png' } },
				{ tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
				{ tag: 'meta', attrs: { name: 'twitter:image', content: 'https://handbook.80x.ai/og.png' } },
				...(GA_ID
					? [
							{ tag: 'script', attrs: { src: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`, async: true } },
							{
								tag: 'script',
								content: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`,
							},
						]
					: []),
			],
			sidebar: [
				{
					label: 'Learn',
					items: [
						{ label: 'Start here', slug: 'learn' },
						{ label: 'Build your first workflow', slug: 'learn/build-your-first-workflow' },
						{ label: '1 · Capture & qualify', slug: 'learn/capture-and-qualify' },
						{ label: '2 · Route & sequence', slug: 'learn/route-and-sequence' },
						{ label: '3 · Keep the pipeline honest', slug: 'learn/keep-the-pipeline-honest' },
						{ label: '4 · Let AI own a stage', slug: 'learn/let-ai-own-a-stage' },
					],
				},
				{
					label: 'Guides',
					items: [
						{ label: 'All guides', slug: 'guides' },
						{ label: 'Capture & qualify', collapsed: true, items: [{ autogenerate: { directory: 'guides/capture-and-qualify' } }] },
						{ label: 'Route & sequence', collapsed: true, items: [{ autogenerate: { directory: 'guides/route-and-sequence' } }] },
						{ label: 'Pipeline hygiene & lifecycle', collapsed: true, items: [{ autogenerate: { directory: 'guides/pipeline-hygiene' } }] },
						{ label: 'Signals & AI', collapsed: true, items: [{ autogenerate: { directory: 'guides/signals-and-ai' } }] },
						{ label: 'Platform patterns', collapsed: true, items: [{ autogenerate: { directory: 'guides/platform-patterns' } }] },
						{
							label: 'Migrating from legacy',
							collapsed: true,
							items: [
								{ label: 'Overview', slug: 'guides/migrating-from-legacy' },
								{ label: 'Block changes', slug: 'guides/migrating-from-legacy/block-changes' },
								{ label: 'Pricing changes', slug: 'guides/migrating-from-legacy/pricing-changes' },
							],
						},
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Overview', slug: 'reference' },
						{ label: 'Credits & pricing', slug: 'reference/credits-and-pricing' },
						{ label: 'Triggers', collapsed: true, items: [{ autogenerate: { directory: 'reference/triggers' } }] },
						{
							label: 'Blocks',
							items: [
								{ label: 'Agents', collapsed: true, items: [{ autogenerate: { directory: 'reference/agents' } }] },
								{ label: 'AI', collapsed: true, items: [{ autogenerate: { directory: 'reference/ai' } }] },
								{ label: 'Records', collapsed: true, items: [{ autogenerate: { directory: 'reference/records' } }] },
								{ label: 'Lists', collapsed: true, items: [{ autogenerate: { directory: 'reference/lists' } }] },
								{ label: 'Sequences', collapsed: true, items: [{ autogenerate: { directory: 'reference/sequences' } }] },
								{ label: 'Tasks', collapsed: true, items: [{ autogenerate: { directory: 'reference/tasks' } }] },
								{ label: 'Calculations', collapsed: true, items: [{ autogenerate: { directory: 'reference/calculations' } }] },
								{ label: 'Conditions', collapsed: true, items: [{ autogenerate: { directory: 'reference/conditions' } }] },
								{ label: 'Delays', collapsed: true, items: [{ autogenerate: { directory: 'reference/delays' } }] },
								{ label: 'Workspace', collapsed: true, items: [{ autogenerate: { directory: 'reference/workspace' } }] },
								{ label: 'Utilities', collapsed: true, items: [{ autogenerate: { directory: 'reference/utilities' } }] },
							],
						},
						{ label: 'Third-party blocks', slug: 'reference/integrations' },
						{ label: 'Variables & expressions', slug: 'reference/variable-syntax' },
						{ label: 'Glossary', slug: 'reference/glossary' },
					],
				},
				{
					label: 'Explanation',
					items: [
						{ label: 'Overview', slug: 'explanation' },
						{ label: 'What are workflows', slug: 'explanation/what-are-workflows' },
						{ label: "What's new in 2026", slug: 'explanation/whats-new' },
						{ label: 'Triggers, explained', slug: 'explanation/triggers' },
						{ label: 'Variables & data passing', slug: 'explanation/variables' },
						{ label: 'Conditions & filters', slug: 'explanation/conditions-and-filters' },
						{ label: 'Records vs list entries', slug: 'explanation/records-vs-list-entries' },
						{ label: 'Runs & debugging', slug: 'explanation/runs-and-debugging' },
						{ label: 'Loops', slug: 'explanation/loops' },
						{ label: 'Infinite loops & safety', slug: 'explanation/infinite-loops-and-safety' },
						{ label: 'Permissions & access', slug: 'explanation/permissions-and-access' },
						{ label: 'Workflow governance', slug: 'explanation/workflow-governance' },
						{ label: 'AI search optimization', slug: 'explanation/ai-search-optimization' },
					],
				},
				{
					label: 'Troubleshooting',
					items: [{ autogenerate: { directory: 'troubleshooting' } }],
				},
				{
					label: 'Pro & Services',
					items: [
						{ label: 'Go Pro', slug: 'pro' },
						{ label: 'About & contributing', slug: 'about' },
						{ label: 'Privacy', slug: 'privacy' },
					],
				},
			],
		}),
	],
});

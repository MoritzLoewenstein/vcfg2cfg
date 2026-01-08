<script lang="ts">
	import { vcfgToCfg } from './lib/vcfgConverter';

	let files: File[] = [];
	let isDragOver = false;
	let combinedContent = '';
	let fileName = 'autoexec.cfg';

	async function convertVcfgFile(vcfgFile: File): Promise<string> {
		const text = await vcfgFile.text();
		return vcfgToCfg(text, vcfgFile.name);
	}

	async function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragOver = false;

		files = Array.from(e.dataTransfer?.files ?? []).filter((f) => f.name.endsWith('.vcfg'));

		const parts = await Promise.all(files.map((file) => convertVcfgFile(file)));
		combinedContent = parts.join('\n\n');
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragOver = true;
	}

	function handleDragLeave() {
		isDragOver = false;
	}

	function downloadFile() {
		if (!combinedContent) return;

		const blob = new Blob([combinedContent], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = fileName;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	function clear() {
		files = [];
		combinedContent = '';
	}
</script>

<main>
	<div class="container">
		<h1>VCFG to CFG Converter</h1>
		<p>Combine your CS2 VCFG files into a single autoexec.cfg for all users</p>

		<div class="info">
			<h3>How to use:</h3>
			<ol>
				<li>In CS2 console, run: <code>host_writeconfig</code></li>
				<li>Get your VCFG files from: <code>Steam\userdata\[YOUR_ID]\730\local\cfg\</code></li>
				<li>Drop your VCFG files below</li>
				<li>Download the generated autoexec.cfg</li>
				<li>
					Place it in: <code
						>SteamLibrary\steamapps\common\Counter-Strike Global Offensive\game\csgo\cfg\</code
					> to use for all users
				</li>
			</ol>
			<p class="note">
				Your Steam ID can be found by checking your profile or looking at existing config files in
				the Steam userdata folder.
			</p>
		</div>

		<div
			class="drop-zone"
			class:active={isDragOver}
			ondrop={handleDrop}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			role="region"
			aria-label="File drop zone"
		>
			<p>Drag and drop VCFG files here</p>
		</div>

		{#if files.length > 0}
			<div class="file-list">
				<h2>Files ({files.length})</h2>
				<ul>
					{#each files as file (file.name)}
						<li>{file.name}</li>
					{/each}
				</ul>
			</div>
		{/if}

		{#if combinedContent}
			<div class="output">
				<h2>Preview</h2>
				<textarea value={combinedContent} readonly></textarea>
			</div>

			<div class="controls">
				<input type="text" bind:value={fileName} placeholder="Output filename" />
				<button onclick={downloadFile} class="download">Download CFG</button>
				<button onclick={clear} class="clear">Clear</button>
			</div>
		{/if}
	</div>
</main>

<style>
	:global(body) {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		background: #0a0e27;
		color: #e1e8ed;
		margin: 0;
		padding: 0;
	}

	main {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		box-sizing: border-box;
 		padding: 20px;
	}

	.container {
		width: 100%;
		max-width: 800px;
		background: #0f1419;
		border-radius: 8px;
		padding: 40px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	h1 {
		margin-top: 0;
		color: #fff;
		font-size: 28px;
	}

	p {
		color: #a0aec0;
		margin-bottom: 24px;
	}

	.info {
		background: #1a202c;
		border-left: 4px solid #63b3ed;
		padding: 16px;
		border-radius: 4px;
		margin-bottom: 24px;
	}

	.info h3 {
		margin-top: 0;
		margin-bottom: 12px;
		font-size: 14px;
		text-transform: uppercase;
		color: #63b3ed;
	}

	.info ol {
		margin: 0 0 12px 0;
		padding-left: 20px;
		color: #a0aec0;
	}

	.info li {
		margin-bottom: 8px;
		line-height: 1.5;
	}

	.info code {
		background: #0f1419;
		padding: 2px 6px;
		border-radius: 3px;
		font-family: 'Monaco', 'Menlo', monospace;
		font-size: 12px;
		color: #90ee90;
	}

	.info .note {
		margin: 0;
		font-size: 12px;
		color: #718096;
		font-style: italic;
	}

	.drop-zone {
		border: 2px dashed #4a5568;
		border-radius: 8px;
		padding: 48px 24px;
		text-align: center;
		cursor: pointer;
		transition: all 0.3s ease;
		background: #1a202c;
	}

	.drop-zone.active {
		border-color: #63b3ed;
		background: #2d3748;
	}

	.drop-zone p {
		margin: 0;
		font-size: 16px;
	}

	.file-list {
		margin-top: 24px;
		padding: 16px;
		background: #1a202c;
		border-radius: 6px;
	}

	.file-list h2 {
		margin-top: 0;
		font-size: 14px;
		text-transform: uppercase;
		color: #a0aec0;
		margin-bottom: 12px;
	}

	.file-list ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.file-list li {
		padding: 8px;
		background: #2d3748;
		margin-bottom: 6px;
		border-radius: 4px;
		font-size: 14px;
		word-break: break-all;
	}

	.output {
		margin-top: 24px;
	}

	.output h2 {
		font-size: 14px;
		text-transform: uppercase;
		color: #a0aec0;
		margin-bottom: 12px;
	}

	textarea {
		width: 100%;
		height: 300px;
		background: #1a202c;
		color: #e1e8ed;
		border: 1px solid #4a5568;
		border-radius: 6px;
		padding: 12px;
		font-family: 'Monaco', 'Menlo', monospace;
		font-size: 12px;
		resize: vertical;
		box-sizing: border-box;
	}

	textarea:focus {
		outline: none;
		border-color: #63b3ed;
	}

	.controls {
		display: flex;
		gap: 12px;
		margin-top: 20px;
	}

	input[type='text'] {
		flex: 1;
		padding: 10px 12px;
		background: #1a202c;
		color: #e1e8ed;
		border: 1px solid #4a5568;
		border-radius: 6px;
		font-size: 14px;
	}

	input[type='text']:focus {
		outline: none;
		border-color: #63b3ed;
	}

	button {
		padding: 10px 20px;
		border: none;
		border-radius: 6px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.download {
		background: #3182ce;
		color: white;
		flex: 1;
	}

	.download:hover {
		background: #2c5aa0;
	}

	.clear {
		background: #4a5568;
		color: #e1e8ed;
	}

	.clear:hover {
		background: #5a6578;
	}
</style>

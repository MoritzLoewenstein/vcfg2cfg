import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { vcfgToCfg } from '../src/lib/vcfgConverter.ts';

const testDataDir = resolve('tests');

function loadTestFile(filename: string): string {
	return readFileSync(resolve(testDataDir, filename), 'utf-8');
}

test('converts cs2_user_convars_0_slot0.vcfg correctly', (t) => {
	const vcfgContent = loadTestFile('cs2_user_convars_0_slot0.vcfg');
	const result = vcfgToCfg(vcfgContent, 'cs2_user_convars_0_slot0.vcfg');

	t.assert.snapshot(result);
});

test('converts cs2_user_keys_0_slot0.vcfg correctly', (t) => {
	const vcfgContent = loadTestFile('cs2_user_keys_0_slot0.vcfg');
	const result = vcfgToCfg(vcfgContent, 'cs2_user_keys_0_slot0.vcfg');

	t.assert.snapshot(result);
});

test('combined output includes all conversions', (t) => {
	const convarsContent = loadTestFile('cs2_user_convars_0_slot0.vcfg');
	const keysContent = loadTestFile('cs2_user_keys_0_slot0.vcfg');

	const convarsResult = vcfgToCfg(convarsContent, 'cs2_user_convars_0_slot0.vcfg');
	const keysResult = vcfgToCfg(keysContent, 'cs2_user_keys_0_slot0.vcfg');

	const combined = convarsResult + '\n' + keysResult;

	t.assert.snapshot(combined);
});

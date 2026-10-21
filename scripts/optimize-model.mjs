// Shrinks a .glb for the web: WebP textures + meshopt geometry, keeping EXT_materials_bump
// (which glTF-Transform does not know and would otherwise drop).
//
//   npm run optimize:model -- <input.glb> [output.glb]
//
// Output defaults to public/models/<input name>.glb
import { basename, join } from 'node:path';
import { Extension, ExtensionProperty, NodeIO, PropertyType, TextureInfo } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { meshopt, prune, textureCompress } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import sharp from 'sharp';

const BUMP = 'EXT_materials_bump';

class Bump extends ExtensionProperty {
  static EXTENSION_NAME = BUMP;
  init() {
    this.extensionName = BUMP;
    this.propertyType = 'Bump';
    this.parentTypes = [PropertyType.MATERIAL];
  }
  getDefaults() {
    return Object.assign(super.getDefaults(), {
      bumpFactor: 1,
      bumpTexture: null,
      bumpTextureInfo: new TextureInfo(this.graph, 'bumpTextureInfo'),
    });
  }
  getBumpFactor() { return this.get('bumpFactor'); }
  setBumpFactor(value) { return this.set('bumpFactor', value); }
  getBumpTexture() { return this.getRef('bumpTexture'); }
  getBumpTextureInfo() { return this.getRef('bumpTexture') ? this.getRef('bumpTextureInfo') : null; }
  setBumpTexture(texture) { return this.setRef('bumpTexture', texture, { channels: 0x0001 }); }
}

class BumpExtension extends Extension {
  static EXTENSION_NAME = BUMP;
  extensionName = BUMP;

  read(context) {
    const json = context.jsonDoc.json;
    (json.materials || []).forEach((def, i) => {
      const ext = def.extensions?.[BUMP];
      if (!ext) return;
      const bump = new Bump(this.document.getGraph());
      context.materials[i].setExtension(BUMP, bump);
      if (ext.bumpFactor !== undefined) bump.setBumpFactor(ext.bumpFactor);
      if (ext.bumpTexture !== undefined) {
        bump.setBumpTexture(context.textures[json.textures[ext.bumpTexture.index].source]);
        context.setTextureInfo(bump.getBumpTextureInfo(), ext.bumpTexture);
      }
    });
    return this;
  }

  write(context) {
    const json = context.jsonDoc.json;
    for (const material of this.document.getRoot().listMaterials()) {
      const bump = material.getExtension(BUMP);
      if (!bump) continue;
      const def = json.materials[context.materialIndexMap.get(material)];
      const out = { bumpFactor: bump.getBumpFactor() };
      if (bump.getBumpTexture()) {
        out.bumpTexture = context.createTextureInfoDef(bump.getBumpTexture(), bump.getBumpTextureInfo());
      }
      def.extensions = { ...def.extensions, [BUMP]: out };
    }
    return this;
  }
}

const [input, outputArg] = process.argv.slice(2);
if (!input) {
  console.error('Usage: npm run optimize:model -- <input.glb> [output.glb]');
  process.exit(1);
}
const output = outputArg || join('public', 'models', basename(input));

await MeshoptEncoder.ready;
const io = new NodeIO()
  .registerExtensions([...ALL_EXTENSIONS, BumpExtension])
  .registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });

const doc = await io.read(input);
await doc.transform(
  prune(),
  textureCompress({ encoder: sharp, targetFormat: 'webp', quality: 85 }),
  meshopt({ encoder: MeshoptEncoder, level: 'medium' })
);
await io.write(output, doc);

const bumped = doc.getRoot().listMaterials().filter((m) => m.getExtension(BUMP)).length;
console.log(`${input} → ${output} (${bumped} material(s) keep ${BUMP})`);

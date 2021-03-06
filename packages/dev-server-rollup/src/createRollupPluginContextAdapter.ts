import path from 'path';
import { Config, FSWatcher, Plugin as WdsPlugin, Context } from '@web/dev-server-core';
import { URL, pathToFileURL, fileURLToPath } from 'url';
import { PluginContext, MinimalPluginContext, TransformPluginContext } from 'rollup';

export function createRollupPluginContextAdapter<
  T extends PluginContext | MinimalPluginContext | TransformPluginContext
>(
  pluginContext: T,
  wdsPlugin: WdsPlugin,
  config: Config,
  fileWatcher: FSWatcher,
  context: Context,
) {
  return {
    ...pluginContext,

    addWatchFile(id: string) {
      const filePath = path.join(process.cwd(), id);
      fileWatcher.add(filePath);
    },

    emitAsset() {
      throw new Error('Emitting files is not yet supported');
    },

    emitFile() {
      throw new Error('Emitting files is not yet supported');
    },

    getAssetFileName() {
      throw new Error('Emitting files is not yet supported');
    },

    getFileName() {
      throw new Error('Emitting files is not yet supported');
    },

    setAssetSource() {
      throw new Error('Emitting files is not yet supported');
    },

    async resolve(source: string, importer: string, options: { skipSelf: boolean }) {
      if (!context) throw new Error('Context is required.');

      for (const pl of config.plugins) {
        if (
          pl.resolveImport &&
          (!options.skipSelf || pl.resolveImport !== wdsPlugin.resolveImport)
        ) {
          const result = await pl.resolveImport({ source, context });
          let resolvedId: string | undefined;
          if (typeof result === 'string') {
            resolvedId = result;
          } else if (typeof result === 'object') {
            resolvedId = result?.id;
          }

          if (resolvedId) {
            const fileUrl = new URL(resolvedId, `${pathToFileURL(importer)}`);
            return { id: fileURLToPath(fileUrl) };
          }
        }
      }
    },

    async resolveId(source: string, importer: string, options: { skipSelf: boolean }) {
      const resolveResult = await this.resolve(source, importer, options);
      if (typeof resolveResult === 'string') {
        return resolveResult;
      }
      if (typeof resolveResult === 'object') {
        return resolveResult?.id;
      }
      return resolveResult;
    },
  };
}

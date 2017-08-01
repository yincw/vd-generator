import { join } from 'path';
import { existsSync, mkdirsSync, readFileSync, copySync } from 'fs-extra';
import reduxReset from './reduxReset';

export default (srcProject, destProject, components) => {
    const srcProjectDir = srcProject.dir;
    const destProjectDir = destProject.dir;
    const dev = srcProject.directory.development;
    const destDev = destProject.directory.development; 
    const comCfgPath = join(srcProjectDir, '.vd', 'components');
    const comPath = join(srcProjectDir, dev.envName, dev.component);
    const conPath = join(srcProjectDir, dev.envName, dev.container);
    const reduxPath = join(srcProjectDir, dev.envName, dev.redux);
    const destComCfgPath = join(destProjectDir, '.vd', 'components');
    const destComPath = join(destProjectDir, destDev.envName, destDev.component);
    const destConPath = join(destProjectDir, destDev.envName, destDev.container);
    const destReduxPath = join(destProjectDir, destDev.envName, destDev.redux);
    if (existsSync(destComCfgPath)) mkdirsSync(destComCfgPath);
    Object.keys(components).forEach(key => {
        if (components[key]) {
            const cfg = JSON.parse(readFileSync(join(comCfgPath, `${key}.json`), 'utf8'));
            copySync(join(comCfgPath, `${key}.json`), join(destComCfgPath, `${key}.json`));
            copySync(join(comPath, key), join(destComPath, key));
            if (cfg.type === 1) {
                copySync(join(conPath, `${key}.js`), join(destConPath, `${key}.js`));
                copySync(join(reduxPath, `${key}.js`), join(destReduxPath, `${key}.js`));
                reduxReset(destReduxPath);
            }
        }
    });
}
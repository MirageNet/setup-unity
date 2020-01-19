import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as tc from '@actions/tool-cache'

async function run(): Promise<void> {
  try {
    let UnityPath = tc.find('unity', '2019.2.18')

    if (UnityPath != null) {
      const UnitySetup64 = await tc.downloadTool(
        'https://netstorage.unity3d.com/unity/bbf64de26e34/Windows64EditorInstaller/UnitySetup64-2019.2.18f1.exe'
      )
      await exec.exec(UnitySetup64, [
        '/S',
        '/D=C:\\Program Files\\Unity_2019.2.18'
      ])

      UnityPath = await tc.cacheDir(
        'C:\\Program Files\\Unity_2019.2.18',
        'unity',
        '2019.2.18'
      )
    }

    core.addPath(`${UnityPath}\\Editor\\`)

    /*
    const node12ExtractedFolder = await tc.extractTar(node12Path, 'path/to/extract/to');

const cachedPath = await tc.cacheDir(node12ExtractedFolder, 'node', '12.7.0');
core.addPath(cachedPath);
*/
    /*
    const ms: string = core.getInput('milliseconds')
    core.debug(`Waiting ${ms} milliseconds ...`)

    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())
    */
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

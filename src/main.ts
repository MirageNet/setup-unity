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
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

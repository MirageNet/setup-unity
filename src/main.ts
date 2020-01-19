import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as tc from '@actions/tool-cache'
import * as fs from 'fs'
import * as os from 'os'

async function run(): Promise<void> {
    try {
        let UnityPath = tc.find('unity', '2019.2.18', os.platform())

        if (UnityPath != null) {
            const UnitySetup64 = await tc.downloadTool(
                'https://netstorage.unity3d.com/unity/bbf64de26e34/Windows64EditorInstaller/UnitySetup64-2019.2.18f1.exe',
                '.\\UnitySetup.exe'
            )

            core.debug(`Running under ${os.platform()}`)
            const exitCode = await exec.exec(fs.realpathSync(UnitySetup64), [
                '/S'
            ])
            core.debug(`exit code ${exitCode}`)

            UnityPath = await tc.cacheDir(
                'C:\\Program Files\\Unity',
                'unity',
                '2019.2.18',
                os.platform()
            )
        }

        core.addPath(`${UnityPath}\\Editor`)

        const license = core.getInput('license')

        if (license != null) {
            fs.writeFileSync('unity-license.ulf', license)

            await exec.exec('Unity.exe', [
                '-nographics',
                '-quit',
                '-batchmode',
                '-manualLicenseFile',
                'unity-license.ulf'
            ])
        }
    } catch (error) {
        core.setFailed(error.message)
    }
}

run()

import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as tc from '@actions/tool-cache'
import * as fs from 'fs'
import * as os from 'os'

async function run(): Promise<void> {
    try {
        const installerUrl = core.getInput('installer')
        const unityVersion = core.getInput('version')

        let UnityPath = tc.find('unity', unityVersion, os.platform())

        if (UnityPath != null) {
            const UnitySetup64 = await tc.downloadTool(
                installerUrl,
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
                unityVersion,
                os.platform()
            )
        }

        core.addPath(`${UnityPath}\\Editor`)

        const license = core.getInput('license')

        if (license !== '' && license !== null) {
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

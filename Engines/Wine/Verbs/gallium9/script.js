const Wine = include("engines.wine.engine.object");
const Resource = include("utils.functions.net.resource");
const { Extractor } = include("utils.functions.filesystem.extract");
const { remove, lns } = include("utils.functions.filesystem.files");
const { fetchGithubReleases, downloadGithubRelease, extractGithubReleaseStrings } = include("utils.functions.net.githubreleases");

const Optional = Java.type("java.util.Optional");

const OverrideDLL = include("engines.wine.plugins.override_dll");

/**
 * Verb to install Gallium 9 Standalone
 * see: https://github.com/iXit/wine-nine-standalone/
 */
class Gallium9 {
    constructor(wine) {
        this.wine = wine;
    }

    /**
     * Sets the used gallium9 version
     *
     * @param {string} gallium9Version The Gallium 9 Standalone version to download
     * @returns {Gallium9} The Gallium9 object
     */
    withVersion(gallium9Version) {
        this.gallium9Version = gallium9Version;

        return this;
    }

    selectGithubVersion(wizard) {
        const versions = fetchGithubReleases("iXit", "wine-nine-standalone", wizard);

        if (!this.gallium9Version || typeof this.gallium9Version !== 'string') {
            return versions[0];
        } else {
            return versions.find(version => version.name === this.gallium9Version);
        }
    }

    go() {
        const wizard = this.wine.wizard();
        const prefixDirectory = this.wine.prefixDirectory();
        const system32directory = this.wine.system32directory();

        const selectedVersion = this.selectGithubVersion(wizard);

        wizard.message(
            tr(
                "Using Gallium 9 requires to have a driver supporting the Gallium 9 state tracker, as well as d3dapater9.so installed (ex: libd3d9adapter-mesa package). Please be sure it is installed (both 32 and 64 bits)."
            )
        );

        const setupFile = downloadGithubRelease(selectedVersion, wizard);

        new Extractor()
            .wizard(wizard)
            .archive(setupFile)
            .to(prefixDirectory)
            .extract();

        remove(`${system32directory}/d3d9.dll`);

        lns(`${prefixDirectory}/gallium-nine-standalone/lib32/d3d9-nine.dll.so`, `${system32directory}/d3d9-nine.dll`);
        lns(
            `${prefixDirectory}/gallium-nine-standalone/bin32/ninewinecfg.exe.so`,
            `${system32directory}/ninewinecfg.exe`
        );
        lns(`${system32directory}/d3d9-nine.dll`, `${system32directory}/d3d9.dll`);

        if (this.wine.architecture() == "amd64") {
            const system64directory = this.wine.system64directory();

            remove(`${system64directory}/d3d9.dll`);

            lns(
                `${prefixDirectory}/gallium-nine-standalone/lib64/d3d9-nine.dll.so`,
                `${system64directory}/d3d9-nine.dll`
            );
            lns(
                `${prefixDirectory}/gallium-nine-standalone/bin64/ninewinecfg.exe.so`,
                `${system64directory}/ninewinecfg.exe`
            );
            lns(`${system64directory}/d3d9-nine.dll`, `${system64directory}/d3d9.dll`);

            this.wine.run(`${system64directory}/ninewinecfg.exe`, ["-e"], null, false, true);
        } else {
            this.wine.run(`${system32directory}/ninewinecfg.exe`, ["-e"], null, false, true);
        }

        new OverrideDLL(this.wine).withMode("native", ["d3d9"]).go();
    }

    static install(container) {
        const wine = new Wine();
        const wizard = SetupWizard(InstallationType.VERBS, "gallium9", Optional.empty());

        const versions = fetchGithubReleases("iXit", "wine-nine-standalone", wizard);
        const versionStrings = extractGithubReleaseStrings(versions);

        const selectedVersion = wizard.menu(tr("Please select the version."), versionStrings, versionStrings[0]);

        wine.prefix(container);
        wine.wizard(wizard);

        // install selected version
        new Gallium9(wine).withVersion(selectedVersion.text).go();

        wizard.close();
    }
}

module.default = Gallium9;

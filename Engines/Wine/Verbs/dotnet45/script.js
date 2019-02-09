include(["engines", "wine", "engine", "object"]);
include(["engines", "wine", "plugins", "override_dll"]);
include(["engines", "wine", "plugins", "windows_version"]);
include(["utils", "functions", "net", "resource"]);
include(["engines", "wine", "verbs", "dotnet40"]);
include(["engines", "wine", "verbs", "remove_mono"]);

/**
* Verb to install .NET 4.5
* @returns {Wine} Wine object
*/
Wine.prototype.dotnet45 = function () {
    if (this.architecture() == "amd64") {
        print(tr("This package ({0}) may not fully work on a 64-bit installation. 32-bit prefixes may work better.", "dotnet45"));
    }

    var osVersion = this.windowsVersion();

    var setupFile = new Resource()
        .wizard(this.wizard())
        .url("http://download.microsoft.com/download/b/a/4/ba4a7e71-2906-4b2d-a0e1-80cf16844f5f/dotnetfx45_full_x86_x64.exe")
        .checksum("b2ff712ca0947040ca0b8e9bd7436a3c3524bb5d")
        .name("dotnetfx45_full_x86_x64.exe")
        .get();

    this.remove_mono();

    this.dotnet40();
    this.windowsVersion("win7");

    this.overrideDLL()
        .set("builtin", ["fusion"])
        .do();

    this.wizard().wait(tr("Please wait while {0} is installed...", ".NET Framework 4.5"));
    this.run(setupFile, [setupFile, "/q", "/c:\"install.exe /q\""], null, false, true);

    this.wizard().wait(tr("Please wait..."));
    this.run("reg", ["delete", "HKCU\\Software\\Wine\\DllOverrides\\*fusion", "/f"], null, false, true);

    this.overrideDLL()
        .set("native", ["mscoree"])
        .do();

    this.windowsVersion(osVersion);

    if (osVersion != "win2003") {
        print(tr("{0} applications can have issues when windows version is not set to \"win2003\"", ".NET 4.5"));
    }

    return this;
};

/**
 * Verb to install .NET 4.5
*/
var verbImplementation = {
    install: function (container) {
        var wine = new Wine();
        wine.prefix(container);
        var wizard = SetupWizard(InstallationType.VERBS, "dotnet45", java.util.Optional.empty());
        wine.wizard(wizard);
        wine.dotnet45();
        wizard.close();
    }
};

/* exported Verb */
var Verb = Java.extend(org.phoenicis.engines.Verb, verbImplementation);

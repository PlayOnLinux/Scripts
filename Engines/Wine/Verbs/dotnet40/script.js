include(["engines", "wine", "engine", "object"]);
include(["engines", "wine", "plugins", "override_dll"]);
include(["utils", "functions", "net", "resource"]);
include(["engines", "wine", "verbs", "luna"]);
include(["utils", "functions", "filesystem", "files"]);
include(["engines", "wine", "plugins", "windows_version"]);

/**
* Verb to install .NET 4.0
* @returns {Wine} Wine object
*/
Wine.prototype.dotnet40 = function () {
    if (this.architecture = "amd64") {
        print(tr("This package ({0}) may not fully work on a 64-bit installation. 32-bit prefixes may work better.", "dotnet40"));
    }

    var osVersion = this.windowsVersion();
    if (osVersion == null)
        osVersion = "winxp";

    var setupFile = new Resource()
        .wizard(this.wizard())
        .url("http://download.microsoft.com/download/9/5/A/95A9616B-7A37-4AF6-BC36-D6EA96C8DAAE/dotNetFx40_Full_x86_x64.exe")
        .checksum("58da3d74db353aad03588cbb5cea8234166d8b99")
        .name("dotNetFx40_Full_x86_x64.exe")
        .get();

    this.uninstall("Mono");

    this.windowsVersion("winxp");

    this.overrideDLL()
        .set("builtin", ["fusion"])
        .do();

    this.wizard().wait(tr("Please wait while {0} is installed...", ".NET Framework 4.0"));
    this.run(setupFile, [setupFile, "/q", "/c:\"install.exe /q\""], null, false, true);

    this.wizard().wait(tr("Please wait..."));
    this.run("reg", ["delete", "HKCU\\Software\\Wine\\DllOverrides", "/v", "*fusion", "/f"], null, false, true);

    this.overrideDLL()
        .set("native", ["mscoree"])
        .do();

    this.wizard().wait(tr("Please wait..."));
    this.run("reg", ["add", "HKLM\\Software\\Microsoft\\NET Framework Setup\\NDP\\v4\\Full", "/v", "Install", "/t", "REG_DWORD", "/d", "0001", "/f"], null, false, true);
    this.wizard().wait(tr("Please wait..."));
    this.run("reg", ["add", "HKLM\\Software\\Microsoft\\NET Framework Setup\\NDP\\v4\\Full", "/v", "Version", "/t", "REG_SZ", "/d", "4.0.30319", "/f"], null, false, true);

    //This is in winetricks source, but does not seem to work
    //this.wizard().wait(tr("Please wait while executing ngen..."));
    //this.run(this.prefixDirectory() + "/drive_c/windows/Microsoft.NET/Framework/v4.0.30319/ngen.exe", "executequeueditems", null, false, true);

    this.windowsVersion(osVersion);

    return this;
};

/**
 * Verb to install .NET 4.0
*/
var verbImplementation = {
    install: function (container) {
        var wine = new Wine();
        wine.prefix(container);
        var wizard = SetupWizard(InstallationType.VERBS, "dotnet40", java.util.Optional.empty());
        wine.wizard(wizard);
        wine.dotnet40();
        wizard.close();
    }
};

/* exported Verb */
var Verb = Java.extend(org.phoenicis.engines.Verb, verbImplementation);

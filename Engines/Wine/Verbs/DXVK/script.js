include(["engines", "wine", "engine", "object"]);
include(["engines", "wine", "plugins", "override_dll"]);
include(["utils", "functions", "net", "resource"]);
include(["utils", "functions", "filesystem", "files"]);

/**
* Setup DXVK-> https://github.com/doitsujin/dxvk/
* @returns {Wine} Wine object
*/
Wine.prototype.DXVK = function () {
    print("NOTE: you need a driver that supports Vulkan enough to run DXVK");
    print("NOTE: wine version should be greater or equal to 3.10");
    
    var releaseFile = new Resource()
        .wizzard(this.wizzard())
        .url("https://github.com/doitsujin/dxvk/blob/master/RELEASE")
        .name("RELEASE.txt")
        .get();
    
    var dxvkVersion = function cat(this.prefixDirectory() + "RELEASE.txt");

    var setupFile = new Resource()
        .wizard(this.wizard())
        .url("https://github.com/doitsujin/dxvk/releases/download/v" + dxvkVersion + "/dxvk-" + dxvkVersion + ".tar.gz")
        .name("dxvk-" + dxvkVersion + ".tar.gz")
        .get();

    new Extractor()
        .wizard(this.wizard())
        .archive(setupFile)
        .to(this.prefixDirectory() + "/TMP/")
        .extract();

    var dxvkTmpDir = this.prefixDirectory() + "/TMP/dxvk-" + dxvkVersion;

    if (this.architecture() == "x86") {
        cp(dxvkTmpDir + "/x32/d3d11.dll", this.system32directory());
        cp(dxvkTmpDir + "/x32/dxgi.dll", this.system32directory());
    }

    if (this.architecture() == "amd64") {
        cp(dxvkTmpDir + "/x32/d3d11.dll", this.system64directory());
        cp(dxvkTmpDir + "/x32/dxgi.dll", this.system64directory());

        cp(dxvkTmpDir + "/x64/d3d11.dll", this.system32directory());
        cp(dxvkTmpDir + "/x64/dxgi.dll", this.system32directory());
    }

    this.overrideDLL()
        .set("native", ["d3d11", "dxgi"])
        .do();

    remove(this.prefixDirectory() + "/TMP/");

    return this;
}

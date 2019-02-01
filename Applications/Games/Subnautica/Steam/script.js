include(["engines", "wine", "quick_script", "steam_script"]);
include(["engines", "wine", "plugins", "regedit"]);
include(["engines", "wine", "plugins", "virtual_desktop"]);
include(["engines", "wine", "verbs", "vcrun2013"]);
include(["engines", "wine", "verbs", "d3dx11"]);
include(["engines", "wine", "verbs", "corefonts"]);
include(["engines", "wine", "verbs", "dxvk"]);
include(["utils", "functions", "apps", "resources"]);

var installerImplementation = {
    run: function () {
        new SteamScript()
            .name("Subnautica")
            .editor("Unknown Worlds Entertainment")
            .author("Zemogiter")
            .applicationHomepage("https://unknownworlds.com/subnautica/")
            .wineDistribution("upstream")
            .wineVersion("4.0")
            .wineArchitecture("amd64")
            .appId(264710)
            .preInstall(function (wine, wizard) {
                wizard.message(tr("Please ensure you have the latest drivers (418.30 minimum for NVIDIA and mesa 19 for AMD) or else this game might not work correctly."));
                wizard.message(tr("You can make the game smoother by using this: https://github.com/lutris/lutris/wiki/How-to:-Esync"));
                wine.vcrun2013();
                wine.corefonts();
                wine.d3dx11();
                wine.DXVK();
                var screenSize = java.awt.Toolkit.getDefaultToolkit().getScreenSize();
                wine.setVirtualDesktop(screenSize.width, screenSize.height);
                var registrySettings = new AppResource().application([TYPE_ID, CATEGORY_ID, APPLICATION_ID]).get("fix.reg");
                wine.regedit().patch(registrySettings);
            })
            .postInstall(function (wine, wizard) {
                wizard.message(tr("Due to potential confilct with Vulkan, shader mods break the game (the executable file works but no window is displayed)."));
            })
            .gameOverlay(false)
            .go();
    }
};

/* exported Installer */
var Installer = Java.extend(org.phoenicis.scripts.Installer, installerImplementation);
